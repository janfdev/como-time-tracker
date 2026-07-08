import { createServerFn } from '@tanstack/react-start'
import { db } from '~/lib/db'
import { projects, timeEntries, invoices, invoiceItems, users } from '~/lib/db/schema'
import { eq, desc, gte, lte, and, sql } from 'drizzle-orm'

export const getProjectsFn = createServerFn()
  .validator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, data.userId))
      .orderBy(projects.name)
    return result
  })

export const getRecentEntriesFn = createServerFn()
  .validator((data: { userId: string; limit?: number }) => data)
  .handler(async ({ data }) => {
    const result = await db
      .select({
        id: timeEntries.id,
        description: timeEntries.description,
        duration: timeEntries.duration,
        startedAt: timeEntries.startedAt,
        isBillable: timeEntries.isBillable,
        tags: timeEntries.tags,
        projectName: projects.name,
        projectColor: projects.color,
      })
      .from(timeEntries)
      .leftJoin(projects, eq(timeEntries.projectId, projects.id))
      .where(eq(timeEntries.userId, data.userId))
      .orderBy(desc(timeEntries.startedAt))
      .limit(data.limit || 10)
    return result
  })

export const getDashboardStatsFn = createServerFn()
  .validator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const now = new Date()

    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)

    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const [today] = await db
      .select({ total: sql<number>`coalesce(sum(${timeEntries.duration}), 0)` })
      .from(timeEntries)
      .where(and(eq(timeEntries.userId, data.userId), gte(timeEntries.startedAt, todayStart)))

    const [week] = await db
      .select({ total: sql<number>`coalesce(sum(${timeEntries.duration}), 0)` })
      .from(timeEntries)
      .where(and(eq(timeEntries.userId, data.userId), gte(timeEntries.startedAt, weekStart)))

    const [month] = await db
      .select({ total: sql<number>`coalesce(sum(${timeEntries.duration}), 0)` })
      .from(timeEntries)
      .where(and(eq(timeEntries.userId, data.userId), gte(timeEntries.startedAt, monthStart)))

    const [billable] = await db
      .select({ total: sql<number>`coalesce(sum(${timeEntries.duration}), 0)` })
      .from(timeEntries)
      .where(and(eq(timeEntries.userId, data.userId), eq(timeEntries.isBillable, true), gte(timeEntries.startedAt, monthStart)))

    const [totalMonth] = await db
      .select({ total: sql<number>`coalesce(sum(${timeEntries.duration}), 0)` })
      .from(timeEntries)
      .where(and(eq(timeEntries.userId, data.userId), gte(timeEntries.startedAt, monthStart)))

    const billableRate = totalMonth.total > 0
      ? Math.round((billable.total / totalMonth.total) * 100)
      : 0

    return {
      today: today.total,
      week: week.total,
      month: month.total,
      billableRate,
    }
  })

export const getWeeklyStatsFn = createServerFn()
  .validator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const result = await db
      .select({
        date: sql<string>`date(${timeEntries.startedAt})`,
        total: sql<number>`coalesce(sum(${timeEntries.duration}), 0)`,
      })
      .from(timeEntries)
      .where(and(eq(timeEntries.userId, data.userId), gte(timeEntries.startedAt, weekStart)))
      .groupBy(sql`date(${timeEntries.startedAt})`)
      .orderBy(sql`date(${timeEntries.startedAt})`)

    return result
  })

export const getInvoicesFn = createServerFn()
  .validator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const result = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        status: invoices.status,
        clientName: invoices.clientName,
        total: invoices.total,
        dueDate: invoices.dueDate,
        projectName: projects.name,
      })
      .from(invoices)
      .leftJoin(projects, eq(invoices.projectId, projects.id))
      .where(eq(invoices.userId, data.userId))
      .orderBy(desc(invoices.createdAt))
    return result
  })

