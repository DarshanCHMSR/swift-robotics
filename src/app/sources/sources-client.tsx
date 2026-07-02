'use client'

import { useState } from 'react'
import { Source } from '@prisma/client'
import { addSource, deleteSource, updateSource } from '@/app/actions/source'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

export default function SourcesClient({ initialSources }: { initialSources: Source[] }) {
  const [sources, setSources] = useState(initialSources)
  const [newName, setNewName] = useState('')
  const [newApiUrl, setNewApiUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newApiUrl.trim()) return
    setLoading(true)
    try {
      const added = await addSource({ name: newName, apiUrl: newApiUrl })
      setSources((prev) => [...prev, added].sort((a, b) => a.name.localeCompare(b.name)))
      setNewName('')
      setNewApiUrl('')
      toast.success('Source added')
    } catch (error) {
      toast.error('Failed to add source')
    }
    setLoading(false)
  }

  const handleToggle = async (id: number, currentStatus: boolean) => {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !currentStatus } : s)))
    try {
      await updateSource(id, { enabled: !currentStatus })
      toast.success('Status updated')
    } catch (error) {
      setSources((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: currentStatus } : s)))
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return
    try {
      await deleteSource(id)
      setSources((prev) => prev.filter((s) => s.id !== id))
      toast.success('Source deleted')
    } catch (error) {
      toast.error('Failed to delete source')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleAdd} className="flex gap-4 items-end flex-wrap">
            <div className="space-y-2 flex-1 min-w-[200px]">
              <label className="text-sm font-medium">Source Name</label>
              <Input
                placeholder="e.g. Google News RSS"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2 flex-1 min-w-[300px]">
              <label className="text-sm font-medium">API URL / RSS Feed Link</label>
              <Input
                placeholder="https://news.google.com/rss/..."
                value={newApiUrl}
                onChange={(e) => setNewApiUrl(e.target.value)}
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
              <TableHead>API URL</TableHead>
              <TableHead>Enabled</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map((source) => (
              <TableRow key={source.id}>
                <TableCell className="font-medium">{source.name}</TableCell>
                <TableCell className="max-w-xs truncate" title={source.apiUrl}>{source.apiUrl}</TableCell>
                <TableCell>
                  <Switch
                    checked={source.enabled}
                    onCheckedChange={() => handleToggle(source.id, source.enabled)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(source.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {sources.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No sources added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
