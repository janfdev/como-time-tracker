import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCurrentUserFn } from '~/lib/auth/current-user'
import { getReportStatsFn, getProjectStatsFn } from '~/lib/server'
import { DashboardSkeleton } from '~/components/skeletons'

export const Route = createFileRoute('/dashboard/reports')({
  component: ReportsPage,
})

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function ReportsPage() {
  const [report, setReport] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const user = await getCurrentUserFn()
      if (!user) { window.location.href = '/login'; return }
      const [r, p] = await Promise.all([
        getReportStatsFn({ data: { userId: user.id } }),
        getProjectStatsFn({ data: { userId: user.id } }),
      ])
      setReport(r)
      setProjects(p)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <DashboardSkeleton />

  const maxDaily = Math.max(...(report?.daily?.map((d: any) => d.total) || [1]), 1)

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Reports</h1>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total hours', value: formatDuration(report?.totalHours || 0) },
          { label: 'Billable hours', value: formatDuration(report?.billableHours || 0) },
          { label: 'Billable rate', value: `${report?.billableRate || 0}%` },
        ].map((s) => (
          <div key={s.label} className="border border-border rounded-xl p-4 bg-surface/50">
            <div className="text-xs font-medium" style={{ color: '#8892A0' }}>{s.label}</div>
            <div className="mt-1 text-2xl font-semibold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-mono)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="border border-border rounded-xl p-5 bg-surface/50">
        <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">By project</h3>
        {projects.length === 0 ? (
          <p className="text-xs" style={{ color: '#8892A0' }}>No data yet.</p>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => {
              const maxP = projects[0]?.totalDuration || 1
              const pct = Math.round((p.totalDuration / maxP) * 100)
              return (
                <div key={p.id}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-[#CDD5DF]">{p.name}</span>
                    <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-mono)', color: '#8892A0' }}>{formatDuration(p.totalDuration)}</span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: p.color || '#D97706' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="border border-border rounded-xl p-5 bg-surface/50">
        <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">Daily hours</h3>
        {report?.daily?.length === 0 ? (
          <p className="text-xs" style={{ color: '#8892A0' }}>No data yet.</p>
        ) : (
          <div className="h-40 flex items-end gap-1">
            {report?.daily?.map((d: any, i: number) => {
              const pct = (d.total / maxDaily) * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full rounded-t" style={{ height: `${Math.max(pct, 3)}%` }}>
                    <div className="w-full rounded-t bg-accent/60" style={{ height: '100%' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
