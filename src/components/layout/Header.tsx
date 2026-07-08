import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getCurrentUserFn } from '~/lib/auth/current-user'

export function Header() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getCurrentUserFn().then(setUser).catch(() => {})
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

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
        <Link to="/dashboard/settings" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-accent/20">
            {initials}
          </div>
          <span className="hidden sm:block text-sm text-[#CDD5DF]">{user?.name || 'User'}</span>
        </Link>
      </div>
    </header>
  )
}
