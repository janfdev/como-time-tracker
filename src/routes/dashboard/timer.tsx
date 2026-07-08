import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useTimer } from '~/lib/timer-context'
import { getCurrentUserFn } from '~/lib/auth/current-user'
import { getProjectsFn, saveTimerEntryFn } from '~/lib/server'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'
import { Badge } from '~/components/ui/badge'
import { DashboardSkeleton } from '~/components/skeletons'

export const Route = createFileRoute('/dashboard/timer')({
  component: TimerPage,
})

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function TimerPage() {
  const { state, start, pause, resume, reset, setProject, setDescription, setBillable, setTags } = useTimer()
  const [user, setUser] = useState<any>(null)
  const [projectsList, setProjectsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const allTags = ['design', 'frontend', 'backend', 'meeting', 'research', 'bugfix', 'review']

  useEffect(() => {
    async function load() {
      const currentUser = await getCurrentUserFn()
      if (!currentUser) { window.location.href = '/login'; return }
      setUser(currentUser)
      const p = await getProjectsFn({ data: { userId: currentUser.id } })
      setProjectsList(p)
      setLoading(false)
    }
    load()
  }, [])

  function handleProjectChange(value: string | null) {
    const id = value ?? ''
    const proj = projectsList.find((p) => p.id === id)
    if (proj) setProject(proj.id, proj.name, proj.color || '#D97706')
  }

  function toggleTag(tag: string) {
    const next = state.tags.includes(tag) ? state.tags.filter((t) => t !== tag) : [...state.tags, tag]
    setTags(next)
  }

  async function handleSave() {
    if (!user || !state.projectId || state.seconds === 0) return
    setSaving(true)
    await saveTimerEntryFn({
      data: {
        userId: user.id,
        projectId: state.projectId,
        description: state.description,
        duration: state.seconds,
        isBillable: state.isBillable,
        tags: state.tags,
        startedAt: state.startedAt || new Date().toISOString(),
      },
    })
    setSaving(false)
    setSaved(true)
    reset()
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <DashboardSkeleton />

  return (
    <div className="max-w-xl mx-auto py-4 lg:py-8">
      <div className="border border-border rounded-2xl bg-surface/50 p-6 lg:p-8">
        <div className="mb-6 flex justify-center">
          <Select value={state.projectId} onValueChange={handleProjectChange}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projectsList.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || '#D97706' }} />
                    {p.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-center mb-8">
          <div
            className="text-[4rem] lg:text-[5rem] font-bold tracking-tighter"
            style={{
              fontFamily: 'var(--font-mono)',
              color: state.isRunning ? '#D97706' : '#F1F5F9',
              textShadow: state.isRunning ? '0 0 60px #D9770640' : 'none',
              transition: 'all 0.3s',
            }}
          >
            {formatTime(state.seconds)}
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {!state.isRunning && state.seconds === 0 && (
            <Button onClick={start} disabled={!state.projectId} className="px-8">
              Start
            </Button>
          )}
          {state.isRunning && (
            <Button onClick={pause} variant="secondary" className="px-8">
              Pause
            </Button>
          )}
          {!state.isRunning && state.seconds > 0 && (
            <>
              <Button onClick={resume} className="px-6">
                Resume
              </Button>
              <Button onClick={handleSave} disabled={saving} className="px-6">
                {saving ? 'Saving...' : 'Save entry'}
              </Button>
              <Button onClick={reset} variant="destructive" className="px-6">
                Discard
              </Button>
            </>
          )}
        </div>

        {saved && (
          <div className="text-center mb-4 text-sm text-success">Entry saved successfully!</div>
        )}

        <div className="space-y-4">
          <div>
            <Label className="mb-1.5">Description</Label>
            <Input
              value={state.description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you working on?"
            />
          </div>

          <div>
            <Label className="mb-1.5">Tags</Label>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={state.tags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={state.isBillable} onCheckedChange={setBillable} />
            <Label>Billable</Label>
          </div>
        </div>
      </div>
    </div>
  )
}
