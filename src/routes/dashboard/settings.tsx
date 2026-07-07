import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCurrentUserFn } from '~/lib/auth/current-user'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { CardSkeleton } from '~/components/skeletons'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const u = await getCurrentUserFn()
      if (!u) { window.location.href = '/login'; return }
      setUser(u)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="max-w-xl space-y-5">{Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}</div>

  return (
    <div className="max-w-xl space-y-5">
      <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Settings</h1>

      <div className="border border-border rounded-xl p-5 bg-surface/50 space-y-4">
        <h3 className="text-sm font-semibold text-[#F1F5F9]">Profile</h3>
        <div>
          <Label className="mb-1.5">Name</Label>
          <Input defaultValue={user?.name || ''} />
        </div>
        <div>
          <Label className="mb-1.5">Email</Label>
          <Input defaultValue={user?.email || ''} disabled className="cursor-not-allowed opacity-50" />
        </div>
      </div>

      <div className="border border-border rounded-xl p-5 bg-surface/50 space-y-4">
        <h3 className="text-sm font-semibold text-[#F1F5F9]">Preferences</h3>
        <div>
          <Label className="mb-1.5">Hourly rate ($)</Label>
          <Input type="number" defaultValue="75" />
        </div>
        <div>
          <Label className="mb-1.5">Currency</Label>
          <Select defaultValue="usd">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD ($)</SelectItem>
              <SelectItem value="eur">EUR (&euro;)</SelectItem>
              <SelectItem value="gbp">GBP (&pound;)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5">Timezone</Label>
          <Select defaultValue="utc">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="utc">UTC</SelectItem>
              <SelectItem value="est">EST</SelectItem>
              <SelectItem value="pst">PST</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border border-danger/20 rounded-xl p-5 bg-surface/50">
        <h3 className="text-sm font-semibold text-danger mb-2">Danger zone</h3>
        <p className="text-xs mb-3" style={{ color: '#8892A0' }}>Deleting your account removes all data permanently.</p>
        <Button variant="destructive" size="sm">Delete account</Button>
      </div>

      <div className="flex justify-end">
        <Button>Save changes</Button>
      </div>
    </div>
  )
}
