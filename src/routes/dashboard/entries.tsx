import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCurrentUserFn } from '~/lib/auth/current-user'
import { getRecentEntriesFn, getProjectsFn, createEntryFn, deleteEntryFn } from '~/lib/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { TableSkeleton } from '~/components/skeletons'

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
  const [user, setUser] = useState<any>(null)
  const [entries, setEntries] = useState<any[]>([])
  const [projectsList, setProjectsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const [open, setOpen] = useState(false)
  const [projectId, setProjectId] = useState('')
  const [description, setDescription] = useState('')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [isBillable, setIsBillable] = useState(false)
  const [creating, setCreating] = useState(false)

  async function load() {
    const u = await getCurrentUserFn()
    if (!u) { window.location.href = '/login'; return }
    setUser(u)
    const [e, p] = await Promise.all([
      getRecentEntriesFn({ data: { userId: u.id, limit: 100 } }),
      getProjectsFn({ data: { userId: u.id } }),
    ])
    setEntries(e)
    setProjectsList(p)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !projectId) return
    const totalSeconds = (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60
    if (totalSeconds === 0) return
    setCreating(true)
    await createEntryFn({
      data: { userId: user.id, projectId, description, duration: totalSeconds, isBillable, tags: [] },
    })
    setOpen(false)
    setProjectId('')
    setDescription('')
    setHours('')
    setMinutes('')
    setIsBillable(false)
    setCreating(false)
    load()
  }

  async function handleDelete(entryId: string) {
    await deleteEntryFn({ data: { entryId } })
    load()
  }

  const filtered = filter === 'all' ? entries : entries.filter((e) => filter === 'billable' ? e.isBillable : !e.isBillable)

  if (loading) return <TableSkeleton rows={6} cols={5} />

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Entries</h1>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Filter" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All entries</SelectItem>
              <SelectItem value="billable">Billable</SelectItem>
              <SelectItem value="non-billable">Non-billable</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button>Add entry</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add manual entry</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label className="mb-1.5">Project</Label>
                  <Select value={projectId} onValueChange={setProjectId}>
                    <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                    <SelectContent>
                      {projectsList.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5">Description</Label>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What did you work on?" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-1.5">Hours</Label>
                    <Input type="number" min="0" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="0" />
                  </div>
                  <div>
                    <Label className="mb-1.5">Minutes</Label>
                    <Input type="number" min="0" max="59" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="0" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={isBillable} onCheckedChange={setIsBillable} />
                  <Label>Billable</Label>
                </div>
                <Button type="submit" className="w-full" disabled={creating}>
                  {creating ? 'Adding...' : 'Add entry'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-border rounded-xl p-8 bg-surface/50 text-center">
          <p className="text-sm" style={{ color: '#8892A0' }}>No time entries yet. Start the timer or add a manual entry.</p>
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
                <TableHead className="w-10"></TableHead>
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
                      <Badge className="bg-success/10 text-success">Billable</Badge>
                    ) : (
                      <Badge variant="secondary">Non-billable</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(e.id)}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </Button>
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
