import { describe, it, expect } from 'vitest'
import { setSessionCookie, clearSessionCookie, getSessionFromCookie } from '../session'

describe('session utilities', () => {
  describe('setSessionCookie', () => {
    it('returns a valid cookie string with userId', () => {
      const cookie = setSessionCookie('test-user-id')
      expect(cookie).toContain('como_session=test-user-id')
      expect(cookie).toContain('Path=/')
      expect(cookie).toContain('HttpOnly')
      expect(cookie).toContain('SameSite=Lax')
      expect(cookie).toContain('Max-Age=604800')
    })
  })

  describe('clearSessionCookie', () => {
    it('returns a cookie string that expires the session', () => {
      const cookie = clearSessionCookie()
      expect(cookie).toContain('como_session=')
      expect(cookie).toContain('Max-Age=0')
    })
  })

  describe('getSessionFromCookie', () => {
    it('extracts userId from cookie header', () => {
      const request = new Request('http://localhost', {
        headers: { cookie: 'como_session=abc-123; other=value' },
      })
      const userId = getSessionFromCookie(request)
      expect(userId).toBe('abc-123')
    })

    it('returns null when no cookie header', () => {
      const request = new Request('http://localhost')
      const userId = getSessionFromCookie(request)
      expect(userId).toBeNull()
    })

    it('returns null when session cookie is not present', () => {
      const request = new Request('http://localhost', {
        headers: { cookie: 'other=value' },
      })
      const userId = getSessionFromCookie(request)
      expect(userId).toBeNull()
    })
  })
})
