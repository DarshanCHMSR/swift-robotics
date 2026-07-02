import { getTopics } from '@/app/actions/topic'
import TopicsClient from './topics-client'

export default async function TopicsPage() {
  const topics = await getTopics()
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Topics</h2>
      <p className="text-muted-foreground">Manage economic topics and their tracking keywords.</p>
      <TopicsClient initialTopics={topics} />
    </div>
  )
}
