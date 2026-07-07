import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import * as schema from './src/lib/db/schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle(pool, { schema })

async function seed() {
  console.log('Seeding database...')

  // Clean existing data
  await db.delete(schema.invoiceItems)
  await db.delete(schema.invoices)
  await db.delete(schema.timeEntries)
  await db.delete(schema.projects)
  await db.delete(schema.users)

  // Create user
  const hashedPassword = await bcrypt.hash('password123', 10)
  const [user] = await db
    .insert(schema.users)
    .values({
      email: 'demo@como.app',
      password: hashedPassword,
      name: 'Demo User',
    })
    .returning()

  console.log('Created user:', user.email)

  // Create projects
  const projectData = [
    { name: 'Website Redesign', color: '#D97706', userId: user.id },
    { name: 'Mobile App', color: '#34D399', userId: user.id },
    { name: 'API Development', color: '#60A5FA', userId: user.id },
    { name: 'UI/UX Design', color: '#F472B6', userId: user.id },
    { name: 'Marketing Campaign', color: '#A78BFA', userId: user.id },
  ]

  const projects = await db
    .insert(schema.projects)
    .values(projectData)
    .returning()

  console.log('Created', projects.length, 'projects')

  // Create time entries for the past 30 days
  const now = new Date()
  const entries: (typeof schema.timeEntries.$inferInsert)[] = []

  const descriptions: Record<string, string[]> = {
    'Website Redesign': ['Homepage layout', 'Responsive fixes', 'Footer redesign', 'About page', 'Contact form', 'Navigation menu'],
    'Mobile App': ['API integration', 'Push notifications', 'User profile screen', 'Login flow', 'Dashboard UI', 'Settings page'],
    'API Development': ['Auth endpoints', 'User CRUD', 'File upload', 'Rate limiting', 'Database optimization', 'Error handling'],
    'UI/UX Design': ['User research', 'Wireframes', 'Prototype v2', 'Design system', 'Icon set', 'Color palette'],
    'Marketing Campaign': ['Social media assets', 'Landing page copy', 'Email template', 'Ad creatives', 'Analytics setup', 'SEO audit'],
  }

  const tags = ['design', 'frontend', 'backend', 'meeting', 'research', 'bugfix', 'review']

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(now)
    date.setDate(date.getDate() - dayOffset)

    // Skip some days randomly
    if (dayOffset % 7 === 6) continue // skip sundays
    if (Math.random() > 0.8 && dayOffset > 5) continue // random skip

    // 1-4 entries per day
    const entriesPerDay = Math.floor(Math.random() * 3) + 1

    for (let i = 0; i < entriesPerDay; i++) {
      const project = projects[Math.floor(Math.random() * projects.length)]
      const projectDescriptions = descriptions[project.name] || ['General work']
      const description = projectDescriptions[Math.floor(Math.random() * projectDescriptions.length)]

      const startHour = 8 + Math.floor(Math.random() * 10)
      const startMinute = Math.floor(Math.random() * 60)
      const durationMinutes = 30 + Math.floor(Math.random() * 180) // 30min to 3.5h

      const startedAt = new Date(date)
      startedAt.setHours(startHour, startMinute, 0, 0)

      const endedAt = new Date(startedAt)
      endedAt.setMinutes(endedAt.getMinutes() + durationMinutes)

      const entryTags = tags
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1)

      entries.push({
        userId: user.id,
        projectId: project.id,
        description,
        startedAt,
        endedAt,
        duration: durationMinutes * 60,
        isBillable: Math.random() > 0.25,
        tags: entryTags,
      })
    }
  }

  const insertedEntries = await db
    .insert(schema.timeEntries)
    .values(entries)
    .returning()

  console.log('Created', insertedEntries.length, 'time entries')

  // Create invoices
  const invoiceData = [
    {
      userId: user.id,
      projectId: projects[0].id,
      invoiceNumber: 'INV-001',
      status: 'paid',
      clientName: 'Acme Corp',
      clientEmail: 'billing@acme.com',
      subtotal: 450000,
      taxRate: 10,
      tax: 45000,
      total: 495000,
      dueDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      userId: user.id,
      projectId: projects[1].id,
      invoiceNumber: 'INV-002',
      status: 'sent',
      clientName: 'Tech Startup',
      clientEmail: 'finance@techstartup.io',
      subtotal: 320000,
      taxRate: 10,
      tax: 32000,
      total: 352000,
      dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
    },
    {
      userId: user.id,
      projectId: projects[2].id,
      invoiceNumber: 'INV-003',
      status: 'draft',
      clientName: 'Design Agency',
      clientEmail: 'pay@designagency.co',
      subtotal: 180000,
      taxRate: 10,
      tax: 18000,
      total: 198000,
      dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    },
  ]

  const invoices = await db
    .insert(schema.invoices)
    .values(invoiceData)
    .returning()

  console.log('Created', invoices.length, 'invoices')

  // Create invoice items
  const invoiceItems: (typeof schema.invoiceItems.$inferInsert)[] = []

  for (const invoice of invoices) {
    const projectEntries = insertedEntries
      .filter((e) => e.projectId === invoice.projectId)
      .slice(0, 3)

    for (const entry of projectEntries) {
      const hours = (entry.duration || 0) / 3600
      const unitPrice = 7500 // $75/hour in cents
      invoiceItems.push({
        invoiceId: invoice.id,
        timeEntryId: entry.id,
        description: entry.description || 'Development work',
        quantity: Math.ceil(hours),
        unitPrice,
        amount: Math.ceil(hours) * unitPrice,
      })
    }
  }

  await db.insert(schema.invoiceItems).values(invoiceItems)

  console.log('Created', invoiceItems.length, 'invoice items')
  console.log('Seed completed!')
  console.log('')
  console.log('Login with:')
  console.log('  Email: demo@como.app')
  console.log('  Password: password123')

  await pool.end()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
