import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
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
  const [user, setUser] = useState<any>(null)
  const [projectsList, setProjectsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [projectId, setProjectId] = useState('')
  const [description, setDescription] = useState('')
  const [isBillable, setIsBillable] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [startedAt, setStartedAt] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
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

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning])

  function handleStart() {
    if (!projectId) return
    setIsRunning(true)
    setStartedAt(new Date().toISOString())
    setSaved(false)
  }

  function handlePause() {
    setIsRunning(false)
  }

  function handleStop() {
    setIsRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  async function handleSave() {
    if (!user || !projectId || seconds === 0) return
    setSaving(true)
    await saveTimerEntryFn({
      data: {
        userId: user.id,
        projectId,
        description,
        duration: seconds,
        isBillable,
        tags: selectedTags,
        startedAt: startedAt || new Date().toISOString(),
      },
    })
    setSaving(false)
    setSaved(true)
    setSeconds(0)
    setDescription('')
    setSelectedTags([])
    setStartedAt(null)
    setTimeout(() => setSaved(false), 3000)
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])
  }

  if (loading) return <DashboardSkeleton />

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="border border-border rounded-2xl bg-surface/50 p-8">
        <div className="mb-8 flex justify-center">
          <Select value={projectId} onValueChange={setProjectId}>
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

        <div className="text-center mb-10">
          <div
            className="text-[5rem] font-bold tracking-tighter"
            style={{
              fontFamily: 'var(--font-mono)',
              color: isRunning ? '#D97706' : '#F1F5F9',
              textShadow: isRunning ? '0 0 60px #D9770640' : 'none',
              transition: 'all 0.3s',
            }}
          >
            {formatTime(seconds)}
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {!isRunning ? (
            <Button onClick={handleStart} disabled={!projectId} className="px-8">
              {seconds > 0 ? 'Resume' : 'Start'}
            </Button>
          ) : (
            <Button onClick={handlePause} variant="secondary" className="px-8">
              Pause
            </Button>
          )}
          {seconds > 0 && !isRunning && (
            <>
              <Button onClick={handleStop} variant="destructive" className="px-6">
                Discard
              </Button>
              <Button onClick={handleSave} disabled={saving} className="px-6">
                {saving ? 'Saving...' : 'Save entry'}
              </Button>
            </>
          )}
        </div>

        {saved && (
          <div className="text-center mb-4 text-sm text-success">
            Entry saved successfully!
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label className="mb-1.5">Description</Label>
            <Input
              value={description}
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
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={isBillable} onCheckedChange={setIsBillable} />
            <Label>Billable</Label>
          </div>
        </div>
      </div>
    </div>
  )
}