export const getProjectStatsFn = createServerFn()
  .validator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const result = await db
      .select({
        id: projects.id,
        name: projects.name,
        color: projects.color,
        totalDuration: sql<number>`coalesce(sum(${timeEntries.duration}), 0)`,
        entryCount: sql<number>`count(${timeEntries.id})`,
      })
      .from(projects)
      .leftJoin(timeEntries, eq(projects.id, timeEntries.projectId))
      .where(eq(projects.userId, data.userId))
      .groupBy(projects.id, projects.name, projects.color)
      .orderBy(desc(sql`sum(${timeEntries.duration})`))
    return result
  })

export const getReportStatsFn = createServerFn()
  .validator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const [total] = await db
      .select({ total: sql<number>`coalesce(sum(${timeEntries.duration}), 0)` })
      .from(timeEntries)
      .where(and(eq(timeEntries.userId, data.userId), gte(timeEntries.startedAt, monthStart)))

    const [billable] = await db
      .select({ total: sql<number>`coalesce(sum(${timeEntries.duration}), 0)` })
      .from(timeEntries)
      .where(and(eq(timeEntries.userId, data.userId), eq(timeEntries.isBillable, true), gte(timeEntries.startedAt, monthStart)))

    const rate = total.total > 0 ? Math.round((billable.total / total.total) * 100) : 0

    // Daily breakdown for chart
    const daily = await db
      .select({
        date: sql<string>`date(${timeEntries.startedAt})`,
        total: sql<number>`coalesce(sum(${timeEntries.duration}), 0)`,
      })
      .from(timeEntries)
      .where(and(eq(timeEntries.userId, data.userId), gte(timeEntries.startedAt, monthStart)))
      .groupBy(sql`date(${timeEntries.startedAt})`)
      .orderBy(sql`date(${timeEntries.startedAt})`)

    return {
      totalHours: total.total,
      billableHours: billable.total,
      billableRate: rate,
      daily,
    }
  })

export const createProjectFn = createServerFn({ method: 'POST' })
  .validator((data: { userId: string; name: string; color: string }) => data)
  .handler(async ({ data }) => {
    const [project] = await db
      .insert(projects)
      .values({ userId: data.userId, name: data.name, color: data.color })
      .returning()
    return project
  })

export const createEntryFn = createServerFn({ method: 'POST' })
  .validator((data: {
    userId: string
    projectId: string
    description: string
    duration: number
    isBillable: boolean
    tags: string[]
  }) => data)
  .handler(async ({ data }) => {
    const now = new Date()
    const startedAt = new Date(now.getTime() - data.duration * 1000)
    const [entry] = await db
      .insert(timeEntries)
      .values({
        userId: data.userId,
        projectId: data.projectId,
        description: data.description,
        startedAt,
        endedAt: now,
        duration: data.duration,
        isBillable: data.isBillable,
        tags: data.tags,
      })
      .returning()
    return entry
  })

export const saveTimerEntryFn = createServerFn({ method: 'POST' })
  .validator((data: {
    userId: string
    projectId: string
    description: string
    duration: number
    isBillable: boolean
    tags: string[]
    startedAt: string
  }) => data)
  .handler(async ({ data }) => {
    const [entry] = await db
      .insert(timeEntries)
      .values({
        userId: data.userId,
        projectId: data.projectId,
        description: data.description,
        startedAt: new Date(data.startedAt),
        endedAt: new Date(),
        duration: data.duration,
        isBillable: data.isBillable,
        tags: data.tags,
      })
      .returning()
    return entry
  })

export const createInvoiceFn = createServerFn({ method: 'POST' })
  .validator((data: {
    userId: string
    projectId: string
    clientName: string
    clientEmail: string
  }) => data)
  .handler(async ({ data }) => {
    const count = await db
      .select({ count: sql<number>`count(*)` })
      .from(invoices)
      .where(eq(invoices.userId, data.userId))

    const invoiceNumber = `INV-${String((count[0]?.count || 0) + 1).padStart(3, '0')}`

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30)

    const [invoice] = await db
      .insert(invoices)
      .values({
        userId: data.userId,
        projectId: data.projectId,
        invoiceNumber,
        status: 'draft',
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        dueDate,
      })
      .returning()
    return invoice
  })

