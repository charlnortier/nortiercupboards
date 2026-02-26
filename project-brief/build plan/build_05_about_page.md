# Build 05 — About Page

> **Type:** UI / Page  
> **Estimated Time:** 30–45 min  
> **Dependencies:** Build 02 (layout), Build 03 (content helpers)  
> **Context Files:** TECHNICAL_DESIGN.md §3.2, PROJECT_BRIEF.md §3.2

---

## Objective

Build the About page — owner story, 4-step process, trust signals, and service area. All content from database.

---

## Tasks

### 1. Page Setup

**`src/app/(public)/about/page.tsx`**:
```typescript
import { Metadata } from 'next'
import { getContent } from '@/lib/data/content'
import { getSettings } from '@/lib/data/settings'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Over 20 years of custom cupboard design, manufacture and installation in Paarl and the Cape Winelands.',
}

export const revalidate = 86400 // 24h
```

### 2. Page Hero

**`src/components/shared/page-hero.tsx`** — Reusable for all inner pages:

```typescript
interface PageHeroProps {
  title: string
  subtitle?: string
  breadcrumb?: { label: string; href: string }[]
}
```

Design:
- `bg-brand-navy text-white py-16 md:py-20`
- Breadcrumb: Home > About — `text-brand-camel text-sm`
- Title: `font-display text-4xl md:text-5xl font-extrabold`
- Subtitle: `text-white/70 text-lg mt-3`
- Reused on About, Services, Gallery, Contact pages

### 3. Owner Story Section

Design:
- `bg-white py-16`
- 2-column: left = photo placeholder (rounded, aspect-square), right = story text
- Story text from `site_content` (`about/story`)
- Pull quote or highlight: "No job is too big or too small" — `text-brand-camel font-display text-xl italic`
- Mobile: stack vertically, photo on top

### 4. Process Steps Section

Design:
- `bg-brand-parchment py-16`
- Heading: "How We Work" — centred
- 4 steps in a horizontal timeline (desktop) / vertical stack (mobile)
- Each step:
  - Circle with step number: `bg-brand-camel text-brand-navy w-12 h-12 rounded-full font-bold text-lg`
  - Title: bold (e.g. "Consultation", "Design", "Manufacture", "Installation")
  - Description from `site_content` (`about/process_step1` through `process_step4`)
- Connecting line between circles (desktop only, horizontal `border-t-2 border-brand-camel/30`)

### 5. Why Choose Us Section

Design:
- `bg-white py-16`
- Heading: "Why Nortier Cupboards" — centred
- Grid of 5 trust items, 3-col desktop / 2-col tablet / 1-col mobile
- Each item: icon (Lucide) + bold title + short description
  - ✅ 20+ Years Experience — "Two decades of trusted craftsmanship"
  - ✅ ArtiCAD 3D Design — "See your cupboards before we build them"
  - ✅ Full Service — "Design, manufacture, and installation under one roof"
  - ✅ References Available — "We're happy to prove our track record"
  - ✅ Any Budget — "From R30k to R300k — we work with your budget"
- Card style: `bg-brand-navy-pale rounded-xl p-6`

### 6. Service Area Section

Design:
- `bg-brand-navy text-white py-12`
- Heading: "Where We Work"
- Single line or wrapped pills: Paarl, Stellenbosch, Franschhoek, Wellington, Somerset West, Cape Winelands, Broader Western Cape
- Each as a pill: `bg-white/10 text-white/80 px-4 py-2 rounded-full text-sm`
- Or: `bg-brand-camel/20 text-brand-camel` for accent feel
- Or a simple comma-separated list — keep it minimal

### 7. Bottom CTA

Reuse `<CtaBanner />` from Build 03:
- "Ready to start your project?"
- "Get a Free Quote" → `/contact`

---

## Acceptance Criteria

```
✅ About page renders at /about with correct metadata
✅ PageHero component reusable (will be used on Services, Gallery, Contact)
✅ Owner story displays text from site_content (about/story)
✅ 4 process steps render with content from DB
✅ Why choose us grid displays 5 trust items
✅ Service area towns display
✅ Bottom CTA links to /contact
✅ Responsive: 2-col story stacks on mobile, process steps go vertical
✅ All text from database
```
