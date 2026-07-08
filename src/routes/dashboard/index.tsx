import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCurrentUserFn } from '~/lib/auth/current-user'
import { getDashboardStatsFn, getRecentEntriesFn, getWeeklyStatsFn } from '~/lib/server'
import { useTimer } from '~/lib/timer-context'
import { DashboardSkeleton } from '~/components/skeletons'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function DashboardPage() {
  const { state: timerState } = useTimer()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [entries, setEntries] = useState<any[]>([])
  const [weekly, setWeekly] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const currentUser = await getCurrentUserFn()
    if (!currentUser) { window.location.href = '/login'; return }
    setUser(currentUser)

    const [s, e, w] = await Promise.all([
      getDashboardStatsFn({ data: { userId: currentUser.id } }),
      getRecentEntriesFn({ data: { userId: currentUser.id, limit: 5 } }),
      getWeeklyStatsFn({ data: { userId: currentUser.id } }),
    ])

    setStats(s)
    setEntries(e)
    setWeekly(w)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  if (loading) return <DashboardSkeleton />

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weeklyMap = new Map(weekly.map((w) => [w.date, w.total]))
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())

  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    return { day: dayNames[d.getDay()], total: weeklyMap.get(dateStr) || 0 }
  })

  const maxWeek = Math.max(...weekData.map((d) => d.total), 1)

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">
            Good {now.getHours() < 12 ? 'morning' : now.getHours() < 18 ? 'afternoon' : 'evening'}
            {user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#8892A0' }}>Here's your time summary for today.</p>
        </div>
        <button onClick={() => { setLoading(true); load() }} className="text-xs px-3 py-1.5 rounded-lg border border-border text-[#8892A0] hover:text-[#CDD5DF] hover:bg-surface transition-colors">
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Today', value: formatDuration(stats?.today || 0) },
          { label: 'This week', value: formatDuration(stats?.week || 0) },
          { label: 'This month', value: formatDuration(stats?.month || 0) },
          { label: 'Billable', value: `${stats?.billableRate || 0}%` },
        ].map((s) => (
          <div key={s.label} className="border border-border rounded-xl p-3 sm:p-4 bg-surface/50">
            <div className="text-xs font-medium" style={{ color: '#8892A0' }}>{s.label}</div>
            <div className="mt-1 text-xl sm:text-2xl font-semibold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-mono)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="border border-border rounded-xl p-4 sm:p-5 bg-surface/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-xs font-medium" style={{ color: '#8892A0' }}>
              {timerState.isRunning ? 'Currently tracking' : 'Timer'}
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-mono)', color: timerState.isRunning ? '#D97706' : '#F1F5F9' }}>
              {timerState.seconds > 0 ? formatTime(timerState.seconds) : '00:00:00'}
            </div>
            {timerState.projectName && (
              <div className="text-xs mt-1" style={{ color: '#8892A0' }}>{timerState.projectName}</div>
            )}
          </div>
          <Link to="/dashboard/timer" className="h-10 px-6 rounded-lg bg-accent text-white text-sm font-medium flex items-center justify-center sm:justify-start hover:bg-accent-hover transition-colors">
            {timerState.isRunning ? 'View timer' : 'Start timer'}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 border border-border rounded-xl p-4 sm:p-5 bg-surface/50">
          <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">This week</h3>
          <div className="h-48 flex items-end gap-1.5">
            {weekData.map((d) => {
              const pct = maxWeek > 0 ? (d.total / maxWeek) * 100 : 0
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full rounded-t" style={{ height: `${Math.max(pct, 5)}%` }}>
                    <div className="w-full rounded-t bg-accent/80" style={{ height: '100%', opacity: 0.3 + (pct / 100) * 0.7 }} />
                  </div>
                  <span className="text-[10px]" style={{ color: '#8892A0' }}>{d.day}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="border border-border rounded-xl p-4 sm:p-5 bg-surface/50">
          <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">Recent</h3>
          <div className="space-y-3">
            {entries.length === 0 ? (
              <p className="text-xs" style={{ color: '#8892A0' }}>No entries yet. Start tracking!</p>
            ) : (
              entries.map((e) => (
                <div key={e.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.projectColor || '#D97706' }} />
                    <span className="text-sm text-[#CDD5DF] truncate max-w-[120px]">{e.projectName || 'No project'}</span>
                  </div>
                  <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-mono)', color: '#8892A0' }}>{formatDuration(e.duration || 0)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
