'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

export default function DashboardClient({ initialArticles }: { initialArticles: any[] }) {
  const [loading, setLoading] = useState(false)

  const handleRefresh = async () => {
    setLoading(true)
    toast.info('Fetching latest news...')
    try {
      const res = await fetch('/api/sync')
      const data = await res.json()
      if (data.success) {
        toast.success(`Fetched ${data.articlesAdded} new articles. AI processing started. Refresh page in a minute.`)
      } else {
        toast.error('Failed to sync: ' + data.error)
      }
    } catch (error) {
      toast.error('Sync failed')
    }
    setLoading(false)
  }

  const getSentimentColor = (sentiment: string) => {
    if (!sentiment) return 'secondary'
    const s = sentiment.toLowerCase()
    if (s.includes('positive')) return 'default' // green-ish in custom themes, default is primary
    if (s.includes('negative')) return 'destructive'
    return 'secondary'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleRefresh} disabled={loading} className="gap-2">
          <RefreshCw className={loading ? 'animate-spin h-4 w-4' : 'h-4 w-4'} />
          Manual Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialArticles.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground border rounded-lg bg-muted/20">
            No important news available right now. Try refreshing!
          </div>
        ) : (
          initialArticles.map((article) => (
            <Card key={article.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <Badge variant={getSentimentColor(article.aiAnalysis?.sentiment)}>
                    {article.aiAnalysis?.sentiment || 'Neutral'}
                  </Badge>
                  <div className="flex gap-2">
                    <Badge variant="outline">{article.aiAnalysis?.category || 'General'}</Badge>
                    <Badge variant="secondary" className="font-bold">
                      {article.aiAnalysis?.importanceScore}/10
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg mt-3 line-clamp-2" title={article.title}>
                  {article.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {article.source?.name} • {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {article.aiAnalysis?.summary || article.description}
                </p>
                {article.aiAnalysis?.reason && (
                  <div className="text-xs bg-muted/50 p-2 rounded-md border">
                    <span className="font-semibold block mb-1">Why it matters:</span>
                    {article.aiAnalysis.reason}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full justify-start text-primary" onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}>
                  <ExternalLink className="h-4 w-4 mr-2" /> Read original article
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
