import { getCompetitors } from '@/app/actions/competitor'
import CompetitorsClient from './competitors-client'

export default async function CompetitorsPage() {
  const competitors = await getCompetitors()
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Competitors & Organizations</h2>
      <p className="text-muted-foreground">Manage organizations or companies to monitor for economic events.</p>
      <CompetitorsClient initialCompetitors={competitors} />
    </div>
  )
}
