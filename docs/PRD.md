# Como — Time Tracker PWA
## Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** July 8, 2026  
**Status:** Active Development  

---

## 1. Executive Summary

Como is a progressive web application (PWA) time tracker designed for freelancers and students who need to understand where their time goes. It features a one-click timer, project-based organization, smart reports with charts, and professional invoice generation with PDF export.

**Tagline:** *Track your time. Grow your hustle.*

---

## 2. Problem Statement

Freelancers and students lose billable hours because they don't track time consistently. Existing tools are either too complex (enterprise solutions) or too simple (basic stopwatches). There's no middle ground that's fast enough to use daily but powerful enough to generate invoices.

---

## 3. Target Users

| Persona | Needs | Pain Points |
|---------|-------|-------------|
| **Freelancer** | Track billable hours, generate invoices, see earnings | Loses track of time, forgets to bill clients |
| **Student** | Understand study patterns, manage project time | No visibility into productive vs wasted hours |
| **Agency Worker** | Track time per project, report to clients | Needs quick switching between projects |

---

## 4. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | TanStack Start (RC) | Full-stack React framework |
| Router | TanStack Router | Type-safe file-based routing |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| Components | shadcn/ui | Accessible UI components |
| Database | PostgreSQL (Neon) | Serverless Postgres |
| ORM | Drizzle ORM | Type-safe SQL |
| Charts | Recharts | React chart library |
| Tables | @tanstack/react-table | Headless table logic |
| PDF | jsPDF | Client-side PDF generation |
| PWA | vite-plugin-pwa | Service worker + manifest |
| Auth | Custom (bcrypt + cookies) | Email/password authentication |
| Deployment | Vercel | Serverless hosting |

---

## 5. Features

### 5.1 Authentication

| Feature | Status | Description |
|---------|--------|-------------|
| Email/Password Register | ✅ Done | Create account with name, email, password |
| Email/Password Login | ✅ Done | Login with email + password |
| Logout | ✅ Done | Clear session cookie |
| Password Eye Toggle | ✅ Done | Show/hide password with eye icon |
| Session Management | ✅ Done | Cookie-based session (7 days) |

**API Endpoints:**
- `POST /register` — Create account
- `POST /login` — Authenticate
- `POST /logout` — Clear session

---

### 5.2 Timer

| Feature | Status | Description |
|---------|--------|-------------|
| Start/Pause/Resume | ✅ Done | Real-time counting with pause capability |
| Save Entry | ✅ Done | Save timer entry to database |
| Discard | ✅ Done | Reset timer without saving |
| Project Selection | ✅ Done | Select project before starting |
| Description | ✅ Done | Add description while timer runs |
| Tags | ✅ Done | Toggle tags (design, frontend, backend, etc.) |
| Billable Toggle | ✅ Done | Mark entry as billable |
| Persistent Timer | ✅ Done | Timer continues across page navigation |
| Floating Timer (PiP) | ✅ Done | Mini timer popup when navigating away |
| LocalStorage Persistence | ✅ Done | Timer survives page refresh |

**Timer States:**
```
Idle → Running → Paused → Saved/Discarded
         ↓
      (navigate away)
         ↓
    Floating Timer shows
```

---

### 5.3 Projects

| Feature | Status | Description |
|---------|--------|-------------|
| Create Project | ✅ Done | Name + color picker |
| List Projects | ✅ Done | Grid view with stats |
| Project Stats | ✅ Done | Total hours + entry count |
| Color Coding | ✅ Done | 8 preset colors |

---

### 5.4 Time Entries

| Feature | Status | Description |
|---------|--------|-------------|
| Manual Entry | ✅ Done | Add entry with project, description, hours/minutes |
| Data Table | ✅ Done | Sortable, filterable, paginated |
| Search | ✅ Done | Filter by project name |
| Delete Entry | ✅ Done | Remove individual entries |
| Billable Filter | ✅ Done | Filter by billable/non-billable |
| Duration Display | ✅ Done | Format: "2h 15m" |

---

### 5.5 Dashboard

