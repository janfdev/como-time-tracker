import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCurrentUserFn } from '~/lib/auth/current-user'
import { generateInvoicePDF } from '~/lib/utils/pdf'
import {
  getInvoiceDetailFn,
  updateInvoiceStatusFn,
  addInvoiceItemFn,
  removeInvoiceItemFn,
  getAvailableEntriesFn,
  getProjectsFn,
  deleteInvoiceFn,
} from '~/lib/server'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { DashboardSkeleton } from '~/components/skeletons'

export const Route = createFileRoute('/dashboard/invoices/$invoiceId')({
  component: InvoiceDetailPage,
})

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
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

const STATUS_FLOW: Record<string, string[]> = {
  draft: ['sent'],
  sent: ['paid'],
  paid: [],
}

function InvoiceDetailPage() {
  const { invoiceId } = Route.useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [addItemOpen, setAddItemOpen] = useState(false)
  const [addFromTimeOpen, setAddFromTimeOpen] = useState(false)
  const [entries, setEntries] = useState<any[]>([])
  const [selectedEntry, setSelectedEntry] = useState('')
  const [manualDesc, setManualDesc] = useState('')
  const [manualQty, setManualQty] = useState('1')
  const [manualPrice, setManualPrice] = useState('')
  const [hourlyRate, setHourlyRate] = useState('75')
  const [adding, setAdding] = useState(false)

  async function load() {
    const u = await getCurrentUserFn()
    if (!u) { window.location.href = '/login'; return }
    setUser(u)
    const inv = await getInvoiceDetailFn({ data: { invoiceId } })
    setInvoice(inv)
    setLoading(false)
  }

  useEffect(() => { load() }, [invoiceId])

  async function handleStatusChange(newStatus: string) {
    await updateInvoiceStatusFn({ data: { invoiceId, status: newStatus } })
    load()
  }

  async function handleDelete() {
    if (!confirm('Delete this invoice?')) return
    await deleteInvoiceFn({ data: { invoiceId } })
    navigate({ to: '/dashboard/invoices' })
  }

  function handleDownloadPDF() {
    if (!invoice) return
    const doc = generateInvoicePDF({
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status || 'draft',
      clientName: invoice.clientName || 'Client',
      clientEmail: invoice.clientEmail || '',
      dueDate: invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-',
      total: invoice.total || 0,
      items: (invoice.items || []).map((item: any) => ({
        description: item.description,
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || 0,
        amount: item.amount || 0,
      })),
    })
    doc.save(`${invoice.invoiceNumber}.pdf`)
  }

  async function loadEntries() {
    if (!user || !invoice) return
    const e = await getAvailableEntriesFn({ data: { userId: user.id, projectId: invoice.projectId } })
    setEntries(e)
  }

  async function handleAddFromTime() {
    if (!selectedEntry) return
    const entry = entries.find((e) => e.id === selectedEntry)
    if (!entry) return
    setAdding(true)
    const hours = (entry.duration || 0) / 3600
    const price = parseInt(hourlyRate) * 100
    await addInvoiceItemFn({
      data: {
        invoiceId,
        timeEntryId: entry.id,
        description: entry.description || 'Development work',
        quantity: Math.ceil(hours),
        unitPrice: price,
      },
    })
    setSelectedEntry('')
    setAddFromTimeOpen(false)
    setAdding(false)
    load()
  }

  async function handleAddManual(e: React.FormEvent) {
    e.preventDefault()
    if (!manualDesc.trim()) return
    setAdding(true)
    await addInvoiceItemFn({
      data: {
        invoiceId,
        description: manualDesc.trim(),
        quantity: parseInt(manualQty) || 1,
        unitPrice: parseInt(manualPrice) * 100 || 0,
      },
    })
    setManualDesc('')
    setManualQty('1')
    setManualPrice('')
    setAddItemOpen(false)
    setAdding(false)
    load()
  }

  async function handleRemoveItem(itemId: string) {
    await removeInvoiceItemFn({ data: { itemId, invoiceId } })
    load()
  }

  if (loading) return <DashboardSkeleton />
  if (!invoice) return <div className="text-sm" style={{ color: '#8892A0' }}>Invoice not found.</div>

  const nextStatuses = STATUS_FLOW[invoice.status] || []

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">{invoice.invoiceNumber}</h1>
          <p className="text-sm" style={{ color: '#8892A0' }}>{invoice.clientName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
          {nextStatuses.map((s) => (
            <Button key={s} variant={s === 'paid' ? 'default' : 'outline'} size="sm" onClick={() => handleStatusChange(s)}>
              Mark as {s}
            </Button>
          ))}
          {invoice.status === 'draft' && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="border border-border rounded-xl p-4 bg-surface/50">
          <div className="text-xs" style={{ color: '#8892A0' }}>Status</div>
          <Badge variant={statusVariant[invoice.status] || 'secondary'} className="mt-1">
            {(invoice.status || 'draft').charAt(0).toUpperCase() + (invoice.status || 'draft').slice(1)}
          </Badge>
        </div>
        <div className="border border-border rounded-xl p-4 bg-surface/50">
          <div className="text-xs" style={{ color: '#8892A0' }}>Total</div>
          <div className="text-lg font-semibold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(invoice.total || 0)}</div>
        </div>
        <div className="border border-border rounded-xl p-4 bg-surface/50">
          <div className="text-xs" style={{ color: '#8892A0' }}>Due date</div>
          <div className="text-sm text-[#CDD5DF]">{formatDate(invoice.dueDate)}</div>
        </div>
        <div className="border border-border rounded-xl p-4 bg-surface/50">
          <div className="text-xs" style={{ color: '#8892A0' }}>Client</div>
          <div className="text-sm text-[#CDD5DF]">{invoice.clientEmail || '-'}</div>
        </div>
      </div>

      <div className="border border-border rounded-xl bg-surface/50">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-[#F1F5F9]">Line items</h3>
          <div className="flex gap-2">
            <Dialog open={addFromTimeOpen} onOpenChange={(v) => { setAddFromTimeOpen(v); if (v) loadEntries() }}>
              <DialogTrigger render={<Button variant="outline" size="sm" />}>From tracked time</DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add from tracked time</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-1.5">Hourly rate ($)</Label>
                    <Input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
                  </div>
                  <div>
                    <Label className="mb-1.5">Select entry</Label>
                    <Select value={selectedEntry} onValueChange={(v) => setSelectedEntry(v ?? '')}>
                      <SelectTrigger><SelectValue placeholder="Choose a time entry" /></SelectTrigger>
                      <SelectContent>
                        {entries.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.description || 'No description'} — {formatDuration(e.duration || 0)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedEntry && (() => {
                    const entry = entries.find((e) => e.id === selectedEntry)
                    if (!entry) return null
                    const hours = Math.ceil((entry.duration || 0) / 3600)
                    const price = parseInt(hourlyRate) || 0
                    return (
                      <div className="text-sm p-3 rounded-lg border border-border" style={{ color: '#8892A0' }}>
                        Will add: {entry.description} — {hours}h × ${price} = <span className="text-[#F1F5F9] font-semibold">${hours * price}</span>
                      </div>
                    )
                  })()}
                  <Button onClick={handleAddFromTime} disabled={!selectedEntry || adding} className="w-full">
                    {adding ? 'Adding...' : 'Add item'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
              <DialogTrigger render={<Button size="sm" />}>Add item</DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add manual item</DialogTitle></DialogHeader>
                <form onSubmit={handleAddManual} className="space-y-4">
                  <div>
                    <Label className="mb-1.5">Description</Label>
                    <Input value={manualDesc} onChange={(e) => setManualDesc(e.target.value)} placeholder="Development work" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="mb-1.5">Quantity</Label>
                      <Input type="number" min="1" value={manualQty} onChange={(e) => setManualQty(e.target.value)} />
                    </div>
                    <div>
                      <Label className="mb-1.5">Unit price ($)</Label>
                      <Input type="number" min="0" value={manualPrice} onChange={(e) => setManualPrice(e.target.value)} placeholder="75" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={adding}>
                    {adding ? 'Adding...' : 'Add item'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {invoice.items?.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: '#8892A0' }}>No items yet. Add from tracked time or manually.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'var(--font-mono)' }}>{item.quantity}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(item.unitPrice || 0)}</TableCell>
                  <TableCell className="text-right font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(item.amount || 0)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleRemoveItem(item.id)}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
                <TableCell className="text-right font-bold text-lg" style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(invoice.total || 0)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => navigate({ to: '/dashboard/invoices' })}>
          Back to invoices
        </Button>
      </div>
    </div>
  )
}
