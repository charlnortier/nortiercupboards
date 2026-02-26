# Build 04 — Homepage: Featured Projects + Services Grid

> **Type:** UI / Page  
> **Estimated Time:** 45–60 min  
> **Dependencies:** Build 03 (hero, stats, CTA in place)  
> **Context Files:** TECHNICAL_DESIGN.md §3.1, PROJECT_BRIEF.md §3.1

---

## Objective

Complete the homepage by adding the featured projects showcase and services grid between the stats strip and trust strip. After this build, the homepage is fully assembled with all 6 sections and ready for real content.

---

## Tasks

### 1. Data Fetching Helpers

**`src/lib/data/projects.ts`**:
```typescript
import { createClient } from '@/lib/supabase/server'

export async function getFeaturedProjects(limit = 4) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select(`
      *,
      project_images (
        id, image_url, image_type, alt_text, sort_order
      )
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('sort_order')
    .limit(limit)

  return data ?? []
}

export async function getAllProjects() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select(`
      *,
      project_images (
        id, image_url, image_type, alt_text, sort_order
      )
    `)
    .eq('is_active', true)
    .order('sort_order')

  return data ?? []
}

// Helper: get the primary display image for a project
export function getProjectMainImage(project: any): string | null {
  const images = project.project_images ?? []
  // Prefer first 'after' image, then any image
  const afterImg = images
    .filter((i: any) => i.image_type === 'after')
    .sort((a: any, b: any) => a.sort_order - b.sort_order)[0]
  const anyImg = images
    .sort((a: any, b: any) => a.sort_order - b.sort_order)[0]
  return afterImg?.image_url || anyImg?.image_url || null
}
```

**`src/lib/data/services.ts`**:
```typescript
import { createClient } from '@/lib/supabase/server'

export async function getServices() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return data ?? []
}
```

### 2. Featured Projects Section

**`src/components/shared/featured-projects.tsx`** — Server component:

```typescript
interface FeaturedProjectsProps {
  projects: ProjectWithImages[]
}
```

Design:
- Section wrapper: `bg-white py-16 md:py-24`
- Section heading: "Our Recent Work" — centred, `font-display text-3xl font-bold text-brand-navy-dark`
- Subheading: "Before & after transformations across the Cape Winelands" — `text-brand-slate`
- Grid: 2 columns desktop, 1 column mobile (`grid grid-cols-1 md:grid-cols-2 gap-6`)
- For 3 featured: first card spans full width top, 2 below side-by-side
- For 4 featured: 2×2 grid
- "View All Projects" link below → `/gallery`

### 3. Project Card Component

**`src/components/shared/project-card.tsx`** — Server component (reused on gallery page later):

```typescript
interface ProjectCardProps {
  title: string
  roomType: string
  location?: string
  imageUrl: string | null
  slug: string
  hasBefore?: boolean  // shows "Before & After" badge
}
```

Design:
- Card with rounded corners, subtle shadow on hover (`hover:shadow-lg transition-shadow`)
- **Image:** aspect-ratio 4:3, `object-cover`, full width
  - If no image: placeholder gradient with cupboard icon (Lucide `Cabinet` or similar)
  - Next.js `<Image>` with `fill` and `sizes` attribute
- **Overlay badge** (top-left): room type — "Kitchen", "Bedroom", etc.
  - Small pill: `bg-brand-camel/90 text-brand-navy text-xs font-semibold px-3 py-1 rounded-full`
- **Before & After badge** (top-right, if applicable):
  - "Before & After" pill: `bg-white/90 text-brand-navy text-xs`
- **Bottom strip:** title + optional location
  - Title: `font-display font-bold text-lg text-brand-navy-dark`
  - Location: `text-brand-slate text-sm` (e.g. "Stellenbosch")
- Entire card is a link:
  - On homepage: links to `/gallery` (or opens lightbox — decide in Build 10)
  - On gallery: opens lightbox
- Hover: slight scale (`hover:scale-[1.02]`) + shadow lift

### 4. Services Grid Section

**`src/components/shared/services-grid.tsx`** — Server component:

```typescript
interface ServicesGridProps {
  services: Service[]
}
```

Design:
- Section wrapper: `bg-brand-parchment py-16 md:py-24`
- Section heading: "What We Build" — centred, `font-display text-3xl font-bold text-brand-navy-dark`
- Subheading: "From kitchen cupboards to security shutters — custom-made for your home." — `text-brand-slate`
- Grid: 3 columns desktop, 2 columns tablet, 1 column mobile
  - `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- "See All Services" link below → `/services`