| Feature | Status | Description |
|---------|--------|-------------|
| Stats Cards | ✅ Done | Today, Week, Month, Billable % |
| Weekly Chart | ✅ Done | Bar chart of daily hours |
| Recent Entries | ✅ Done | Last 5 time entries |
| Currently Tracking | ✅ Done | Live timer from context |
| Refresh Button | ✅ Done | Manual data refresh |

---

### 5.6 Reports

| Feature | Status | Description |
|---------|--------|-------------|
| Summary Stats | ✅ Done | Total hours, billable hours, billable rate |
| Daily Bar Chart | ✅ Done | Recharts bar chart for daily hours |
| Project Pie Chart | ✅ Done | Donut chart for project breakdown |
| Project Breakdown | ✅ Done | Progress bars with percentages |
| Refresh Button | ✅ Done | Manual data refresh |

---

### 5.7 Invoices

| Feature | Status | Description |
|---------|--------|-------------|
| Create Invoice | ✅ Done | Select project, client info |
| Invoice List | ✅ Done | DataTable with search + pagination |
| Status Workflow | ✅ Done | Draft → Sent → Paid |
| Line Items (Manual) | ✅ Done | Description, quantity, unit price |
| Line Items (Tracked Time) | ✅ Done | Select from existing time entries |
| Auto Total Calculation | ✅ Done | Sum of all line items |
| PDF Generation | ✅ Done | Professional invoice PDF |
| Delete Invoice | ✅ Done | Delete draft invoices |
| View Detail | ✅ Done | Full invoice detail page |

**Invoice Status Flow:**
```
Draft → Sent → Paid
  ↓
Delete (only for draft)
```

---

### 5.8 Settings

| Feature | Status | Description |
|---------|--------|-------------|
| Profile Info | ✅ Done | Name, email display |
| Preferences | ✅ Done | Hourly rate, currency, timezone |
| Danger Zone | ✅ Done | Delete account (UI only) |

---

### 5.9 PWA (Progressive Web App)

