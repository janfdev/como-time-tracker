import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCurrentUserFn } from '~/lib/auth/current-user'
import { getInvoicesFn, getProjectsFn, createInvoiceFn } from '~/lib/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { TableSkeleton } from '~/components/skeletons'

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
  const [user, setUser] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [projectsList, setProjectsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [projectId, setProjectId] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [creating, setCreating] = useState(false)

  async function load() {
    const u = await getCurrentUserFn()
    if (!u) { window.location.href = '/login'; return }
    setUser(u)
    const [i, p] = await Promise.all([
      getInvoicesFn({ data: { userId: u.id } }),
      getProjectsFn({ data: { userId: u.id } }),
    ])
    setInvoices(i)
    setProjectsList(p)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !projectId || !clientName.trim()) return
    setCreating(true)
    await createInvoiceFn({
      data: { userId: user.id, projectId, clientName: clientName.trim(), clientEmail: clientEmail.trim() },
    })
    setOpen(false)
    setProjectId('')
    setClientName('')
    setClientEmail('')
    setCreating(false)
    load()
  }

  if (loading) return <TableSkeleton rows={4} cols={5} />

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Invoices</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button>Create invoice</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create invoice</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label className="mb-1.5">Project</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>
                    {projectsList.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5">Client name</Label>
                <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Acme Corp" required />
              </div>
              <div>
                <Label className="mb-1.5">Client email</Label>
                <Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="billing@acme.com" />
              </div>
              <Button type="submit" className="w-full" disabled={creating}>
                {creating ? 'Creating...' : 'Create invoice'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
