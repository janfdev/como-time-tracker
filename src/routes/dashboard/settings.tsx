import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="max-w-xl space-y-5">
      <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">Settings</h1>

      <div className="border border-border rounded-xl p-5 bg-surface/50 space-y-4">
        <h3 className="text-sm font-semibold text-[#F1F5F9]">Profile</h3>
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: '#8892A0' }}>Name</label>
          <input
            type="text"
            defaultValue="John Doe"
            className="w-full h-10 px-3 rounded-lg border border-border bg-bg text-sm text-[#CDD5DF] focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: '#8892A0' }}>Email</label>
          <input
            type="email"
            defaultValue="john@example.com"
            disabled
            className="w-full h-10 px-3 rounded-lg border border-border bg-bg text-sm cursor-not-allowed"
            style={{ color: '#4A5568' }}
          />
        </div>
      </div>

      <div className="border border-border rounded-xl p-5 bg-surface/50 space-y-4">
        <h3 className="text-sm font-semibold text-[#F1F5F9]">Preferences</h3>
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: '#8892A0' }}>Hourly rate ($)</label>
          <input
            type="number"
            defaultValue="75"
            className="w-full h-10 px-3 rounded-lg border border-border bg-bg text-sm text-[#CDD5DF] focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: '#8892A0' }}>Currency</label>
          <select className="w-full h-10 px-3 rounded-lg border border-border bg-bg text-sm text-[#CDD5DF] focus:outline-none focus:border-accent">
            <option>USD ($)</option>
            <option>EUR (&euro;)</option>
            <option>GBP (&pound;)</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: '#8892A0' }}>Timezone</label>
          <select className="w-full h-10 px-3 rounded-lg border border-border bg-bg text-sm text-[#CDD5DF] focus:outline-none focus:border-accent">
            <option>UTC</option>
            <option>EST</option>
            <option>PST</option>
          </select>
        </div>
      </div>

      <div className="border border-danger/20 rounded-xl p-5 bg-surface/50">
        <h3 className="text-sm font-semibold text-danger mb-2">Danger zone</h3>
        <p className="text-xs mb-3" style={{ color: '#8892A0' }}>
          Deleting your account removes all data permanently.
        </p>
        <button className="h-9 px-4 rounded-lg border border-danger/30 text-danger text-sm font-medium hover:bg-danger/10 transition-colors">
          Delete account
        </button>
      </div>

      <div className="flex justify-end">
        <button className="h-10 px-6 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors">
          Save changes
        </button>
      </div>
    </div>
  )
}
