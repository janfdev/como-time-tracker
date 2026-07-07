import { createServerFn } from '@tanstack/react-start'
import { db } from '~/lib/db'
import { users } from '~/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { setSessionCookie, clearSessionCookie } from './session'

export const registerFn = createServerFn()
  .validator((data: { name: string; email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1)

    if (existing.length > 0) {
      return { error: 'Email already registered' }
    }

    const hashed = await bcrypt.hash(data.password, 10)
    const [user] = await db
      .insert(users)
      .values({ email: data.email, password: hashed, name: data.name })
      .returning({ id: users.id })

    return {
      success: true,
      userId: user.id,
      setCookie: setSessionCookie(user.id),
    }
  })

export const loginFn = createServerFn()
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1)

    if (!user) {
      return { error: 'Invalid email or password' }
    }

    const valid = await bcrypt.compare(data.password, user.password)
    if (!valid) {
      return { error: 'Invalid email or password' }
    }

    return {
      success: true,
      userId: user.id,
      setCookie: setSessionCookie(user.id),
    }
  })

export const logoutFn = createServerFn()
  .handler(async () => {
    return { success: true, setCookie: clearSessionCookie() }
  })
