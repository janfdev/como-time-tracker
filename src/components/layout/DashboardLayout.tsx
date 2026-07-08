import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-bg overflow-x-hidden">
      <aside className="hidden lg:block">
        <Sidebar />
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 pb-20 lg:p-6 lg:pb-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
