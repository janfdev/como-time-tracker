import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/reports')({
  component: ReportsPage,
})

function ReportsPage() {
  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Reports</h1>
        <div className="flex items-center gap-2">
          <select className="h-9 px-3 rounded-lg border border-border bg-bg text-sm text-[#CDD5DF] focus:outline-none focus:border-accent">
            <option>This week</option>
            <option>This month</option>
            <option>This year</option>
          </select>
          <button className="h-9 px-4 rounded-lg border border-border text-sm text-[#CDD5DF] hover:bg-surface transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total hours', value: '124h 30m' },
          { label: 'Billable hours', value: '105h 45m' },
          { label: 'Billable rate', value: '85%' },
        ].map((s) => (
          <div key={s.label} className="border border-border rounded-xl p-4 bg-surface/50">
            <div className="text-xs font-medium" style={{ color: '#8892A0' }}>{s.label}</div>
            <div className="mt-1 text-2xl font-semibold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-mono)' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="border border-border rounded-xl p-5 bg-surface/50">
        <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">By project</h3>
        <div className="space-y-3">
          {[
            { name: 'Website Redesign', hours: '45h 30m', pct: 36 },
            { name: 'Mobile App', hours: '32h 15m', pct: 26 },
            { name: 'API Development', hours: '28h 45m', pct: 23 },
            { name: 'UI/UX Design', hours: '20h 10m', pct: 15 },
          ].map((p) => (
            <div key={p.name}>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm text-[#CDD5DF]">{p.name}</span>
                <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-mono)', color: '#8892A0' }}>{p.hours}</span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${p.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-border rounded-xl p-5 bg-surface/50">
        <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">Daily hours</h3>
        <div className="h-40 flex items-end gap-1">
          {Array.from({ length: 30 }, (_, i) => {
            const seed = ((i * 7 + 13) * 31) % 100
            const h = 20 + seed * 0.6
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full rounded-t" style={{ height: `${h}%` }}>
                  <div className="w-full rounded-t bg-accent/60" style={{ height: '100%' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
