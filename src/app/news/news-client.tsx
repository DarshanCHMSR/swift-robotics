'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ExternalLink, Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function NewsClient({ initialArticles }: { initialArticles: any[] }) {
  const [search, setSearch] = useState('')

  const filteredArticles = initialArticles.filter((article) => {
    if (!search.trim()) return true
    const term = search.toLowerCase()
    return (
      article.title.toLowerCase().includes(term) ||
      (article.aiAnalysis?.summary || '').toLowerCase().includes(term) ||
      (article.aiAnalysis?.category || '').toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search news, topics, summaries..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground border rounded-lg bg-muted/20">
            No articles found.
          </div>
        ) : (
          filteredArticles.map((article) => (
            <Card key={article.id} className={`flex flex-col ${article.aiAnalysis?.noise ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-2">
                    {article.aiAnalysis?.noise && <Badge variant="destructive">Noise</Badge>}
                    <Badge variant="outline">{article.aiAnalysis?.category || 'Uncategorized'}</Badge>
                  </div>
                  {article.aiAnalysis && !article.aiAnalysis.noise && (
                    <Badge variant="secondary" className="font-bold">
                      {article.aiAnalysis.importanceScore}/10
                    </Badge>
                  )}
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
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full justify-start text-primary" onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}>
                  <ExternalLink className="h-4 w-4 mr-2" /> Read original
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

// Needed to wrap a component
import { Button } from '@/components/ui/button'
