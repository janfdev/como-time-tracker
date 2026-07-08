import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { getCurrentUserFn } from '~/lib/auth/current-user'
import { getInvoicesFn, getProjectsFn, createInvoiceFn } from '~/lib/server'
import { DataTable } from '~/components/data-table'
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

type Invoice = {
  id: string
  invoiceNumber: string
  status: string | null
  clientName: string | null
  total: number | null
  dueDate: Date | null
  projectName: string | null
}

function InvoicesPage() {
  const [user, setUser] = useState<any>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
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

  const columns = useMemo<ColumnDef<Invoice>[]>(
    () => [
      {
        accessorKey: 'invoiceNumber',
        header: 'Invoice',
        cell: ({ row }) => <span style={{ fontFamily: 'var(--font-mono)' }}>{row.original.invoiceNumber}</span>,
      },
      {
        accessorKey: 'clientName',
        header: 'Client',
        cell: ({ row }) => <span>{row.original.clientName || '-'}</span>,
      },
      {
        accessorKey: 'total',
        header: 'Amount',
        cell: ({ row }) => (
          <span className="font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
            {formatCurrency(row.original.total || 0)}
          </span>
        ),
        sortingFn: 'basic',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s = row.original.status || 'draft'
          return <Badge variant={statusVariant[s] || 'secondary'}>{s.charAt(0).toUpperCase() + s.slice(1)}</Badge>
        },
        filterFn: 'equals',
      },
      {
        accessorKey: 'dueDate',
        header: 'Due date',
        cell: ({ row }) => <span style={{ color: '#8892A0' }}>{formatDate(row.original.dueDate)}</span>,
        sortingFn: 'datetime',
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Link to="/dashboard/invoices/$invoiceId" params={{ invoiceId: row.original.id }} className="text-accent text-sm hover:underline">
            View
          </Link>
        ),
      },
    ],
    []
  )

  if (loading) return <TableSkeleton rows={4} cols={5} />

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Invoices</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>Create invoice</DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create invoice</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label className="mb-1.5">Project</Label>
                <Select value={projectId} onValueChange={(v) => setProjectId(v ?? '')}>
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

      <DataTable
        columns={columns}
        data={invoices}
        searchColumn="clientName"
        searchPlaceholder="Filter by client..."
        pageSize={10}
      />
    </div>
  )
}
