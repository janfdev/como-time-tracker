import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCurrentUserFn } from '~/lib/auth/current-user'
import { getReportStatsFn, getProjectStatsFn } from '~/lib/server'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
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

function secondsToHours(seconds: number): number {
  return Math.round((seconds / 3600) * 10) / 10
}

const COLORS = ['#D97706', '#34D399', '#60A5FA', '#F472B6', '#A78BFA', '#F87171', '#FBBF24', '#2DD4BF']

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

  const dailyChartData = (report?.daily || []).map((d: any) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    hours: secondsToHours(d.total),
  }))

  const projectChartData = projects.map((p) => ({
    name: p.name,
    value: p.totalDuration,
    color: p.color || '#D97706',
  }))

  return (
    <div className="space-y-5 max-w-5xl">
      <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Reports</h1>

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

      <div className="grid grid-cols-2 gap-3">
        <div className="border border-border rounded-xl p-5 bg-surface/50">
          <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">Daily hours</h3>
          {dailyChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-sm" style={{ color: '#8892A0' }}>No data yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyChartData}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#8892A0' }}
                  axisLine={{ stroke: '#232830' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#8892A0' }}
                  axisLine={{ stroke: '#232830' }}
                  tickLine={false}
                  unit="h"
                />
                <Tooltip
                  contentStyle={{
                    background: '#151820',
                    border: '1px solid #232830',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#F1F5F9' }}
                  itemStyle={{ color: '#CDD5DF' }}
                  formatter={(value: number) => [`${value}h`, 'Hours']}
                />
                <Bar dataKey="hours" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="border border-border rounded-xl p-5 bg-surface/50">
          <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">By project</h3>
          {projectChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-sm" style={{ color: '#8892A0' }}>No data yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={projectChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {projectChartData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#151820',
                    border: '1px solid #232830',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [formatDuration(value), 'Duration']}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', color: '#8892A0' }}
                  formatter={(value) => <span style={{ color: '#CDD5DF' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="border border-border rounded-xl p-5 bg-surface/50">
        <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">Project breakdown</h3>
        {projects.length === 0 ? (
          <p className="text-xs" style={{ color: '#8892A0' }}>No data yet.</p>
        ) : (
          <div className="space-y-3">
            {projects.map((p, i) => {
              const maxP = projects[0]?.totalDuration || 1
              const pct = Math.round((p.totalDuration / maxP) * 100)
              return (
                <div key={p.id}>
                  <div className="flex justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-sm text-[#CDD5DF]">{p.name}</span>
                    </div>
                    <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-mono)', color: '#8892A0' }}>{formatDuration(p.totalDuration)}</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
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
