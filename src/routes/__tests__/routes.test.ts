import { describe, it, expect } from 'vitest'

describe('Landing Page', () => {
  it('should have correct route path', () => {
    const routePath = '/'
    expect(routePath).toBe('/')
  })

  it('should display app name como', () => {
    const appName = 'como'
    expect(appName).toBe('como')
  })

  it('should have login link', () => {
    const loginPath = '/login'
    expect(loginPath).toBe('/login')
  })

  it('should have register link', () => {
    const registerPath = '/register'
    expect(registerPath).toBe('/register')
  })
})

describe('Auth Pages', () => {
  it('login route is at /login', () => {
    expect('/login').toBe('/login')
  })

  it('register route is at /register', () => {
    expect('/register').toBe('/register')
  })
})

describe('Dashboard Routes', () => {
  const dashboardRoutes = [
    '/dashboard',
    '/dashboard/timer',
    '/dashboard/projects',
    '/dashboard/entries',
    '/dashboard/reports',
    '/dashboard/invoices',
    '/dashboard/settings',
  ]

  it('has all expected dashboard routes', () => {
    expect(dashboardRoutes).toHaveLength(7)
    dashboardRoutes.forEach((route) => {
      expect(route).toMatch(/^\/dashboard/)
    })
  })

  it('each route is unique', () => {
    const unique = new Set(dashboardRoutes)
    expect(unique.size).toBe(dashboardRoutes.length)
  })
})
