export interface NormalizedArticle {
  title: string
  description: string
  content: string
  url: string
  source: string
  publishedAt: Date
  country: string | null
  raw: any
}

export interface NewsProvider {
  name: string
  fetchNews(
    sources: any[],
    topics: any[],
    countries: any[]
  ): Promise<NormalizedArticle[]>
}
