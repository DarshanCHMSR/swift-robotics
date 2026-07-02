'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ExternalLink, Search, FilterX } from 'lucide-react'
import { formatDistanceToNow, isAfter, subDays } from 'date-fns'
import { Button } from '@/components/ui/button'

export default function NewsClient({ initialArticles }: { initialArticles: any[] }) {
  const [search, setSearch] = useState('')
  const [countryFilter, setCountryFilter] = useState('All')
  const [topicFilter, setTopicFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [sentimentFilter, setSentimentFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [importanceFilter, setImportanceFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('All')

  // Extract unique filter options dynamically from data
  const { countries, topics, sources, sentiments, categories } = useMemo(() => {
    const c = new Set<string>()
    const t = new Set<string>()
    const s = new Set<string>()
    const sent = new Set<string>()
    const cat = new Set<string>()

    initialArticles.forEach(a => {
      if (a.country?.name) c.add(a.country.name)
      if (a.source?.name) s.add(a.source.name)
      if (a.aiAnalysis?.sentiment) sent.add(a.aiAnalysis.sentiment)
      if (a.aiAnalysis?.category) cat.add(a.aiAnalysis.category)
      if (a.aiAnalysis?.matchedTopics) {
        a.aiAnalysis.matchedTopics.forEach((topic: string) => t.add(topic))
      }
    })

    return {
      countries: Array.from(c).sort(),
      topics: Array.from(t).sort(),
      sources: Array.from(s).sort(),
      sentiments: Array.from(sent).sort(),
      categories: Array.from(cat).sort()
    }
  }, [initialArticles])

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      // 1. Search Filter
      if (search.trim()) {
        const term = search.toLowerCase()
        const matchesText = 
          article.title.toLowerCase().includes(term) ||
          (article.aiAnalysis?.summary || '').toLowerCase().includes(term) ||
          (article.aiAnalysis?.category || '').toLowerCase().includes(term)
        if (!matchesText) return false
      }

      // 2. Country Filter
      if (countryFilter !== 'All') {
        if (article.country?.name !== countryFilter) return false
      }

      // 3. Topic Filter
      if (topicFilter !== 'All') {
        if (!article.aiAnalysis?.matchedTopics?.includes(topicFilter)) return false
      }

      // 4. Source Filter
      if (sourceFilter !== 'All') {
        if (article.source?.name !== sourceFilter) return false
      }

      // 5. Sentiment Filter
      if (sentimentFilter !== 'All') {
        if (article.aiAnalysis?.sentiment !== sentimentFilter) return false
      }

      // 6. Category Filter
      if (categoryFilter !== 'All') {
        if (article.aiAnalysis?.category !== categoryFilter) return false
      }

      // 7. Importance Filter
      if (importanceFilter !== 'All') {
        const score = article.aiAnalysis?.importanceScore || 0
        if (importanceFilter === 'High' && score < 8) return false
        if (importanceFilter === 'Medium' && (score < 5 || score >= 8)) return false
        if (importanceFilter === 'Low' && score >= 5) return false
      }

      // 8. Date Filter
      if (dateFilter !== 'All') {
        const pubDate = new Date(article.publishedAt)
        const today = new Date()
        if (dateFilter === 'Today' && !isAfter(pubDate, subDays(today, 1))) return false
        if (dateFilter === 'Last 7 Days' && !isAfter(pubDate, subDays(today, 7))) return false
        if (dateFilter === 'Last 30 Days' && !isAfter(pubDate, subDays(today, 30))) return false
      }

      return true
    })
  }, [
    initialArticles, search, countryFilter, topicFilter, sourceFilter, 
    sentimentFilter, categoryFilter, importanceFilter, dateFilter
  ])

  const clearFilters = () => {
    setSearch('')
    setCountryFilter('All')
    setTopicFilter('All')
    setSourceFilter('All')
    setSentimentFilter('All')
    setCategoryFilter('All')
    setImportanceFilter('All')
    setDateFilter('All')
  }

  const SelectClass = "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-card p-4 rounded-xl border shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news, topics, summaries..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={clearFilters} className="shrink-0" title="Clear Filters">
            <FilterX className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <select className={SelectClass} value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
            <option value="All">All Countries</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className={SelectClass} value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
            <option value="All">All Topics</option>
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select className={SelectClass} value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
            <option value="All">All Sources</option>
            {sources.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select className={SelectClass} value={sentimentFilter} onChange={(e) => setSentimentFilter(e.target.value)}>
            <option value="All">All Sentiments</option>
            {sentiments.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select className={SelectClass} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className={SelectClass} value={importanceFilter} onChange={(e) => setImportanceFilter(e.target.value)}>
            <option value="All">All Importance</option>
            <option value="High">High (&ge; 8)</option>
            <option value="Medium">Medium (5-7)</option>
            <option value="Low">Low (&lt; 5)</option>
          </select>

          <select className={SelectClass} value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="All">All Time</option>
            <option value="Today">Today</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredArticles.length} of {initialArticles.length} articles
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground border rounded-lg bg-muted/20">
            No articles found matching your filters.
          </div>
        ) : (
          filteredArticles.map((article) => {
            const matchedTopics = article.aiAnalysis?.matchedTopics || []
            const mentionedCompetitors = article.aiAnalysis?.mentionedCompetitors || []

            return (
              <Card key={article.id} className={`flex flex-col shadow-sm border-slate-200 hover:shadow-md transition-shadow ${article.aiAnalysis?.noise ? 'opacity-60 bg-muted/30' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-2">
                      {article.aiAnalysis?.noise && <Badge variant="destructive">Noise</Badge>}
                      <Badge variant="outline" className="bg-white">{article.aiAnalysis?.category || 'Uncategorized'}</Badge>
                    </div>
                    {article.aiAnalysis && !article.aiAnalysis.noise && (
                      <Badge variant="secondary" className="font-bold text-primary">
                        Score: {article.aiAnalysis.importanceScore}/10
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-3 line-clamp-2 leading-snug" title={article.title}>
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-xs font-medium text-muted-foreground">
                    {article.source?.name || 'Unknown Source'} • {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {article.aiAnalysis?.summary || article.description}
                  </p>

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
