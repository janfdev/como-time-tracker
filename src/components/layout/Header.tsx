import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header className="h-14 border-b border-border bg-bg/80 backdrop-blur-sm px-4 lg:px-6 flex items-center justify-between sticky top-0 z-10">
      <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
        <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>
        <span className="font-semibold text-[#F1F5F9] tracking-tight text-sm">como</span>
      </Link>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-3">
        <Link to="/dashboard/settings">
          <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xs font-semibold">
            U
          </div>
        </Link>
      </div>
    </header>
  )
}
