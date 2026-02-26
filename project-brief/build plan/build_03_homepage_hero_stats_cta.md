# Build 03 — Homepage: Hero + Stats + CTA Banner

> **Type:** UI / Page  
> **Estimated Time:** 45–60 min  
> **Dependencies:** Build 02 (layout shell in place)  
> **Context Files:** TECHNICAL_DESIGN.md §3.1, PROJECT_BRIEF.md §3.1

---

## Objective

Build the homepage top and bottom — hero section with background image and CTAs, trust stats counter strip, and a CTA banner. After this build, the homepage makes a strong first impression and drives action.

---

## Tasks

### 1. Data Fetching Helpers

**`src/lib/data/content.ts`**:
```typescript
import { createClient } from '@/lib/supabase/server'

export async function getContent(page: string, sections?: string[]) {
  const supabase = await createClient()
  let query = supabase
    .from('site_content')
    .select('section, value, content_type')
    .eq('page', page)

  if (sections) {
    query = query.in('section', sections)
  }

  const { data } = await query.order('sort_order')

  // Return as key-value map for easy access
  const map: Record<string, string> = {}
  data?.forEach(row => { map[row.section] = row.value })
  return map
}
```

**`src/lib/data/stats.ts`**:
```typescript
import { createClient } from '@/lib/supabase/server'

export async function getTrustStats() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('trust_stats')
    .select('*')
    .order('sort_order')
  return data ?? []
}
```

### 2. Hero Section

**`src/components/shared/hero.tsx`** — Server component:

```typescript
interface HeroProps {
  title: string
  subtitle: string
  ctaPrimary: { label: string; href: string }
  ctaSecondary: { label: string; href: string }
  whatsapp?: string
}
```

Design:
- Full viewport width, `min-h-[85vh]` on desktop, `min-h-[70vh]` on mobile
- Background: placeholder navy gradient for now (will be a real kitchen photo)
  - Navy overlay (`bg-brand-navy/70`) for text contrast
  - Background image via inline style (URL from `site_content` later) or Next.js Image as background
- Content centred vertically and horizontally
- **H1:** `hero_title` from DB — large, white, Plus Jakarta Sans 800
  - e.g. "Custom Cupboards. Built to Last."
  - Desktop: `text-5xl` / Mobile: `text-3xl`
- **Subtitle:** `hero_subtitle` — white/90 opacity, lighter weight
  - e.g. "20+ years of quality craftsmanship in the Cape Winelands"
- **CTA buttons** (horizontal on desktop, stacked on mobile):
  - Primary: "Get a Free Quote" → `/contact` — solid `bg-brand-camel text-brand-navy` pill button, large
  - Secondary: "View Our Work" → `/gallery` — outline white border, white text
- **WhatsApp shortcut** below buttons:
  - Small text: "Or" + WhatsApp icon + "WhatsApp us now" → `wa.me` link
  - `text-white/70` hover `text-white`
- Subtle scroll indicator at bottom (chevron down, gentle bounce animation)

### 3. Trust Stats Strip

**`src/components/shared/trust-stats.tsx`** — Server component:

```typescript
interface TrustStat {
  icon: string
  value: string
  suffix: string
  label: string
}
```

Design:
- Full-width strip, `bg-brand-navy text-white`
- 4 stat blocks in a row (desktop) / 2×2 grid (mobile)
- Each block:
  - Icon (emoji from DB, rendered as-is)
  - Value in large bold text (`text-3xl font-display font-800 text-brand-camel`)
  - Suffix/label below in smaller `text-white/70`
- Example: `🏗️ 20+ Years` | `🍳 500+ Projects` | `📍 Paarl WC` | `✓ Free Quotes`
- Tight padding, compact feel — this is a confidence strip, not a hero

### 4. CTA Banner

**`src/components/shared/cta-banner.tsx`** — Server component:

```typescript
interface CtaBannerProps {
  heading: string
  text: string
  ctaLabel: string
  ctaHref: string
  whatsapp?: string
}
```

