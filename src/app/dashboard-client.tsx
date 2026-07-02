'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, ExternalLink, Activity, Database, Filter, Globe, Link2, Hash } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

export default function DashboardClient({ 
  initialArticles, 
  initialStats 
}: { 
  initialArticles: any[],
  initialStats: any
}) {
  const [loading, setLoading] = useState(false)

  const handleRefresh = async () => {
    setLoading(true)
    toast.info('Fetching latest news from all providers...')
    try {
      const res = await fetch('/api/sync')
      const data = await res.json()
      if (data.success) {
        toast.success(`Fetched ${data.articlesAdded} new articles. AI processing started. Refresh page shortly.`)
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
    if (s.includes('positive')) return 'default'
    if (s.includes('negative')) return 'destructive'
    return 'secondary'
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button onClick={handleRefresh} disabled={loading} className="gap-2">
          <RefreshCw className={loading ? 'animate-spin h-4 w-4' : 'h-4 w-4'} />
          Manual Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center gap-2"><Database className="h-4 w-4 text-primary" /> Total Articles</CardDescription>
            <CardTitle className="text-2xl">{initialStats?.totalArticles || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center gap-2"><Activity className="h-4 w-4 text-emerald-500" /> Important News</CardDescription>
            <CardTitle className="text-2xl">{initialStats?.importantArticles || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center gap-2"><Filter className="h-4 w-4 text-destructive" /> Noise Filtered</CardDescription>
            <CardTitle className="text-2xl">{initialStats?.noiseFiltered || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center gap-2"><Globe className="h-4 w-4 text-blue-500" /> Countries</CardDescription>
            <CardTitle className="text-2xl">{initialStats?.countriesCount || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center gap-2"><Link2 className="h-4 w-4 text-orange-500" /> Sources</CardDescription>
            <CardTitle className="text-2xl">{initialStats?.sourcesCount || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center gap-2"><Hash className="h-4 w-4 text-purple-500" /> Topics Tracked</CardDescription>
            <CardTitle className="text-2xl">{initialStats?.topicsCount || 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <h3 className="text-xl font-bold tracking-tight mt-8">High Impact Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialArticles.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground border rounded-lg bg-muted/20">
            No important news available right now. Try refreshing!
          </div>
        ) : (
          initialArticles.map((article) => {
            const matchedTopics = article.aiAnalysis?.matchedTopics || []
            const mentionedCompetitors = article.aiAnalysis?.mentionedCompetitors || []
            const importanceReason = article.aiAnalysis?.importanceReason || article.aiAnalysis?.reason

            return (
              <Card key={article.id} className="flex flex-col shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <Badge variant={getSentimentColor(article.aiAnalysis?.sentiment)}>
                      {article.aiAnalysis?.sentiment || 'Neutral'}
                    </Badge>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-white">{article.aiAnalysis?.category || 'General'}</Badge>
                      <Badge variant="secondary" className="font-bold text-primary">
                        Score: {article.aiAnalysis?.importanceScore}/10
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-3 line-clamp-2 leading-snug" title={article.title}>
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-xs font-medium text-muted-foreground">
                    {article.source?.name || 'Unknown Source'} • {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  {/* Importance Explanation Box */}
                  {importanceReason && (
                    <div className="text-xs bg-primary/5 p-3 rounded-md border border-primary/20 text-primary-foreground text-slate-800">
                      <span className="font-bold block mb-1 text-primary">Why it matters:</span>
                      {importanceReason}
                    </div>
                  )}

                  <p className="text-sm text-slate-600 line-clamp-3">
                    {article.aiAnalysis?.summary || article.description}
                  </p>

                  {/* Chips for Topics and Competitors */}
                  {(matchedTopics.length > 0 || mentionedCompetitors.length > 0) && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {matchedTopics.map((t: string) => (
                        <Badge key={t} variant="secondary" className="text-[10px] py-0 border-primary/20 text-primary">#{t}</Badge>
                      ))}
                      {mentionedCompetitors.map((c: string) => (
                        <Badge key={c} variant="outline" className="text-[10px] py-0 border-orange-200 text-orange-700 bg-orange-50/50">@{c}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0 border-t bg-slate-50/50 rounded-b-xl flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-primary hover:bg-primary/10 mt-2" onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}>
                    <ExternalLink className="h-4 w-4 mr-2" /> Read Full Article
                  </Button>
                </CardFooter>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
