'use client'

import { useState } from 'react'
import { Competitor } from '@prisma/client'
import { addCompetitor, deleteCompetitor, updateCompetitor } from '@/app/actions/competitor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

export default function CompetitorsClient({ initialCompetitors }: { initialCompetitors: Competitor[] }) {
  const [competitors, setCompetitors] = useState(initialCompetitors)
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setLoading(true)
    try {
      const added = await addCompetitor({ name: newName })
      setCompetitors((prev) => [...prev, added].sort((a, b) => a.name.localeCompare(b.name)))
      setNewName('')
      toast.success('Competitor added')
    } catch (error) {
      toast.error('Failed to add competitor')
    }
    setLoading(false)
  }

  const handleToggle = async (id: number, currentStatus: boolean) => {
    setCompetitors((prev) => prev.map((c) => (c.id === id ? { ...c, enabled: !currentStatus } : c)))
    try {
      await updateCompetitor(id, { enabled: !currentStatus })
      toast.success('Status updated')
    } catch (error) {
      setCompetitors((prev) => prev.map((c) => (c.id === id ? { ...c, enabled: currentStatus } : c)))
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return
    try {
      await deleteCompetitor(id)
      setCompetitors((prev) => prev.filter((c) => c.id !== id))
      toast.success('Competitor deleted')
    } catch (error) {
      toast.error('Failed to delete competitor')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleAdd} className="flex gap-4 items-end">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Add Organization</label>
              <Input
                placeholder="e.g. Google, Tesla, RBI"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading}>
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitors.map((competitor) => (
              <TableRow key={competitor.id}>
                <TableCell className="font-medium">{competitor.name}</TableCell>
                <TableCell>
                  <Switch
                    checked={competitor.enabled}
                    onCheckedChange={() => handleToggle(competitor.id, competitor.enabled)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(competitor.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {competitors.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No competitors added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
