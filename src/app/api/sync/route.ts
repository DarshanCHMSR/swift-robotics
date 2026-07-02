export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { GuardianProvider } from '@/lib/news-providers/guardian-provider'
import { NewsApiProvider } from '@/lib/news-providers/newsapi-provider'
import { getStringSimilarity } from '@/lib/utils'
import { NormalizedArticle } from '@/lib/news-providers/provider'

export async function GET() {
  try {
    const sources = await prisma.source.findMany({ where: { enabled: true } })
    const countries = await prisma.country.findMany({ where: { status: true } })
    const topics = await prisma.topic.findMany({ where: { enabled: true } })

    // 1. Load all enabled providers
    const providers = [
      new GuardianProvider(),
      new NewsApiProvider(),
    ]

    // 2. Fetch articles from every provider in parallel
    const providerPromises = providers.map(p => 
      p.fetchNews(sources, topics, countries).catch(err => {
        console.error(`Provider ${p.name} failed:`, err)
        return [] // Return empty array on failure to gracefully continue
      })
    )

    const results = await Promise.all(providerPromises)
    const allArticles = results.flat()

    // 3 & 4. Remove duplicate URLs and similar titles
    const uniqueArticles: NormalizedArticle[] = []

    for (const article of allArticles) {
      if (!article.url || !article.title) continue

      // Check against already aggregated unique articles in memory
      let isDuplicate = false
      for (const unique of uniqueArticles) {
        if (unique.url === article.url) {
          isDuplicate = true
          break
        }
        if (unique.title === article.title) {
          isDuplicate = true
          break
        }
        const similarity = getStringSimilarity(unique.title, article.title)
        if (similarity > 0.9) {
          isDuplicate = true
          break
        }
      }

      if (isDuplicate) continue

      // Check against database articles to ensure no duplicates are saved
      // First check exact URL
      const dbExact = await prisma.article.findUnique({ where: { url: article.url } })
      if (dbExact) continue

      // Check similar titles in DB (we fetch all recent titles or search)
      // To optimize and avoid N+1 querying the entire DB, we'll fetch recent articles once
      // We will do this properly later if needed, but for now we'll fetch the last 1000 titles to compare
      uniqueArticles.push(article)
    }

    // Now filter against DB specifically for title similarity
    const recentDbArticles = await prisma.article.findMany({
      select: { title: true, url: true },
      orderBy: { createdAt: 'desc' },
      take: 1000
    })

    const finalArticlesToSave = uniqueArticles.filter(newArt => {
      for (const dbArt of recentDbArticles) {
        if (dbArt.url === newArt.url || dbArt.title === newArt.title) return false
        if (getStringSimilarity(dbArt.title, newArt.title) > 0.9) return false
      }
      return true
    })

    // 5. Save only new articles
    let articlesAdded = 0
    
    // Batch insert using createMany is not supported nicely for connecting relations if relations exist, 
    // but since countryId is just an Int, we can map it.
    if (finalArticlesToSave.length > 0) {
      const dataToInsert = finalArticlesToSave.map(item => {
        let countryId = null
        if (item.country) {
          const c = countries.find(c => c.name === item.country)
          if (c) countryId = c.id
        }

        // Match sourceId if it exists
        let sourceId = null
        const s = sources.find(s => s.name === item.source)
        if (s) sourceId = s.id

        return {
          title: item.title,
          description: item.description,
          content: item.content,
          url: item.url,
          publishedAt: item.publishedAt,
          countryId,
          sourceId,
          rawData: JSON.stringify(item.raw),
        }
      })

      await prisma.article.createMany({
        data: dataToInsert,
        skipDuplicates: true // Prisma native deduplication on @unique constraints
      })
      
      articlesAdded = finalArticlesToSave.length
    }

    // 6. Trigger AI processing exactly like before
    if (articlesAdded > 0) {
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/process-ai`).catch(console.error)
    }

    return NextResponse.json({ success: true, articlesAdded })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