### 5. Service Card Component

**`src/components/shared/service-card.tsx`** — Server component:

```typescript
interface ServiceCardProps {
  icon: string        // emoji from DB
  title: string
  description: string
  href: string
}
```

Design:
- Card: `bg-white rounded-xl p-6`, subtle border `border border-brand-sandstone`
- Icon: large emoji top, `text-3xl mb-3`
- Title: `font-display font-bold text-lg text-brand-navy-dark mb-2`
- Description: `text-brand-slate text-sm leading-relaxed` (1-2 lines, from `short_description`)
- Hover: camel left border appears (`hover:border-l-4 hover:border-l-brand-camel`), slight shadow
- Entire card links to `/services` (not individual service pages — single page site)

### 6. Assemble Complete Homepage

**Update `src/app/(public)/page.tsx`**:
```typescript
import { getContent } from '@/lib/data/content'
import { getTrustStats } from '@/lib/data/stats'
import { getSettings } from '@/lib/data/settings'
import { getFeaturedProjects } from '@/lib/data/projects'
import { getServices } from '@/lib/data/services'
import { Hero } from '@/components/shared/hero'
import { TrustStats } from '@/components/shared/trust-stats'
import { FeaturedProjects } from '@/components/shared/featured-projects'
import { ServicesGrid } from '@/components/shared/services-grid'
import { TrustStrip } from '@/components/shared/trust-strip'
import { CtaBanner } from '@/components/shared/cta-banner'

export const revalidate = 3600

export default async function HomePage() {
  const [content, stats, settings, projects, services] = await Promise.all([
    getContent('home'),
    getTrustStats(),
    getSettings(),
    getFeaturedProjects(4),
    getServices(),
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
      <FeaturedProjects projects={projects} />
      <ServicesGrid services={services} />
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

### 7. Homepage Section Flow (Final)

```
┌─────────────────────────────────────────┐
│  NAV (sticky, from Build 02)            │
├─────────────────────────────────────────┤
│  HERO — dark bg, white text, 2 CTAs     │  bg: image + overlay
│  "Custom Cupboards. Built to Last."     │
├─────────────────────────────────────────┤
│  TRUST STATS — 4 counters              │  bg: charcoal
│  20+ Years | 500+ Projects | Paarl | ✓  │
├─────────────────────────────────────────┤
│  FEATURED PROJECTS — 3-4 cards         │  bg: white
│  "Our Recent Work"                      │
├─────────────────────────────────────────┤
│  SERVICES GRID — 6 cards               │  bg: sand
│  "What We Build"                        │
├─────────────────────────────────────────┤
│  TRUST STRIP — single line text        │  bg: sand (lighter)
├─────────────────────────────────────────┤
│  CTA BANNER                             │  bg: gold
│  "Ready to transform your kitchen?"     │
├─────────────────────────────────────────┤
│  FOOTER (from Build 02)                 │  bg: charcoal
├─────────────────────────────────────────┤
│  WHATSAPP FAB (from Build 02)           │  fixed bottom-right
└─────────────────────────────────────────┘
```

---

## Placeholder Images

Until client provides real photos, use CSS gradient placeholders:

```typescript
// Placeholder for project cards with no images
function ProjectPlaceholder({ roomType }: { roomType: string }) {
  const gradients: Record<string, string> = {
    kitchen: 'from-amber-100 to-amber-50',
    bedroom: 'from-blue-100 to-blue-50',
    bathroom: 'from-cyan-100 to-cyan-50',
    study: 'from-green-100 to-green-50',
    other: 'from-gray-100 to-gray-50',
  }
  return (
    <div className={`bg-gradient-to-br ${gradients[roomType] || gradients.other} flex items-center justify-center`}>
      <span className="text-4xl opacity-30">🪚</span>
    </div>
  )
}
```

---

## Acceptance Criteria

```
✅ Homepage displays all 6 sections in correct order
✅ Featured projects section shows projects marked as featured from DB
✅ Project cards display image (or placeholder), title, room type badge
✅ Services grid shows all 6 services from services table
✅ Service cards display icon, title, short description from DB
✅ "View All Projects" links to /gallery
✅ "See All Services" links to /services
✅ All content comes from database (zero hardcoded text)
✅ Responsive: project grid 1-col mobile / 2-col desktop
✅ Responsive: services grid 1-col mobile / 2-col tablet / 3-col desktop
✅ Hover states on project cards and service cards work
✅ Homepage complete — all sections render without errors
```
