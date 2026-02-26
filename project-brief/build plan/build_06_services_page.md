# Build 06 — Services Page

> **Type:** UI / Page  
> **Estimated Time:** 30–45 min  
> **Dependencies:** Build 04 (services data helper), Build 05 (PageHero)  
> **Context Files:** TECHNICAL_DESIGN.md §3.4, PROJECT_BRIEF.md §3.4

---

## Objective

Build the Services page — one full section per service with alternating layout, feature pills, and per-service CTAs.

---

## Tasks

### 1. Page Setup

**`src/app/(public)/services/page.tsx`**:
```typescript
import { Metadata } from 'next'
import { getServices } from '@/lib/data/services'

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Custom kitchen cupboards, bedroom built-ins, bathroom vanities, study furniture, security shutters and blinds. Design, manufacture & installation.',
}

export const revalidate = 86400
```

### 2. Service Section Component

**`src/components/shared/service-section.tsx`**:

```typescript
interface ServiceSectionProps {
  title: string
  slug: string
  description: string
  features: string[]
  icon: string
  imageUrl?: string
  reversed?: boolean  // flip image/text sides
}
```

Design:
- Full-width section, alternating `bg-white` / `bg-brand-sand`
- 2-column layout: image left + text right (or reversed)
- **Image side:**
  - Placeholder: gradient bg with large icon emoji
  - Later: real project photo via `image_url` from DB
  - Rounded corners, `aspect-video` or `aspect-4/3`
- **Text side:**
  - Icon emoji: `text-3xl mb-2`
  - Title: `font-display text-2xl md:text-3xl font-bold`
  - Description: `text-brand-stone leading-relaxed` (from `full_description`, fallback to `short_description`)
  - Feature pills: horizontal wrap of small pills
    - `bg-brand-camel/10 text-brand-navy-dark text-sm px-3 py-1 rounded-full`
    - Parsed from JSONB `features` array
  - CTA: "Get a Quote" → `/contact?service={slug}`
    - `bg-brand-camel text-brand-navy font-semibold px-6 py-3 rounded-lg`
- Mobile: stack vertically (image on top, text below), no reversal
- Desktop: alternating left/right creates visual rhythm

### 3. Page Assembly

```typescript
export default async function ServicesPage() {
  const services = await getServices()

  return (
    <>
      <PageHero
        title="What We Build"
        subtitle="Custom-made cupboards and installations for every room in your home."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }]}
      />

      {services.map((service, index) => (
        <ServiceSection
          key={service.id}
          title={service.title}
          slug={service.slug}
          description={service.full_description || service.short_description || ''}
          features={service.features as string[] || []}
          icon={service.icon || '🪚'}
          imageUrl={service.image_url}
          reversed={index % 2 === 1}
        />
      ))}

      <CtaBanner
        heading="Not sure what you need?"
        text="Get in touch — we'll visit, measure, and recommend the best solution for your home."
        ctaLabel="Contact Us"
        ctaHref="/contact"
      />
    </>
  )
}
```

### 4. Kitchen Section — Hero Treatment

The first service (Kitchen Cupboards) gets extra prominence:
- Larger image area
- Extra detail paragraph about finishes: melamine, wrap, spray, hand-painted
- Mention ArtiCAD 3D design specifically
- More feature pills than other sections

All other services are standard `<ServiceSection />` components.

### 5. Anchor Links (Optional)

Add `id` to each section for direct linking:
```html
<section id="kitchen-cupboards">...</section>
```

Nav within page (optional): sticky sub-nav or jump links at top of page. Keep simple — only add if there are 6+ services making the page long.

---

## Acceptance Criteria

```
✅ Services page renders at /services with correct metadata
✅ All 6 services from DB display as full sections
✅ Sections alternate left/right image placement on desktop
✅ Feature pills render from JSONB features array
✅ Each service has "Get a Quote" CTA → /contact?service={slug}
✅ Kitchen section has hero treatment (larger, more detail)
✅ Bottom CTA links to /contact
✅ Responsive: sections stack on mobile
✅ All content from database
✅ PageHero reused from Build 05
```
