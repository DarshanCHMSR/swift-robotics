import prisma from '@/lib/prisma'
import NewsClient from './news-client'

export const revalidate = 0

export default async function NewsPage() {
  const articles = await prisma.article.findMany({
    include: {
      aiAnalysis: true,
      source: true,
      country: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 50, // Limit for MVP
  })

  const serializedArticles = articles.map(a => ({
    ...a,
    publishedAt: a.publishedAt.toISOString(),
    createdAt: a.createdAt.toISOString(),
    aiAnalysis: a.aiAnalysis ? {
      ...a.aiAnalysis,
      processedAt: a.aiAnalysis.processedAt.toISOString(),
    } : null
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">All News</h2>
        <p className="text-muted-foreground">Browse all fetched articles, including noise.</p>
      </div>
      
      <NewsClient initialArticles={serializedArticles as any} />
    </div>
  )
}
