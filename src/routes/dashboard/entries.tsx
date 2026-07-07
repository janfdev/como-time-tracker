import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCurrentUserFn } from '~/lib/auth/current-user'
import { getRecentEntriesFn } from '~/lib/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

export const Route = createFileRoute('/dashboard/entries')({
  component: EntriesPage,
})

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function formatDate(date: Date): string {
  const now = new Date()
  const d = new Date(date)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const entryDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diff = today.getTime() - entryDate.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function EntriesPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    async function load() {
      const user = await getCurrentUserFn()
      if (!user) { window.location.href = '/login'; return }
      const data = await getRecentEntriesFn({ data: { userId: user.id, limit: 100 } })
      setEntries(data)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = filter === 'all'
    ? entries
    : entries.filter((e) => filter === 'billable' ? e.isBillable : !e.isBillable)

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-sm" style={{ color: '#8892A0' }}>Loading...</div></div>
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Entries</h1>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All entries</SelectItem>
              <SelectItem value="billable">Billable</SelectItem>
              <SelectItem value="non-billable">Non-billable</SelectItem>
            </SelectContent>
          </Select>
          <Button>Add entry</Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-border rounded-xl p-8 bg-surface/50 text-center">
          <p className="text-sm" style={{ color: '#8892A0' }}>No time entries yet. Start the timer to track your first session.</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-surface/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Billable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.projectColor || '#D97706' }} />
                      <span>{e.projectName || 'No project'}</span>
                    </div>
                  </TableCell>
                  <TableCell style={{ color: '#8892A0' }}>{e.description || '-'}</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-mono)' }}>{formatDuration(e.duration || 0)}</TableCell>
                  <TableCell style={{ color: '#8892A0' }}>{formatDate(e.startedAt)}</TableCell>
                  <TableCell>
                    {e.isBillable ? (
                      <Badge variant="default" className="bg-success/10 text-success">Billable</Badge>
                    ) : (
                      <Badge variant="secondary">Non-billable</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
