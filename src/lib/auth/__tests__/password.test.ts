import { describe, it, expect } from 'vitest'
import bcrypt from 'bcryptjs'

describe('password hashing', () => {
  it('hashes password correctly', async () => {
    const password = 'testpassword123'
    const hashed = await bcrypt.hash(password, 10)

    expect(hashed).not.toBe(password)
    expect(hashed.length).toBeGreaterThan(0)
  })

  it('verifies correct password', async () => {
    const password = 'mypassword'
    const hashed = await bcrypt.hash(password, 10)
    const valid = await bcrypt.compare(password, hashed)

    expect(valid).toBe(true)
  })

  it('rejects incorrect password', async () => {
    const password = 'correctpassword'
    const hashed = await bcrypt.hash(password, 10)
    const valid = await bcrypt.compare('wrongpassword', hashed)

    expect(valid).toBe(false)
  })
})
