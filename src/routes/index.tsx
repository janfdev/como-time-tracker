import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-[#CDD5DF]" style={{ fontFamily: 'var(--font-display)' }}>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <span className="font-semibold text-[#F1F5F9] tracking-tight">como</span>
          </Link>
          <Link
            to="/login"
            className="h-8 px-4 rounded-md bg-accent text-white text-sm font-medium flex items-center hover:bg-accent-hover transition-colors"
          >
            Open app
          </Link>
        </div>
      </header>

      <main className="pt-14">
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
          <div className="text-center">
            <div
              className="font-mono text-accent text-[11rem] font-bold leading-none tracking-tighter select-none"
              style={{ fontFamily: 'var(--font-mono)', textShadow: '0 0 80px #D9770630, 0 0 160px #D9770615' }}
            >
              00:00:00
            </div>

            <p className="mt-8 text-4xl font-light text-[#F1F5F9] tracking-tight">
              Your time is finite.{' '}
              <span className="text-accent font-medium">Track it.</span>
            </p>

            <p className="mt-4 text-lg max-w-md mx-auto" style={{ color: '#8892A0' }}>
              Dead-simple time tracking for freelancers and students.
              One click to start. See where your hours actually go.
            </p>

            <div className="mt-8 flex justify-center gap-3">
              <Link
                to="/register"
                className="h-12 px-8 rounded-lg bg-accent text-white font-medium flex items-center hover:bg-accent-hover transition-colors text-base"
              >
                Start tracking
              </Link>
              <a
                href="#features"
                className="h-12 px-8 rounded-lg border border-border text-[#CDD5DF] font-medium flex items-center hover:bg-surface transition-colors text-base"
              >
                See features
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface/30">
          <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-medium text-accent tracking-wider uppercase mb-3">Focus mode</p>
              <h2 className="text-4xl font-semibold text-[#F1F5F9] tracking-tight leading-tight">
                One button.<br />That's it.
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: '#8892A0' }}>
                Pick a project. Hit start. The timer runs until you stop it. No forms,
                no dropdowns, no friction. Time tracking that respects your flow state.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-2xl p-8">
              <div
                className="text-7xl font-bold text-center tracking-tight"
                style={{ fontFamily: 'var(--font-mono)', color: '#F1F5F9' }}
              >
                02:34:15
              </div>
              <div className="mt-6 flex justify-center gap-2">
                <div className="h-10 w-24 rounded-lg bg-accent text-white font-medium flex items-center justify-center text-sm">
                  Running
                </div>
                <div className="h-10 w-24 rounded-lg border border-border text-[#CDD5DF] flex items-center justify-center text-sm">
                  Pause
                </div>
              </div>
              <div className="mt-4 text-center text-sm" style={{ color: '#8892A0' }}>
                Website Redesign — homepage wireframes
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-border">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="mb-12">
              <p className="text-sm font-medium text-accent tracking-wider uppercase mb-2">Features</p>
              <h2 className="text-3xl font-semibold text-[#F1F5F9] tracking-tight">
                Built for how you actually work
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /><circle cx="12" cy="12" r="9" /></>,
                  label: 'Instant timer',
                  desc: 'Click start. Timer runs. Click stop. Entry saved. Zero friction between you and tracking.',
                },
                {
                  icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
                  label: 'See the gaps',
                  desc: 'Charts that show exactly where your hours go. Daily, weekly, monthly. No spreadsheet gymnastics.',
                },
                {
                  icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></>,
                  label: 'Invoice in seconds',
                  desc: 'Select tracked time. Generate invoice. Send PDF. Get paid. The whole cycle in minutes, not hours.',
                },
                {
                  icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" /></>,
                  label: 'Track what matters',
                  desc: 'Tag entries, mark billable hours, organize by project. Your data, your structure, your rules.',
                },
              ].map((f) => (
                <div
                  key={f.label}
                  className="group border border-border rounded-xl p-6 hover:bg-surface transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      {f.icon}
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#F1F5F9]">{f.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: '#8892A0' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="grid grid-cols-3 gap-8 text-center">
              {[
                { value: '24,000+', label: 'hours tracked' },
                { value: '1,200+', label: 'active users' },
                { value: '98%', label: 'keep tracking after 30 days' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-bold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-mono)' }}>{s.value}</div>
                  <div className="text-sm mt-1" style={{ color: '#8892A0' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="max-w-2xl mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl font-semibold text-[#F1F5F9] tracking-tight">
              Stop guessing where your time goes.
            </h2>
            <Link
              to="/register"
              className="mt-6 inline-flex h-12 px-8 rounded-lg bg-accent text-white font-medium items-center hover:bg-accent-hover transition-colors text-base"
            >
              Start for free
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-accent flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <span className="text-sm" style={{ color: '#8892A0' }}>como</span>
          </div>
          <div className="text-sm" style={{ color: '#8892A0' }}>&copy; 2026</div>
        </div>
      </footer>
    </div>
  )
}
