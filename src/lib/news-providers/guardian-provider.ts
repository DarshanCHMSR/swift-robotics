import { NewsProvider, NormalizedArticle } from './provider'

export class GuardianProvider implements NewsProvider {
  name = 'The Guardian'

  async fetchNews(
    sources: any[],
    topics: any[],
    countries: any[]
  ): Promise<NormalizedArticle[]> {
    let articles: NormalizedArticle[] = []

    // Extract all guardian sources from the provided sources list
    const guardianSources = sources.filter((s) => s.apiUrl.includes('content.guardianapis.com'))

    // Add explicit Guardian MVP source if not present
    const mvpUrl = 'https://content.guardianapis.com/search?page=2&q=debate&show-fields=bodyText&api-key=35304f8d-9a35-426b-bb00-8ca7984bc8ac'
    if (!guardianSources.some((s) => s.apiUrl === mvpUrl)) {
      guardianSources.push({
        id: -1,
        name: 'The Guardian (API)',
        apiUrl: mvpUrl,
      })
    }

    for (const source of guardianSources) {
      try {
        const fetchUrl = source.apiUrl.includes('show-fields=bodyText')
          ? source.apiUrl
          : `${source.apiUrl}&show-fields=bodyText`

        const res = await fetch(fetchUrl)
        if (!res.ok) {
          throw new Error(`Guardian API returned status ${res.status}`)
        }
        
        const data = await res.json()

        if (data.response && data.response.results) {
          const mapped: NormalizedArticle[] = data.response.results.map((r: any) => {
            // Find matched country based on title/content just like original logic
            let countryName = null
            const titleContent = `${r.webTitle} ${r.fields?.bodyText || ''}`.toLowerCase()
            for (const c of countries) {
              if (titleContent.includes(c.name.toLowerCase())) {
                countryName = c.name
                break
              }
            }

            return {
              title: r.webTitle,
              description: r.fields?.bodyText ? r.fields.bodyText.substring(0, 500) : '',
              content: r.fields?.bodyText || '',
              url: r.webUrl,
              source: source.name || 'The Guardian',
              publishedAt: new Date(r.webPublicationDate),
              country: countryName,
              raw: r,
            }
          })
          articles = articles.concat(mapped)
        }
      } catch (err) {
        console.error(`GuardianProvider failed for source ${source.name}`, err)
      }
    }

    return articles
  }
}
