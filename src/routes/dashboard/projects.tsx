import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCurrentUserFn } from '~/lib/auth/current-user'
import { getProjectStatsFn } from '~/lib/server'

export const Route = createFileRoute('/dashboard/projects')({
  component: ProjectsPage,
})

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const user = await getCurrentUserFn()
      if (!user) { window.location.href = '/login'; return }
      const data = await getProjectStatsFn({ data: { userId: user.id } })
      setProjects(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-sm" style={{ color: '#8892A0' }}>Loading...</div></div>
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Projects</h1>
        <button className="h-9 px-4 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors">
          New project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="border border-border rounded-xl p-8 bg-surface/50 text-center">
          <p className="text-sm" style={{ color: '#8892A0' }}>No projects yet. Create your first project to start tracking time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {projects.map((p) => (
            <div key={p.id} className="border border-border rounded-xl p-5 bg-surface/50 hover:border-border-light transition-colors cursor-pointer">
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
