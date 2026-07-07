import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/timer')({
  component: TimerPage,
})

function TimerPage() {
  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="border border-border rounded-2xl bg-surface/50 p-8">
        <div className="mb-8 flex justify-center">
          <select className="h-9 px-3 rounded-lg border border-border bg-bg text-sm text-[#CDD5DF] focus:outline-none focus:border-accent">
            <option>Select project</option>
            <option>Website Redesign</option>
            <option>Mobile App</option>
            <option>API Development</option>
          </select>
        </div>

        <div className="text-center mb-10">
          <div
            className="text-[5rem] font-bold text-[#F1F5F9] tracking-tighter"
            style={{
              fontFamily: 'var(--font-mono)',
              textShadow: '0 0 60px #D9770620',
            }}
          >
            00:00:00
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          <button className="h-11 px-8 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors">
            Start
          </button>
          <button className="h-11 px-8 rounded-lg border border-border text-[#CDD5DF] font-medium text-sm hover:bg-surface transition-colors">
            Pause
          </button>
          <button className="h-11 px-6 rounded-lg border border-danger/30 text-danger font-medium text-sm hover:bg-danger/10 transition-colors">
            Stop
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: '#8892A0' }}>Description</label>
            <input
              type="text"
              placeholder="What are you working on?"
              className="w-full h-10 px-3 rounded-lg border border-border bg-bg text-sm text-[#CDD5DF] placeholder:text-[#4A5568] focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: '#8892A0' }}>Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {['design', 'frontend', 'backend', 'meeting', 'research'].map((tag) => (
                <button
                  key={tag}
                  className="h-7 px-3 rounded-full border border-border text-xs text-[#CDD5DF] hover:border-accent hover:text-accent transition-colors"
                >
                  {tag}
                </button>
              ))}
              <button className="h-7 px-3 rounded-full border border-border text-xs text-[#8892A0] hover:border-accent hover:text-accent transition-colors">
                + add
              </button>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer pt-1">
            <div className="relative w-9 h-5 bg-border rounded-full peer-checked:bg-accent transition-colors">
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-[#CDD5DF] rounded-full transition-transform" />
            </div>
            <span className="text-sm text-[#CDD5DF]">Billable</span>
          </label>
        </div>
      </div>
    </div>
  )
}
