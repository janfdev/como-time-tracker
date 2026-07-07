import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Como</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-gray-300 hover:text-white transition">
              Sign In
            </a>
            <a href="/login" className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition">
              Get Started
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <span className="text-indigo-400 text-sm">Time tracking made simple</span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Track your time.
            <br />
            <span className="text-indigo-400">Grow your hustle.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Built for freelancers and students who want to understand where their time goes. 
            Simple timer, powerful insights, beautiful invoices.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="/login" className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition">
              Start Tracking Free
            </a>
            <a href="#features" className="border border-gray-600 hover:border-gray-500 text-gray-300 px-8 py-3 rounded-lg text-lg transition">
              Learn More
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mt-20 grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-white">2x</div>
            <div className="text-gray-400 mt-2">More productive</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">30%</div>
            <div className="text-gray-400 mt-2">More billable hours</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">5min</div>
            <div className="text-gray-400 mt-2">Setup time</div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Everything you need to track time
          </h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">One-Click Timer</h3>
              <p className="text-gray-400">Start tracking instantly. No complex forms, just click and go.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Reports</h3>
              <p className="text-gray-400">See where your time goes with beautiful charts and insights.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Quick Invoices</h3>
              <p className="text-gray-400">Generate professional invoices from your tracked time in seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            &copy; 2026 Como. Built with TanStack.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
