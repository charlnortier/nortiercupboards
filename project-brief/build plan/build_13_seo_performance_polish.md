# Build 13 — SEO + Performance + Final Polish

> **Type:** SEO / Performance / QA  
> **Estimated Time:** 45–60 min  
> **Dependencies:** All previous builds (01–12)  
> **Context Files:** TECHNICAL_DESIGN.md §6 + §7, YOROS_UNIVERSAL_PROJECT_BRIEF.md §3–5

---

## Objective

Make the site search-ready, fast, and accessible. Structured data, sitemap, robots.txt, meta tags audit, Lighthouse pass, accessibility fixes, and final responsive polish.

---

## Tasks

### 1. Sitemap

**`src/app/sitemap.ts`**:
```typescript
import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = 'https://nortiercupboards.co.za'

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
  ]

  return staticPages
}
```

### 2. Robots.txt

**`src/app/robots.ts`**:
```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/login'],
    },
    sitemap: 'https://nortiercupboards.co.za/sitemap.xml',
  }
}
```

### 3. Meta Tags Audit

Verify `generateMetadata` on every page returns unique, keyword-rich content:

| Page | Title | Description |
|------|-------|-------------|
| `/` | Nortier Cupboards \| Custom Cupboards in Paarl, Western Cape | Custom kitchen, bedroom, bathroom & study cupboards. 20+ years experience. Design, manufacture & installation in Paarl and the Cape Winelands. |
| `/about` | About Us \| Nortier Cupboards | Over 20 years of custom cupboard design, manufacture and installation in Paarl and the Cape Winelands. |
| `/services` | Our Services \| Nortier Cupboards | Custom kitchen cupboards, bedroom built-ins, bathroom vanities, study furniture, security shutters and blinds. |
| `/gallery` | Our Work \| Nortier Cupboards | Browse our portfolio of custom cupboard projects. Before & after transformations across the Cape Winelands. |
| `/contact` | Contact Us \| Nortier Cupboards | Get a free quote for custom cupboards in Paarl and the Cape Winelands. Call, email, WhatsApp, or fill in our form. |

Each page must also have:
- [ ] `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- [ ] `twitter:card`, `twitter:title`, `twitter:description`
- [ ] Canonical URL (self-referencing)

Default OG image: create a simple branded image (`/public/og.png`) — "Nortier Cupboards" text on charcoal background with gold accent. 1200×630px.

### 4. Structured Data

**Homepage — LocalBusiness:**
```typescript
// In src/app/(public)/page.tsx or layout
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Nortier Cupboards',
  description: 'Custom cupboard design, manufacture and installation',
  url: 'https://nortiercupboards.co.za',
  telephone: settings?.phone,
  email: settings?.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: settings?.city || 'Paarl',
    addressRegion: settings?.province || 'Western Cape',
    addressCountry: 'ZA',
  },
  areaServed: ['Paarl', 'Stellenbosch', 'Franschhoek', 'Wellington', 'Somerset West'],
  priceRange: '$$',
  image: 'https://nortiercupboards.co.za/og.png',
}

// Render in <head>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

**Services page — Service schema** per service:
```typescript
const serviceJsonLd = services.map(s => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: s.title,
  description: s.short_description,
  provider: { '@type': 'LocalBusiness', name: 'Nortier Cupboards' },
  areaServed: { '@type': 'Place', name: 'Cape Winelands, Western Cape' },
}))
```

### 5. Performance Audit

Run Lighthouse and fix issues:

**Images:**
- [ ] All `<Image>` components have `sizes` prop
- [ ] All images have `alt` text
- [ ] Hero image: `priority={true}` (no lazy load)
- [ ] Gallery grid: first 3 images `priority`, rest lazy
- [ ] No raw `<img>` tags anywhere

**Fonts:**
- [ ] Both fonts loaded via `next/font` (self-hosted, no FOUT/FOIT)
- [ ] `display: 'swap'` on both fonts

**Bundle:**
- [ ] Lightbox is `dynamic(() => import(...), { ssr: false })`
- [ ] No large client-side libraries loaded on pages that don't need them
- [ ] shadcn/ui components tree-shake correctly

**Core Web Vitals targets:**
| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |
| TTFB | < 800ms |

### 6. Accessibility Audit

- [ ] All images have meaningful `alt` text
- [ ] All interactive elements have visible focus states (`focus-visible:ring-2 ring-brand-gold`)
- [ ] Colour contrast meets WCAG AA (check charcoal on white, stone on sand, white on charcoal)
- [ ] Form labels associated with inputs (`htmlFor` + `id`)
- [ ] Form error messages linked to inputs via `aria-describedby`
- [ ] Mobile nav: focus trap inside mobile menu when open
- [ ] Lightbox: focus trap when open, return focus on close
- [ ] Lightbox close: `aria-label="Close gallery"`
- [ ] Skip to content link (hidden, visible on focus)
- [ ] Heading hierarchy: single H1 per page, H2 for sections, no skipped levels

### 7. 404 Page

**`src/app/not-found.tsx`**:
- Branded 404 page
- "This page doesn't exist" + "Back to home" button
- Include nav + footer (via public layout)

### 8. Error Boundary

**`src/app/error.tsx`**:
- Client component with "Something went wrong" message
- "Try again" button (calls `reset()`)
- "Go home" link

### 9. Final Responsive Check

Test every page at these breakpoints:
- [ ] 375px (iPhone SE)
- [ ] 390px (iPhone 14)
- [ ] 768px (iPad)
- [ ] 1024px (iPad landscape / small laptop)
- [ ] 1440px (desktop)
- [ ] 1920px (large desktop)

Check:
- [ ] Nav collapses to hamburger at correct breakpoint
- [ ] Hero text doesn't overflow on small screens
- [ ] Gallery grid is 1/2/3 columns at correct breakpoints
- [ ] Contact form is usable on mobile (no tiny inputs)
- [ ] WhatsApp FAB doesn't overlap content
- [ ] Footer columns stack cleanly
- [ ] Admin sidebar works on mobile (sheet)
- [ ] Lightbox is full-screen on mobile, controls reachable with thumb

---

## Acceptance Criteria

```
SEO:
✅ /sitemap.xml generates with all 5 public pages
✅ /robots.txt blocks /admin, /api, /login
✅ Every page has unique title + description + OG tags
✅ Canonical URL on every page
✅ LocalBusiness structured data on homepage
✅ Service structured data on services page

PERFORMANCE:
✅ Lighthouse Performance > 90
✅ Lighthouse Accessibility > 95
✅ Lighthouse Best Practices > 95
✅ Lighthouse SEO > 95
✅ No raw <img> tags — all Next.js <Image>
✅ Fonts self-hosted, no layout shift
✅ Lightbox dynamically imported

ACCESSIBILITY:
✅ All images have alt text
✅ All form inputs have labels
✅ Focus states visible on all interactive elements
✅ Colour contrast passes WCAG AA
✅ Skip to content link present

GENERAL:
✅ 404 page renders with brand styling
✅ Error boundary catches and displays fallback
✅ Responsive at all tested breakpoints
✅ No console errors on any page
✅ No broken links
```
