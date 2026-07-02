import prisma from '@/lib/prisma'
import DashboardClient from './dashboard-client'

export const revalidate = 0

export default async function Home() {
  const articles = await prisma.article.findMany({
    where: {
      aiAnalysis: {
        noise: false,
        importanceScore: { gte: 6 }, // Only show important news
      }
    },
    include: {
      aiAnalysis: true,
      source: true,
      country: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  })

  // We need to pass serializable data to the client component
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Latest important economic updates.</p>
        </div>
      </div>
      
      <DashboardClient initialArticles={serializedArticles as any} />
    </div>
  )
}
