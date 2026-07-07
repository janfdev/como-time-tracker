import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/entries')({
  component: EntriesPage,
})

function EntriesPage() {
  const entries = [
    { project: 'Website Redesign', description: 'Homepage layout', duration: '2h 15m', date: 'Today', billable: true },
    { project: 'Mobile App', description: 'API integration', duration: '1h 30m', date: 'Today', billable: true },
    { project: 'API Development', description: 'Auth endpoints', duration: '3h 45m', date: 'Yesterday', billable: true },
    { project: 'UI/UX Design', description: 'User research', duration: '2h 00m', date: 'Yesterday', billable: false },
    { project: 'Website Redesign', description: 'Responsive fixes', duration: '1h 45m', date: '2 days ago', billable: true },
  ]

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Entries</h1>
        <div className="flex items-center gap-2">
          <select className="h-9 px-3 rounded-lg border border-border bg-bg text-sm text-[#CDD5DF] focus:outline-none focus:border-accent">
            <option>All projects</option>
            <option>Website Redesign</option>
            <option>Mobile App</option>
          </select>
          <button className="h-9 px-4 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors">
            Add entry
          </button>
        </div>
      </div>

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
            {entries.map((e, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-surface/80 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span className="text-sm text-[#CDD5DF]">{e.project}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm" style={{ color: '#8892A0' }}>{e.description}</td>
                <td className="px-5 py-3 text-sm text-[#F1F5F9]" style={{ fontFamily: 'var(--font-mono)' }}>{e.duration}</td>
                <td className="px-5 py-3 text-sm" style={{ color: '#8892A0' }}>{e.date}</td>
                <td className="px-5 py-3">
                  {e.billable ? (
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
    </div>
  )
}
