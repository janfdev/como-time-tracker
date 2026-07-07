import { redirect } from '@tanstack/react-router'
import { db } from '~/lib/db'
import { users } from '~/lib/db/schema'
import { eq } from 'drizzle-orm'

export function getSessionFromCookie(request: Request): string | null {
  const cookie = request.headers.get('cookie') || ''
  const match = cookie.match(/como_session=([^;]+)/)
  return match?.[1] ?? null
}

export function setSessionCookie(userId: string): string {
  return `como_session=${userId}; Path=/; SameSite=Lax; Max-Age=604800`
}

export function clearSessionCookie(): string {
  return 'como_session=; Path=/; SameSite=Lax; Max-Age=0'
}

export async function getCurrentUser(request: Request) {
  const userId = getSessionFromCookie(request)
  if (!userId) return null

  const [user] = await db
    .select({ id: users.id, email: users.email, name: users.name })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  return user ?? null
}

export async function requireAuth(request: Request) {
  const user = await getCurrentUser(request)
  if (!user) {
    throw redirect({ to: '/login' })
  }
  return user
}
