export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import Parser from 'rss-parser'

const parser = new Parser()

export async function GET() {
  try {
    const sources = await prisma.source.findMany({ where: { enabled: true } })
    const countries = await prisma.country.findMany({ where: { status: true } })
    const topics = await prisma.topic.findMany({ where: { enabled: true } })
    const competitors = await prisma.competitor.findMany({ where: { enabled: true } })

    let articlesAdded = 0

    // Add Guardian API explicitly for MVP demonstration as requested
    const guardianApiUrl = 'https://content.guardianapis.com/search?page=2&q=debate&show-fields=bodyText&api-key=35304f8d-9a35-426b-bb00-8ca7984bc8ac'
    
    // Create a virtual source list containing DB sources + Guardian API
    const allSourcesToFetch = [...sources]
    
    // If Guardian API isn't in DB, add a virtual one for this loop
    if (!sources.some(s => s.apiUrl.includes('content.guardianapis.com'))) {
      allSourcesToFetch.push({
        id: -1, // virtual id
        name: 'The Guardian (API)',
        apiUrl: guardianApiUrl,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    for (const source of allSourcesToFetch) {
      try {
        let items: any[] = []
        let isGuardian = false

        if (source.apiUrl.includes('content.guardianapis.com')) {
          isGuardian = true
          // Construct URL using keywords from topics and countries
          // For MVP, we'll just use the base URL but make sure show-fields=bodyText is present
          const fetchUrl = source.apiUrl.includes('show-fields=bodyText') 
            ? source.apiUrl 
            : `${source.apiUrl}&show-fields=bodyText`
            
          const res = await fetch(fetchUrl)
          const data = await res.json()
          
          if (data.response && data.response.results) {
            items = data.response.results.map((r: any) => ({
              title: r.webTitle,
              content: r.fields?.bodyText || '',
              url: r.webUrl,
              publishedAt: new Date(r.webPublicationDate),
              raw: r
            }))
          }
        } else {
          // Fallback to RSS Parsing
          const feed = await parser.parseURL(source.apiUrl)
          items = feed.items.map(item => ({
            title: item.title || '',
            content: item.contentSnippet || item.content || '',
            url: item.link || '',
            publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
            raw: item
          }))
        }

        for (const item of items) {
          if (!item.title || !item.url) continue

          const existing = await prisma.article.findUnique({ where: { url: item.url } })
          if (existing) continue

          let countryId = null
          for (const c of countries) {
            if (item.title.toLowerCase().includes(c.name.toLowerCase()) || 
                item.content.toLowerCase().includes(c.name.toLowerCase())) {
              countryId = c.id
              break
            }
          }

          // Use the real sourceId if it exists in DB, otherwise null
          const dbSourceId = source.id === -1 ? null : source.id

          await prisma.article.create({
            data: {
              title: item.title,
              description: item.content.substring(0, 500),
              content: item.content,
              url: item.url,
              publishedAt: item.publishedAt,
              countryId,
              sourceId: dbSourceId,
              rawData: JSON.stringify(item.raw),
            }
          })
          articlesAdded++
        }
      } catch (err) {
        console.error(`Failed to parse source ${source.name}`, err)
      }
    }

    // Trigger AI processing
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/process-ai`).catch(console.error)

    return NextResponse.json({ success: true, articlesAdded })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
