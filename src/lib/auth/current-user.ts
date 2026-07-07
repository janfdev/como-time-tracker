import { createServerFn } from '@tanstack/react-start'
import { db } from '~/lib/db'
import { users } from '~/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getSessionFromCookie } from '~/lib/auth/session'

export const getCurrentUserFn = createServerFn()
  .handler(async () => {
    const { getRequest } = await import('@tanstack/react-start/server')
    const request = getRequest()
    const userId = getSessionFromCookie(request)

    if (!userId) return null

    const [user] = await db
      .select({ id: users.id, email: users.email, name: users.name })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    return user ?? null
  })
