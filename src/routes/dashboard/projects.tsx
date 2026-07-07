import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCurrentUserFn } from '~/lib/auth/current-user'
import { getProjectStatsFn, createProjectFn } from '~/lib/server'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { TableSkeleton } from '~/components/skeletons'

export const Route = createFileRoute('/dashboard/projects')({
  component: ProjectsPage,
})

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

const COLORS = ['#D97706', '#34D399', '#60A5FA', '#F472B6', '#A78BFA', '#F87171', '#FBBF24', '#2DD4BF']

function ProjectsPage() {
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [creating, setCreating] = useState(false)

  async function load() {
    const u = await getCurrentUserFn()
    if (!u) { window.location.href = '/login'; return }
    setUser(u)
    const data = await getProjectStatsFn({ data: { userId: u.id } })
    setProjects(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !name.trim()) return
    setCreating(true)
    await createProjectFn({ data: { userId: user.id, name: name.trim(), color } })
    setName('')
    setColor(COLORS[0])
    setOpen(false)
    setCreating(false)
    load()
  }

  if (loading) return <TableSkeleton rows={4} cols={3} />

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Projects</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>New project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label className="mb-1.5">Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" required />
              </div>
              <div>
                <Label className="mb-1.5">Color</Label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full transition-all ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-bg' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={creating}>
                {creating ? 'Creating...' : 'Create project'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <div className="border border-border rounded-xl p-8 bg-surface/50 text-center">
          <p className="text-sm" style={{ color: '#8892A0' }}>No projects yet. Create your first project to start tracking time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {projects.map((p) => (
            <div key={p.id} className="border border-border rounded-xl p-5 bg-surface/50 hover:border-border-light transition-colors">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color || '#D97706' }} />
                <h3 className="font-semibold text-[#F1F5F9]">{p.name}</h3>
              </div>
              <div className="flex gap-5 text-xs" style={{ color: '#8892A0' }}>
                <span><span className="text-[#CDD5DF] font-medium" style={{ fontFamily: 'var(--font-mono)' }}>{formatDuration(p.totalDuration)}</span> tracked</span>
                <span><span className="text-[#CDD5DF] font-medium">{p.entryCount}</span> entries</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
