# Build 10 — Admin Auth + Layout + Dashboard

> **Type:** Auth / UI / Layout  
> **Estimated Time:** 45–60 min  
> **Dependencies:** Build 01 (middleware, Supabase auth)  
> **Context Files:** TECHNICAL_DESIGN.md §5

---

## Objective

Set up admin authentication and the admin panel shell — login page, sidebar layout, and a simple dashboard showing lead stats and quick links. After this build, Charl can log in and see his admin area.

---

## Tasks

### 1. Login Page

**`src/app/(admin)/login/page.tsx`** — Client component:

```typescript
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
```

Design:
- Centred card on `bg-brand-parchment` full-page background
- Logo text: "NORTIER CUPBOARDS" + "Admin" badge
- **Email** input — required
- **Password** input — required, show/hide toggle (Lucide `Eye`/`EyeOff`)
- **Submit button:** "Sign In" — `bg-brand-navy text-white` full width
  - Loading state: spinner + "Signing in..."
- Error message: red text below form (e.g. "Invalid email or password")
- No "forgot password" or "sign up" — admin-only, single user
- On success: `router.push('/admin')`

Auth flow:
```typescript
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

if (error) {
  setError('Invalid email or password')
} else {
  router.push('/admin')
  router.refresh()
}
```

### 2. Admin Layout

**`src/app/(admin)/admin/layout.tsx`** — Server component:

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminTopbar } from '@/components/admin/topbar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/login')
  }

  // Get unread leads count for sidebar badge
  const { count } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar unreadLeads={count ?? 0} />
      <div className="flex-1 flex flex-col">
        <AdminTopbar user={user} />
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### 3. Admin Sidebar

**`src/components/admin/sidebar.tsx`** — Client component (needs `usePathname`):

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  FileText,
  Settings,
  ArrowLeft,
} from 'lucide-react'
```

Design:
- Fixed left sidebar: `w-64` desktop, hidden on mobile (toggle via topbar hamburger)
- `bg-brand-navy-dark text-white h-screen`
- **Top:** N|C monogram + "Admin" small badge
- **Nav items:**
  - Dashboard — `LayoutDashboard` icon — `/admin`
  - Projects — `FolderOpen` icon — `/admin/projects`
  - Leads — `MessageSquare` icon — `/admin/leads` — **red badge with unread count**
  - Content — `FileText` icon — `/admin/content`
  - Settings — `Settings` icon — `/admin/settings`
- **Bottom:** "← Back to site" link → `/` — `ArrowLeft` icon
- Active state: `bg-white/10 text-white font-semibold` + left camel accent bar
- Inactive: `text-white/60 hover:text-white hover:bg-white/5`
- Mobile: sidebar as Sheet (slide from left), triggered by hamburger in topbar

### 4. Admin Topbar

**`src/components/admin/topbar.tsx`** — Client component:

```typescript
'use client'

interface AdminTopbarProps {
  user: { email?: string }
}
```

Design:
- `bg-white border-b h-16 px-6 flex items-center justify-between`
- **Left:** Mobile hamburger (hidden on desktop) + page title breadcrumb
- **Right:** User email display + "Sign Out" button
  - Sign out: `supabase.auth.signOut()` → redirect to `/login`
- Clean, minimal — no bells and whistles

### 5. Dashboard Page

**`src/app/(admin)/admin/page.tsx`** — Server component:

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Stats
  const [
    { count: totalProjects },
    { count: newLeads },
    { count: totalLeads },
    { data: recentLeads },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
    supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  return (/* render dashboard */)
}
```

Design:
- **Heading:** "Dashboard" — `text-2xl font-bold`
- **Stats row:** 3 cards in a row
  - Total Projects: number + "Gallery projects" subtitle + link to `/admin/projects`
  - New Leads: number (highlighted if > 0 with gold bg) + "Unread enquiries" + link to `/admin/leads`
  - Total Leads: number + "All time" subtitle
  - Each card: `bg-white rounded-xl p-6 shadow-sm`
  - Number: `text-3xl font-bold font-display text-brand-camel`
- **Recent Leads table** below stats:
  - Heading: "Recent Enquiries"
  - Simple table: Name, Service Interest, Date, Status badge
  - Last 5 leads
  - "View All" link → `/admin/leads`
  - Status badges: coloured pills
    - new: `bg-brand-camel/20 text-brand-camel-dark`
    - read: `bg-brand-navy-pale text-brand-navy-light`
    - contacted: `bg-green-100 text-green-700`
    - closed: `bg-gray-100 text-gray-500`
- **Quick actions** (optional row):
  - "Add Project" → `/admin/projects/new`
  - "View Website" → `/` (new tab)

### 6. Sign Out Action

In topbar or as a server action:
```typescript
const handleSignOut = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  router.push('/login')
  router.refresh()
}
```

### 7. Create Admin User

**Manual step** (documented, not code):
1. Go to Supabase Dashboard → Authentication → Users
2. "Add User" → Charl's email + strong password
3. After creation, click user → edit user metadata:
   ```json
   { "role": "admin" }
   ```
4. User can now log in at `/login`

---

## Acceptance Criteria

```
✅ /login page renders with email + password form
✅ Successful login redirects to /admin
✅ Invalid credentials show error message
✅ /admin redirects to /login if not authenticated
✅ /admin redirects to / if authenticated but not admin role
✅ Admin sidebar renders with all 5 nav items
✅ Sidebar shows active page indicator
✅ Sidebar shows unread leads count badge
✅ "Back to site" link opens public site
✅ Topbar shows user email and sign out button
✅ Sign out works — redirects to /login
✅ Dashboard shows 3 stat cards with correct counts from DB
✅ Dashboard shows 5 most recent leads
✅ Status badges are colour-coded
✅ Mobile: sidebar is hidden, toggled via hamburger
✅ Responsive: dashboard cards stack on mobile
```
