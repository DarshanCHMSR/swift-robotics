'use client'

import { useState } from 'react'
import { Country } from '@prisma/client'
import { addCountry, deleteCountry, updateCountry } from '@/app/actions/country'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

export default function CountriesClient({ initialCountries }: { initialCountries: Country[] }) {
  const [countries, setCountries] = useState(initialCountries)
  const [newCountry, setNewCountry] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCountry.trim()) return
    setLoading(true)
    try {
      const added = await addCountry({ name: newCountry })
      setCountries((prev) => [...prev, added].sort((a, b) => a.name.localeCompare(b.name)))
      setNewCountry('')
      toast.success('Country added')
    } catch (error) {
      toast.error('Failed to add country')
    }
    setLoading(false)
  }

  const handleToggle = async (id: number, currentStatus: boolean) => {
    setCountries((prev) => prev.map((c) => (c.id === id ? { ...c, status: !currentStatus } : c)))
    try {
      await updateCountry(id, { status: !currentStatus })
      toast.success('Status updated')
    } catch (error) {
      setCountries((prev) => prev.map((c) => (c.id === id ? { ...c, status: currentStatus } : c)))
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return
    try {
      await deleteCountry(id)
      setCountries((prev) => prev.filter((c) => c.id !== id))
      toast.success('Country deleted')
    } catch (error) {
      toast.error('Failed to delete country')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleAdd} className="flex gap-4 items-end">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Add New Country</label>
              <Input
                placeholder="e.g. India"
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
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
            {countries.map((country) => (
              <TableRow key={country.id}>
                <TableCell className="font-medium">{country.name}</TableCell>
                <TableCell>
                  <Switch
                    checked={country.status}
                    onCheckedChange={() => handleToggle(country.id, country.status)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(country.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {countries.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No countries added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