| Feature | Status | Description |
|---------|--------|-------------|
| Service Worker | ✅ Done | Auto-update registration |
| Web Manifest | ✅ Done | App name, icons, theme |
| Offline Support | ⚠️ Partial | Static assets cached |
| Install Prompt | ✅ Done | Browser native prompt |
| Theme Color | ✅ Done | Dark theme (#0C0E12) |
| Splash Screen | ✅ Done | Uses manifest colors |

**PWA Icon Files:**
```
public/
├── android-chrome-192x192.png   ← 192x192 Android icon
├── android-chrome-512x512.png   ← 512x512 Android icon
├── apple-touch-icon.png         ← 180x180 iOS icon
├── favicon-16x16.png            ← 16x16 favicon
├── favicon-32x32.png            ← 32x32 favicon
├── favicon.ico                  ← Default favicon
└── site.webmanifest             ← PWA manifest
```

---

### 5.10 Responsive Design

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 640px | Bottom nav, stacked grids, single column |
| Tablet | 640px - 1024px | 2-column grids, larger cards |
| Desktop | > 1024px | Sidebar nav, 3-4 column grids |

---

## 6. Database Schema

### 6.1 Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  name TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### 6.2 Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#D97706',
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### 6.3 Time Entries Table
```sql
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  description TEXT,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  duration INTEGER, -- seconds
  is_billable BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### 6.4 Invoices Table
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  status TEXT DEFAULT 'draft', -- draft, sent, paid
  client_name TEXT,
  client_email TEXT,
  due_date TIMESTAMP,
  subtotal INTEGER DEFAULT 0, -- cents
  tax_rate INTEGER DEFAULT 0,
  tax INTEGER DEFAULT 0,
  discount INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0, -- cents
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### 6.5 Invoice Items Table
```sql
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  time_entry_id UUID REFERENCES time_entries(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price INTEGER DEFAULT 0, -- cents
  amount INTEGER DEFAULT 0 -- cents
);
```

---

## 7. Server Functions

### 7.1 Auth Functions
| Function | Method | Description |
|----------|--------|-------------|
| `registerFn` | POST | Create new user account |
| `loginFn` | POST | Authenticate user |
| `logoutFn` | POST | Clear session |
| `getCurrentUserFn` | GET | Get current logged-in user |

### 7.2 Project Functions
| Function | Method | Description |
|----------|--------|-------------|
| `getProjectsFn` | GET | List user's projects |
| `getProjectStatsFn` | GET | Projects with total hours + entry count |
| `createProjectFn` | POST | Create new project |
| `deleteProjectFn` | POST | Delete project |

### 7.3 Time Entry Functions
| Function | Method | Description |
|----------|--------|-------------|
| `getRecentEntriesFn` | GET | List time entries with project info |
| `createEntryFn` | POST | Create manual time entry |
| `saveTimerEntryFn` | POST | Save timer entry with startedAt |
| `deleteEntryFn` | POST | Delete time entry |

### 7.4 Dashboard Functions
| Function | Method | Description |
|----------|--------|-------------|
| `getDashboardStatsFn` | GET | Today/week/month hours + billable rate |
| `getWeeklyStatsFn` | GET | Daily totals for weekly chart |

### 7.5 Report Functions
| Function | Method | Description |
|----------|--------|-------------|
| `getReportStatsFn` | GET | Monthly stats + daily breakdown |

### 7.6 Invoice Functions
| Function | Method | Description |
|----------|--------|-------------|
| `getInvoicesFn` | GET | List invoices |
| `getInvoiceDetailFn` | GET | Invoice with line items |
| `createInvoiceFn` | POST | Create draft invoice |
| `updateInvoiceStatusFn` | POST | Change invoice status |
| `deleteInvoiceFn` | POST | Delete draft invoice |
| `addInvoiceItemFn` | POST | Add line item to invoice |
| `removeInvoiceItemFn` | POST | Remove line item |
| `getAvailableEntriesFn` | GET | Time entries for project (for invoice) |

---

## 8. Routes

| Route | Page | Auth Required |
|-------|------|---------------|
| `/` | Landing page | No |
| `/login` | Login page | No |
| `/register` | Register page | No |
| `/dashboard` | Dashboard home | Yes |
| `/dashboard/timer` | Timer page | Yes |
| `/dashboard/projects` | Projects list | Yes |
| `/dashboard/entries` | Time entries table | Yes |
| `/dashboard/reports` | Reports & charts | Yes |
| `/dashboard/invoices` | Invoices list | Yes |
| `/dashboard/invoices/$id` | Invoice detail | Yes |
| `/dashboard/settings` | User settings | Yes |
| `/dashboard/more` | More menu (mobile) | Yes |

---

## 9. Design System

### 9.1 Color Palette (Warm Workshop)
```
Background:  #0C0E12 (warm near-black)
Surface:     #151820 (card background)
Border:      #232830 (subtle borders)
Accent:      #D97706 (amber/gold)
Accent Hover:#B45309 (darker amber)
Success:     #34D399 (emerald green)
Danger:      #F87171 (red)
Text:        #CDD5DF (warm off-white)
Text Muted:  #8892A0 (gray)
```

### 9.2 Typography
```
Display:  Space Grotesk (headings)
Body:     Space Grotesk (paragraphs)
Mono:     JetBrains Mono (timer, data)
```

### 9.3 Component Library
- shadcn/ui components
- Custom DataTable with pagination
- Custom Skeleton loaders
- Custom PasswordInput with eye toggle
- Custom FloatingTimer popup

---

## 10. File Structure

```
como/
├── public/
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   ├── favicon.png
│   └── site.webmanifest
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn components
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   └── tabs.tsx
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── data-table.tsx         # Reusable DataTable
│   │   ├── FloatingTimer.tsx      # PiP timer popup
│   │   ├── PasswordInput.tsx      # Eye toggle input
│   │   └── skeletons.tsx          # Loading skeletons
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── current-user.ts
│   │   │   ├── server.ts          # Auth server functions
│   │   │   └── session.ts         # Session management
│   │   ├── db/
│   │   │   ├── index.ts           # DB connection
│   │   │   └── schema.ts          # Drizzle schema
│   │   ├── server/
│   │   │   └── index.ts           # All server functions
│   │   ├── timer-context.tsx      # Global timer state
│   │   └── utils/
│   │       ├── pdf.ts             # PDF generation
│   │       └── seo.ts             # SEO helpers
│   ├── routes/
│   │   ├── __root.tsx             # Root layout (PWA meta)
│   │   ├── index.tsx              # Landing page
│   │   ├── _auth.tsx              # Auth layout
│   │   ├── _auth/
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── dashboard.tsx          # Dashboard layout
│   │   └── dashboard/
│   │       ├── index.tsx          # Dashboard home
│   │       ├── timer.tsx          # Timer page
│   │       ├── projects.tsx       # Projects list
│   │       ├── entries.tsx        # Time entries
│   │       ├── reports.tsx        # Reports & charts
│   │       ├── invoices.tsx       # Invoices list
│   │       ├── invoices.$id.tsx   # Invoice detail
│   │       ├── settings.tsx       # Settings
│   │       └── more.tsx           # More menu (mobile)
│   ├── styles/
│   │   └── app.css                # Global styles + design tokens
│   └── test/
│       └── setup.ts               # Test setup
├── drizzle/
│   ├── 0000_amused_vulture.sql    # Initial migration
│   └── 0001_add_password.sql      # Password migration
├── drizzle.config.ts
├── vite.config.ts                 # Vite + PWA config
├── vitest.config.ts               # Test config
├── tsconfig.json
├── seed.ts                        # Database seeder
└── package.json
```

---

## 11. Scripts

```bash
npm run dev          # Start development server (port 4000)
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run seed         # Seed database with sample data
npx tsx seed.ts      # Alternative seed command
```

---

## 12. Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/como

# Session
SESSION_SECRET=your-secret-key

# Google OAuth (optional, not implemented)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/callback
```

---

## 13. Deployment

### 13.1 Vercel
1. Connect GitHub repository
2. Set environment variables (DATABASE_URL, SESSION_SECRET)
3. Deploy automatically on push

### 13.2 Database
- Use Neon (serverless PostgreSQL)
- Run migrations: `npx drizzle-kit migrate`
- Seed data: `npx tsx seed.ts`

---

## 14. Testing

### 14.1 Test Files
```
src/lib/__tests__/utils.test.ts        # cn() utility
src/lib/__tests__/formatters.test.ts   # Duration/currency formatting
src/lib/__tests__/schema.test.ts       # DB schema validation
src/lib/auth/__tests__/session.test.ts # Cookie session management
src/lib/auth/__tests__/password.test.ts # bcrypt hashing
src/routes/__tests__/routes.test.ts    # Route structure validation
```

### 14.2 Run Tests
```bash
npm test           # Run all tests
npm run test:watch # Watch mode
```

---

## 15. Future Enhancements

| Priority | Feature | Description |
|----------|---------|-------------|
| High | Date range filter | Filter reports by custom date range |
| High | Entry editing | Edit existing time entries |
| High | Invoice email | Send invoice via email |
| Medium | Google OAuth | Login with Google account |
| Medium | Team support | Multiple users per workspace |
| Medium | Recurring entries | Auto-create recurring time entries |
| Low | Time off tracking | Track vacation/sick days |
| Low | Integrations | Connect with Trello, Asana, etc. |
| Low | Mobile app | Native iOS/Android with Capacitor |

---

## 16. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Timer start → save rate | > 80% | % of timers that get saved |
| Daily active users | 100+ | Users who log in daily |
| Invoice generation | 50+/month | Invoices created |
| Time to first entry | < 2 minutes | From signup to first timer save |
| PWA install rate | > 30% | % of users who install |

---

## 17. Known Issues

| Issue | Severity | Workaround |
|-------|----------|------------|
| PWA install not showing on iOS | Low | Manual: Share → Add to Home Screen |
| Timer resets on hard refresh | Low | Use soft navigation |
| No offline data sync | Medium | Data requires internet |
| No entry editing | Medium | Delete and re-create |

---

## 18. Contact

**Repository:** https://github.com/janfdev/como-time-tracker  
**Demo:** https://como-time-tracker.vercel.app  
**Login:** demo@como.app / password123
