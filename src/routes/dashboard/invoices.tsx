import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCurrentUserFn } from '~/lib/auth/current-user'
import { getInvoicesFn } from '~/lib/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'

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

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  paid: 'default',
  sent: 'outline',
  draft: 'secondary',
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

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Invoices</h1>
        <Button>Create invoice</Button>
      </div>

      {invoices.length === 0 ? (
        <div className="border border-border rounded-xl p-8 bg-surface/50 text-center">
          <p className="text-sm" style={{ color: '#8892A0' }}>No invoices yet. Create your first invoice from tracked time.</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-surface/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} className="cursor-pointer">
                  <TableCell style={{ fontFamily: 'var(--font-mono)' }}>{inv.invoiceNumber}</TableCell>
                  <TableCell>{inv.clientName || '-'}</TableCell>
                  <TableCell className="font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(inv.total || 0)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[inv.status] || 'secondary'}>
                      {(inv.status || 'draft').charAt(0).toUpperCase() + (inv.status || 'draft').slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ color: '#8892A0' }}>{formatDate(inv.dueDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
