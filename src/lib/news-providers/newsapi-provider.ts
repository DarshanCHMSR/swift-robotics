import { NewsProvider, NormalizedArticle } from './provider'

export class NewsApiProvider implements NewsProvider {
  name = 'NewsAPI'
  private apiKey = process.env.NEWS_API_KEY || 'e484729b09ce4db7b1601167879bc715' // Provided by user

  async fetchNews(
    sources: any[],
    topics: any[],
    countries: any[]
  ): Promise<NormalizedArticle[]> {
    let articles: NormalizedArticle[] = []

    // Build a combined query using topics and countries
    const topicQueries = topics.filter(t => t.enabled).map(t => t.name)
    const countryQueries = countries.filter(c => c.status).map(c => c.name)

    // Fallback if no topics/countries
    let q = 'economics'
    
    if (topicQueries.length > 0 || countryQueries.length > 0) {
      const allKeywords = [...topicQueries, ...countryQueries]
      // NewsAPI allows querying with OR. Limit to 5 keywords to avoid complex query errors
      q = allKeywords.slice(0, 5).join(' OR ')
    }

    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${this.apiKey}`
      
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`NewsAPI returned status ${res.status}`)
      }
      
      const data = await res.json()

      if (data.status === 'ok' && data.articles) {
        const mapped: NormalizedArticle[] = data.articles.map((r: any) => {
          let countryName = null
          const titleContent = `${r.title} ${r.content || ''} ${r.description || ''}`.toLowerCase()
          for (const c of countries) {
            if (titleContent.includes(c.name.toLowerCase())) {
              countryName = c.name
              break
            }
          }

          return {
            title: r.title,
            description: r.description || '',
            content: r.content || '',
            url: r.url,
            source: r.source?.name || 'NewsAPI',
            publishedAt: new Date(r.publishedAt || Date.now()),
            country: countryName,
            raw: r,
          }
        }).filter((a: NormalizedArticle) => a.title && a.url) // skip invalid articles

        articles = articles.concat(mapped)
      }
    } catch (err) {
      console.error(`NewsApiProvider failed`, err)
    }

    return articles
  }
}
