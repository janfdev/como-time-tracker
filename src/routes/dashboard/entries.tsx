import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCurrentUserFn } from '~/lib/auth/current-user'
import { getRecentEntriesFn, getProjectsFn } from '~/lib/server'

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

  useEffect(() => {
    async function load() {
      const user = await getCurrentUserFn()
      if (!user) { window.location.href = '/login'; return }
      const data = await getRecentEntriesFn({ data: { userId: user.id, limit: 50 } })
      setEntries(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-sm" style={{ color: '#8892A0' }}>Loading...</div></div>
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Entries</h1>
        <button className="h-9 px-4 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors">
          Add entry
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="border border-border rounded-xl p-8 bg-surface/50 text-center">
          <p className="text-sm" style={{ color: '#8892A0' }}>No time entries yet. Start the timer to track your first session.</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-surface/50">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Project', 'Description', 'Duration', 'Date', 'Billable'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium px-5 py-3" style={{ color: '#8892A0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-border last:border-0 hover:bg-surface/80 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.projectColor || '#D97706' }} />
                      <span className="text-sm text-[#CDD5DF]">{e.projectName || 'No project'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm" style={{ color: '#8892A0' }}>{e.description || '-'}</td>
                  <td className="px-5 py-3 text-sm text-[#F1F5F9]" style={{ fontFamily: 'var(--font-mono)' }}>{formatDuration(e.duration || 0)}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: '#8892A0' }}>{formatDate(e.startedAt)}</td>
                  <td className="px-5 py-3">
                    {e.isBillable ? (
                      <span className="text-[10px] font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">Billable</span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ color: '#8892A0', background: '#232830' }}>Non-billable</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
