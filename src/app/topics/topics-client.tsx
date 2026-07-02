'use client'

import { useState } from 'react'
import { Topic } from '@prisma/client'
import { addTopic, deleteTopic, updateTopic } from '@/app/actions/topic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

export default function TopicsClient({ initialTopics }: { initialTopics: Topic[] }) {
  const [topics, setTopics] = useState(initialTopics)
  const [newName, setNewName] = useState('')
  const [newKeywords, setNewKeywords] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newKeywords.trim()) return
    setLoading(true)
    try {
      const added = await addTopic({ name: newName, keywords: newKeywords })
      setTopics((prev) => [...prev, added].sort((a, b) => a.name.localeCompare(b.name)))
      setNewName('')
      setNewKeywords('')
      toast.success('Topic added')
    } catch (error) {
      toast.error('Failed to add topic')
    }
    setLoading(false)
  }

  const handleToggle = async (id: number, currentStatus: boolean) => {
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, enabled: !currentStatus } : t)))
    try {
      await updateTopic(id, { enabled: !currentStatus })
      toast.success('Status updated')
    } catch (error) {
      setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, enabled: currentStatus } : t)))
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return
    try {
      await deleteTopic(id)
      setTopics((prev) => prev.filter((t) => t.id !== id))
      toast.success('Topic deleted')
    } catch (error) {
      toast.error('Failed to delete topic')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleAdd} className="flex gap-4 items-end flex-wrap">
            <div className="space-y-2 flex-1 min-w-[200px]">
              <label className="text-sm font-medium">Topic Name</label>
              <Input
                placeholder="e.g. Inflation"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2 flex-1 min-w-[200px]">
              <label className="text-sm font-medium">Keywords (comma separated)</label>
              <Input
                placeholder="e.g. inflation, CPI, consumer price index"
                value={newKeywords}
                onChange={(e) => setNewKeywords(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading}>
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Keywords</TableHead>
              <TableHead>Enabled</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell className="font-medium">{topic.name}</TableCell>
                <TableCell className="max-w-xs truncate" title={topic.keywords}>{topic.keywords}</TableCell>
                <TableCell>
                  <Switch
                    checked={topic.enabled}
                    onCheckedChange={() => handleToggle(topic.id, topic.enabled)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(topic.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {topics.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No topics added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