export const deleteProjectFn = createServerFn({ method: 'POST' })
  .validator((data: { projectId: string }) => data)
  .handler(async ({ data }) => {
    await db.delete(projects).where(eq(projects.id, data.projectId))
    return { success: true }
  })

export const deleteEntryFn = createServerFn({ method: 'POST' })
  .validator((data: { entryId: string }) => data)
  .handler(async ({ data }) => {
    await db.delete(timeEntries).where(eq(timeEntries.id, data.entryId))
    return { success: true }
  })

export const updateInvoiceStatusFn = createServerFn({ method: 'POST' })
  .validator((data: { invoiceId: string; status: string }) => data)
  .handler(async ({ data }) => {
    const [invoice] = await db
      .update(invoices)
      .set({ status: data.status, updatedAt: new Date() })
      .where(eq(invoices.id, data.invoiceId))
      .returning()
    return invoice
  })

export const deleteInvoiceFn = createServerFn({ method: 'POST' })
  .validator((data: { invoiceId: string }) => data)
  .handler(async ({ data }) => {
    await db.delete(invoices).where(eq(invoices.id, data.invoiceId))
    return { success: true }
  })

export const addInvoiceItemFn = createServerFn({ method: 'POST' })
  .validator((data: {
    invoiceId: string
    timeEntryId?: string
    description: string
    quantity: number
    unitPrice: number
  }) => data)
  .handler(async ({ data }) => {
    const amount = data.quantity * data.unitPrice
    const [item] = await db
      .insert(invoiceItems)
      .values({
        invoiceId: data.invoiceId,
        timeEntryId: data.timeEntryId || null,
        description: data.description,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        amount,
      })
      .returning()

    const [total] = await db
      .select({ total: sql<number>`coalesce(sum(${invoiceItems.amount}), 0)` })
      .from(invoiceItems)
      .where(eq(invoiceItems.invoiceId, data.invoiceId))

    await db
      .update(invoices)
      .set({ total: total.total, updatedAt: new Date() })
      .where(eq(invoices.id, data.invoiceId))

    return item
  })

export const removeInvoiceItemFn = createServerFn({ method: 'POST' })
  .validator((data: { itemId: string; invoiceId: string }) => data)
  .handler(async ({ data }) => {
    await db.delete(invoiceItems).where(eq(invoiceItems.id, data.itemId))

    const [total] = await db
      .select({ total: sql<number>`coalesce(sum(${invoiceItems.amount}), 0)` })
      .from(invoiceItems)
      .where(eq(invoiceItems.invoiceId, data.invoiceId))

    await db
      .update(invoices)
      .set({ total: total.total, updatedAt: new Date() })
      .where(eq(invoices.id, data.invoiceId))

    return { success: true }
  })

export const getInvoiceDetailFn = createServerFn()
  .validator((data: { invoiceId: string }) => data)
  .handler(async ({ data }) => {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, data.invoiceId))
      .limit(1)

    if (!invoice) return null

    const items = await db
      .select()
      .from(invoiceItems)
      .where(eq(invoiceItems.invoiceId, data.invoiceId))

    return { ...invoice, items }
  })

export const getAvailableEntriesFn = createServerFn()
  .validator((data: { userId: string; projectId: string }) => data)
  .handler(async ({ data }) => {
    const result = await db
      .select({
        id: timeEntries.id,
        description: timeEntries.description,
        duration: timeEntries.duration,
        startedAt: timeEntries.startedAt,
      })
      .from(timeEntries)
      .where(and(eq(timeEntries.userId, data.userId), eq(timeEntries.projectId, data.projectId)))
      .orderBy(desc(timeEntries.startedAt))
      .limit(50)
    return result
  })
