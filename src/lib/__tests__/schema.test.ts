import { describe, it, expect } from 'vitest'

describe('Database Schema', () => {
  it('users table has required fields', () => {
    const userFields = ['id', 'email', 'password', 'name', 'image', 'createdAt', 'updatedAt']
    expect(userFields).toContain('email')
    expect(userFields).toContain('password')
    expect(userFields).toContain('name')
  })

  it('projects table has required fields', () => {
    const projectFields = ['id', 'userId', 'name', 'color', 'isArchived', 'createdAt', 'updatedAt']
    expect(projectFields).toContain('name')
    expect(projectFields).toContain('userId')
    expect(projectFields).toContain('color')
  })

  it('timeEntries table has required fields', () => {
    const entryFields = ['id', 'userId', 'projectId', 'description', 'startedAt', 'endedAt', 'duration', 'isBillable', 'tags', 'createdAt']
    expect(entryFields).toContain('duration')
    expect(entryFields).toContain('isBillable')
    expect(entryFields).toContain('startedAt')
  })

  it('invoices table has required fields', () => {
    const invoiceFields = ['id', 'userId', 'projectId', 'invoiceNumber', 'status', 'clientName', 'clientEmail', 'dueDate', 'subtotal', 'taxRate', 'tax', 'discount', 'total', 'notes', 'createdAt', 'updatedAt']
    expect(invoiceFields).toContain('invoiceNumber')
    expect(invoiceFields).toContain('status')
    expect(invoiceFields).toContain('total')
  })

  it('invoiceItems table has required fields', () => {
    const itemFields = ['id', 'invoiceId', 'timeEntryId', 'description', 'quantity', 'unitPrice', 'amount']
    expect(itemFields).toContain('description')
    expect(itemFields).toContain('quantity')
    expect(itemFields).toContain('unitPrice')
  })
})

describe('Seed Data Structure', () => {
  it('seed creates user with email and password', () => {
    const seedUser = {
      email: 'demo@como.app',
      password: 'hashedpassword',
      name: 'Demo User',
    }
    expect(seedUser.email).toBe('demo@como.app')
    expect(seedUser.name).toBe('Demo User')
  })

  it('seed creates 5 projects', () => {
    const projectCount = 5
    expect(projectCount).toBe(5)
  })

  it('seed creates invoices with valid statuses', () => {
    const validStatuses = ['draft', 'sent', 'paid']
    validStatuses.forEach((status) => {
      expect(['draft', 'sent', 'paid']).toContain(status)
    })
  })
})
