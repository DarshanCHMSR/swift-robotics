export const dynamic = 'force-dynamic'
import { getSources } from '@/app/actions/source'
import SourcesClient from './sources-client'

export default async function SourcesPage() {
  const sources = await getSources()
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Sources</h2>
      <p className="text-muted-foreground">Manage the news APIs and RSS feeds to pull articles from.</p>
      <SourcesClient initialSources={sources} />
    </div>
  )
}
