import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/projects')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const projects = [
    { name: 'Website Redesign', color: '#D97706', hours: '45h 30m', entries: 23 },
    { name: 'Mobile App', color: '#34D399', hours: '32h 15m', entries: 18 },
    { name: 'API Development', color: '#60A5FA', hours: '28h 45m', entries: 15 },
    { name: 'UI/UX Design', color: '#F472B6', hours: '20h 10m', entries: 12 },
  ]

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Projects</h1>
        <button className="h-9 px-4 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors">
          New project
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {projects.map((p) => (
          <div
            key={p.name}
            className="border border-border rounded-xl p-5 bg-surface/50 hover:border-border-light transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
              <h3 className="font-semibold text-[#F1F5F9]">{p.name}</h3>
            </div>
            <div className="flex gap-5 text-xs" style={{ color: '#8892A0' }}>
              <span><span className="text-[#CDD5DF] font-medium" style={{ fontFamily: 'var(--font-mono)' }}>{p.hours}</span> tracked</span>
              <span><span className="text-[#CDD5DF] font-medium">{p.entries}</span> entries</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
