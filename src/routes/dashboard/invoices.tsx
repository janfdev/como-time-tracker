import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCurrentUserFn } from '~/lib/auth/current-user'
import { getInvoicesFn } from '~/lib/server'

export const Route = createFileRoute('/dashboard/invoices')({
  component: InvoicesPage,
})

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

function formatDate(date: Date | null): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const user = await getCurrentUserFn()
      if (!user) { window.location.href = '/login'; return }
      const data = await getInvoicesFn({ data: { userId: user.id } })
      setInvoices(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-sm" style={{ color: '#8892A0' }}>Loading...</div></div>
  }

  const statusStyle: Record<string, string> = {
    paid: 'text-success bg-success/10',
    sent: 'text-[#60A5FA] bg-[#60A5FA]/10',
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Invoices</h1>
        <button className="h-9 px-4 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors">
          Create invoice
        </button>
      </div>

      {invoices.length === 0 ? (
        <div className="border border-border rounded-xl p-8 bg-surface/50 text-center">
          <p className="text-sm" style={{ color: '#8892A0' }}>No invoices yet. Create your first invoice from tracked time.</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-surface/50">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Invoice', 'Client', 'Amount', 'Status', 'Due date'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium px-5 py-3" style={{ color: '#8892A0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-surface/80 transition-colors cursor-pointer">
                  <td className="px-5 py-3 text-sm text-[#F1F5F9]" style={{ fontFamily: 'var(--font-mono)' }}>{inv.invoiceNumber}</td>
                  <td className="px-5 py-3 text-sm text-[#CDD5DF]">{inv.clientName || '-'}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(inv.total || 0)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyle[inv.status] || ''}`}
                      style={inv.status === 'draft' ? { color: '#8892A0', background: '#232830' } : undefined}>
                      {(inv.status || 'draft').charAt(0).toUpperCase() + (inv.status || 'draft').slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm" style={{ color: '#8892A0' }}>{formatDate(inv.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
