import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/invoices')({
  component: InvoicesPage,
})

function InvoicesPage() {
  const invoices = [
    { id: 'INV-001', client: 'Acme Corp', amount: '$2,450.00', status: 'paid', date: 'Dec 1, 2025' },
    { id: 'INV-002', client: 'Tech Startup', amount: '$1,800.00', status: 'sent', date: 'Dec 15, 2025' },
    { id: 'INV-003', client: 'Design Agency', amount: '$3,200.00', status: 'draft', date: 'Dec 20, 2025' },
  ]

  const statusStyle: Record<string, string> = {
    paid: 'text-success bg-success/10',
    sent: 'text-[#60A5FA] bg-[#60A5FA]/10',
    draft: '',
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Invoices</h1>
        <button className="h-9 px-4 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors">
          Create invoice
        </button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-surface/50">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Invoice', 'Client', 'Amount', 'Status', 'Date'].map((h) => (
                <th key={h} className="text-left text-xs font-medium px-5 py-3" style={{ color: '#8892A0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-surface/80 transition-colors cursor-pointer">
                <td className="px-5 py-3 text-sm text-[#F1F5F9]" style={{ fontFamily: 'var(--font-mono)' }}>{inv.id}</td>
                <td className="px-5 py-3 text-sm text-[#CDD5DF]">{inv.client}</td>
                <td className="px-5 py-3 text-sm font-semibold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-mono)' }}>{inv.amount}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyle[inv.status] || ''}`}
                    style={inv.status === 'draft' ? { color: '#8892A0', background: '#232830' } : undefined}
                  >
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm" style={{ color: '#8892A0' }}>{inv.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