Design:
- Full-width, `bg-brand-camel text-brand-navy-dark`
- Centred content, comfortable padding (`py-16 md:py-20`)
- Heading: bold, `text-3xl md:text-4xl`
  - e.g. "Ready to transform your kitchen?"
- Subtext: 1-2 lines below
  - e.g. "Get a free, no-obligation quote. We'll visit, measure, and design your dream cupboards."
- CTA button: `bg-brand-navy text-white` — "Get a Free Quote" → `/contact`
- WhatsApp alternative: "Or WhatsApp us" link below button
- Slightly offset bottom margin so it sits above footer nicely

### 5. Trust Strip (simple text)

**`src/components/shared/trust-strip.tsx`** — Server component:

```typescript
interface TrustStripProps {
  text: string  // "20+ Years Experience · Free Quotes · ..."
}
```

Design:
- Full-width, `bg-brand-navy-pale`
- Single centred line of text, dot-separated
- `text-brand-slate text-sm tracking-wide uppercase`
- Minimal padding (`py-4`)
- Rendered between services grid and CTA banner

### 6. Assemble Homepage (Partial)

**`src/app/(public)/page.tsx`**:
```typescript
import { getContent } from '@/lib/data/content'
import { getTrustStats } from '@/lib/data/stats'
import { getSettings } from '@/lib/data/settings'
import { Hero } from '@/components/shared/hero'
import { TrustStats } from '@/components/shared/trust-stats'
import { TrustStrip } from '@/components/shared/trust-strip'
import { CtaBanner } from '@/components/shared/cta-banner'

export const revalidate = 3600 // ISR: revalidate every hour

export default async function HomePage() {
  const [content, stats, settings] = await Promise.all([
    getContent('home'),
    getTrustStats(),
    getSettings(),
  ])

  return (
    <>
      <Hero
        title={content.hero_title}
        subtitle={content.hero_subtitle}
        ctaPrimary={{ label: content.hero_cta_primary, href: '/contact' }}
        ctaSecondary={{ label: content.hero_cta_secondary, href: '/gallery' }}
        whatsapp={settings?.whatsapp}
      />
      <TrustStats stats={stats} />

      {/* Featured Projects + Services Grid added in Build 04 */}

      <TrustStrip text={content.trust_strip} />
      <CtaBanner
        heading={content.cta_heading}
        text={content.cta_text}
        ctaLabel="Get a Free Quote"
        ctaHref="/contact"
        whatsapp={settings?.whatsapp}
      />
    </>
  )
}
```

---

## Design Notes

### Colour usage on homepage
- Hero: navy overlay on image, white text, camel + white buttons
- Stats strip: navy bg, camel numbers, white/70 labels
- (Middle sections: parchment/white bg — Build 04)
- Trust strip: navy-pale bg, slate text
- CTA banner: camel bg, navy text, navy button

### Typography hierarchy
- Hero H1: `font-display text-5xl font-extrabold text-white` (Plus Jakarta Sans 800)
- Hero subtitle: `font-body text-xl text-white/70`
- Stat values: `font-display text-3xl font-bold text-brand-camel`
- CTA heading: `font-display text-3xl md:text-4xl font-bold text-brand-navy-dark`
- Body/descriptions: `font-body text-base text-brand-navy-dark`

---

## Acceptance Criteria

```
✅ Hero renders full-width with title + subtitle from database
✅ Hero CTA buttons link to /contact and /gallery
✅ Hero WhatsApp shortcut links to correct wa.me URL
✅ Trust stats display 4 blocks from trust_stats table
✅ Stats responsive: 4-col desktop, 2×2 mobile
✅ Trust strip renders single-line text from site_content
✅ CTA banner renders with heading + text from database
✅ CTA button links to /contact
✅ All text comes from database (zero hardcoded copy)
✅ Page uses ISR with 1-hour revalidation
✅ Responsive: hero stacks CTAs on mobile, stats wrap to 2×2
```
