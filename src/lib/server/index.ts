import { createServerFn } from '@tanstack/react-start'
import { db } from '~/lib/db'
import { projects, timeEntries, invoices, users } from '~/lib/db/schema'
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
