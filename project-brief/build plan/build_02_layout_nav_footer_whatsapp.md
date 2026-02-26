# Build 02 — Layout: Nav + Footer + WhatsApp FAB

> **Type:** UI / Layout  
> **Estimated Time:** 45–60 min  
> **Dependencies:** Build 01 (scaffold + Supabase connected)  
> **Context Files:** TECHNICAL_DESIGN.md §4 (Global Components), PROJECT_BRIEF.md §4 (WhatsApp Button)

---

## Objective

Build the global shell — sticky navigation, footer, and floating WhatsApp button. After this build, every page has a consistent wrapper with nav, footer, and a way to reach the business instantly.

---

## Tasks

### 1. Data Fetching Helpers

**`src/lib/data/settings.ts`**:
```typescript
import { createClient } from '@/lib/supabase/server'

export async function getSettings() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single()
  return data
}
```

**`src/lib/data/nav.ts`**:
```typescript
import { createClient } from '@/lib/supabase/server'

export async function getNavLinks() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('nav_links')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return data ?? []
}

export async function getFooterLinks() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('footer_links')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return data ?? []
}
```

### 2. Navigation Component

**`src/components/layout/nav.tsx`** — Server component wrapper:
```typescript
// Fetches data, passes to client NavBar
import { getNavLinks, getSettings } from '@/lib/data/...'
import { NavBar } from './nav-bar'

export async function Nav() {
  const [links, settings] = await Promise.all([
    getNavLinks(),
    getSettings(),
  ])
  return <NavBar links={links} whatsapp={settings?.whatsapp} />
}
```

**`src/components/layout/nav-bar.tsx`** — Client component:
- Sticky top, `backdrop-filter: blur(12px)`, `bg-brand-navy/95`
- Left: Logo (N|C monogram image + "NORTIER CUPBOARDS" text in Plus Jakarta Sans 700, camel `#C4A265`)
- Centre: nav links from DB (not hardcoded)
- Right: WhatsApp pill button (green bg, white text: "WhatsApp Us")
- Links: white text, active page: camel underline based on `usePathname()`
- Mobile (< 768px): hamburger icon (white) → triggers `<MobileMenu />`
- CTA link (`is_cta = true`) styled as pill: `bg-brand-camel text-brand-navy font-semibold`

**`src/components/layout/mobile-menu.tsx`** — Client component:
- Sheet/drawer from right (use shadcn Sheet)
- All nav links (full width, large tap targets)
- WhatsApp CTA button at bottom (full width, green)
- Close on link click
- Close on backdrop click

### 3. Footer Component

**`src/components/layout/footer.tsx`** — Server component:
```typescript
// Fetch footer links grouped by column_name + settings
```

Structure:
- Top section: 4-column grid
  - **Column 1 (brand):** Logo text + tagline + short description
  - **Column 2 (Services):** footer links where `column_name = 'services'`
  - **Column 3 (Company):** footer links where `column_name = 'company'`
  - **Column 4 (Contact):** Phone (click-to-call), email (mailto), WhatsApp, address — from `site_settings`
- Bottom bar: `© 2026 Nortier Cupboards` left, `Powered by Yoros` right
- Mobile: columns stack vertically
- Styling: `bg-brand-navy-dark text-white`, headings in `text-brand-camel`, links in `text-white/60` with hover `text-white`

### 4. Floating WhatsApp Button

**`src/components/layout/whatsapp-fab.tsx`** — Client component:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'

interface WhatsAppFabProps {
  phone: string
  message?: string
}

export function WhatsAppFab({ phone, message = "Hi Nortier Cupboards, I'm interested in getting a quote." }: WhatsAppFabProps) {
  const [pulsed, setPulsed] = useState(false)

  useEffect(() => {
    // Single pulse on first load
    const timer = setTimeout(() => setPulsed(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-brand-whatsapp px-4 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl md:px-5"
      aria-label="Chat on WhatsApp"
    >
      {/* WhatsApp icon */}
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" /* WhatsApp SVG path *//>
      <span className="hidden text-sm font-semibold md:inline">WhatsApp Us</span>
    </a>
  )
}
```

Key details:
- Green `#25D366` background
- 56px circle on mobile (icon only), pill on desktop (icon + text)
- Fixed `bottom-6 right-6`, `z-index: 50`
- Single pulse animation on first visit (CSS `@keyframes pulse`)
- `wa.me` link with pre-filled message
- On `/contact` page: add extra bottom offset so it doesn't overlap the form submit button

### 5. Public Layout

**`src/app/(public)/layout.tsx`**:
```typescript
import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'
import { WhatsAppFab } from '@/components/layout/whatsapp-fab'
import { getSettings } from '@/lib/data/settings'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <>
      <Nav />
      <main className="min-h-screen">{children}</main>
      <Footer />
      {settings?.whatsapp && (
        <WhatsAppFab phone={settings.whatsapp} />
      )}
    </>
  )
}
```

### 6. Seed Footer Links

Add to Migration 003 (or run manually if already seeded):

```sql
INSERT INTO footer_links (column_name, label, href, sort_order) VALUES
  ('services', 'Kitchen Cupboards', '/services', 0),
  ('services', 'Bedroom Cupboards', '/services', 1),
  ('services', 'Bathroom Vanities', '/services', 2),
  ('services', 'Security Shutters', '/services', 3),
  ('company', 'About Us', '/about', 0),
  ('company', 'Our Work', '/gallery', 1),
  ('company', 'Contact', '/contact', 2);
```

---

## Acceptance Criteria

```
✅ Nav renders on every public page with links from database
✅ Active page is visually indicated in nav
✅ Nav is sticky with blur backdrop on scroll
✅ Mobile hamburger opens sheet with all links
✅ Mobile menu closes on link click
✅ Footer renders 4 columns with correct data from DB
✅ Footer contact details come from site_settings (not hardcoded)
✅ "Powered by Yoros" in footer bottom bar
✅ WhatsApp FAB visible bottom-right on all pages
✅ WhatsApp FAB links to correct wa.me URL with pre-filled message
✅ WhatsApp FAB shows text label on desktop, icon-only on mobile
✅ Responsive: nav collapses to hamburger, footer stacks, FAB repositions
```
