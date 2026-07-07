import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Good evening</h1>
        <p className="text-sm mt-0.5" style={{ color: '#8892A0' }}>
          Here's your time summary for today.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Today', value: '2h 34m', change: '+12%', positive: true },
          { label: 'This week', value: '18h 45m', change: '+8%', positive: true },
          { label: 'This month', value: '124h 30m', change: 'On track', positive: true },
          { label: 'Billable', value: '85%', change: '+5%', positive: true },
        ].map((s) => (
          <div key={s.label} className="border border-border rounded-xl p-4 bg-surface/50">
            <div className="text-xs font-medium" style={{ color: '#8892A0' }}>{s.label}</div>
            <div className="mt-1.5 text-2xl font-semibold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-mono)' }}>
              {s.value}
            </div>
            <div className={`mt-1 text-xs font-medium ${s.positive ? 'text-success' : 'text-danger'}`}>
              {s.change}
            </div>
          </div>
        ))}
      </div>

      <div className="border border-border rounded-xl p-5 bg-surface/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium" style={{ color: '#8892A0' }}>Currently tracking</div>
            <div
              className="mt-1 text-3xl font-bold text-[#F1F5F9]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              00:00:00
            </div>
          </div>
          <Link
            to="/dashboard/timer"
            className="h-10 px-6 rounded-lg bg-accent text-white text-sm font-medium flex items-center hover:bg-accent-hover transition-colors"
          >
            Start timer
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 border border-border rounded-xl p-5 bg-surface/50">
          <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">This week</h3>
          <div className="h-48 flex items-end gap-1.5">
            {[
              { day: 'Mon', h: 60 },
              { day: 'Tue', h: 80 },
              { day: 'Wed', h: 45 },
              { day: 'Thu', h: 90 },
              { day: 'Fri', h: 70 },
              { day: 'Sat', h: 30 },
              { day: 'Sun', h: 20 },
            ].map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full rounded-t" style={{ height: `${d.h}%` }}>
                  <div
                    className="w-full rounded-t bg-accent/80"
                    style={{ height: '100%', opacity: 0.3 + (d.h / 100) * 0.7 }}
                  />
                </div>
                <span className="text-[10px]" style={{ color: '#8892A0' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-border rounded-xl p-5 bg-surface/50">
          <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">Recent</h3>
          <div className="space-y-3">
            {[
              { project: 'Website Redesign', duration: '2h 15m' },
              { project: 'Mobile App', duration: '1h 30m' },
              { project: 'API Development', duration: '3h 45m' },
            ].map((e, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-sm text-[#CDD5DF]">{e.project}</span>
                </div>
                <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-mono)', color: '#8892A0' }}>
                  {e.duration}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
