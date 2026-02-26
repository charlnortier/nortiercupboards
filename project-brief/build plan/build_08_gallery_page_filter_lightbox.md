# Build 08 — Gallery Page + Filter + Lightbox

> **Type:** UI / Page  
> **Estimated Time:** 60–75 min  
> **Dependencies:** Build 04 (ProjectCard, projects data helper), Build 05 (PageHero)  
> **Context Files:** TECHNICAL_DESIGN.md §3.2 + §3.3, PROJECT_BRIEF.md §3.3

---

## Objective

Build the gallery page with room-type filtering, project grid, and full-screen lightbox with image carousel. This is the showcase — it needs to look premium and load fast.

---

## Tasks

### 1. Page Setup

**`src/app/(public)/gallery/page.tsx`**:
```typescript
import { Metadata } from 'next'
import { getAllProjects } from '@/lib/data/projects'

export const metadata: Metadata = {
  title: 'Our Work',
  description: 'Browse our portfolio of custom kitchen, bedroom, bathroom and study cupboards. Before & after transformations across the Cape Winelands.',
}

export const revalidate = 3600 // 1h — new projects show within an hour
```

### 2. Gallery Container

**`src/components/gallery/gallery-container.tsx`** — Client component (handles filter state):

```typescript
'use client'

import { useState } from 'react'
import { FilterBar } from './filter-bar'
import { ProjectGrid } from './project-grid'

interface GalleryContainerProps {
  projects: ProjectWithImages[]
}

const ROOM_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'kitchen', label: 'Kitchens' },
  { value: 'bedroom', label: 'Bedrooms' },
  { value: 'bathroom', label: 'Bathrooms' },
  { value: 'study', label: 'Studies' },
  { value: 'other', label: 'Other' },
]

export function GalleryContainer({ projects }: GalleryContainerProps) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.room_type === activeFilter)

  return (
    <>
      <FilterBar
        filters={ROOM_TYPES}
        active={activeFilter}
        onChange={setActiveFilter}
        counts={/* count per type */}
      />
      <ProjectGrid projects={filtered} />
    </>
  )
}
```

### 3. Filter Bar

**`src/components/gallery/filter-bar.tsx`**:

Design:
- Horizontal row of pill buttons, centred
- Sticky below nav on scroll (optional — `sticky top-16 z-30 bg-white/95 backdrop-blur`)
- Each pill:
  - Inactive: `bg-brand-parchment text-brand-slate border border-brand-sandstone`
  - Active: `bg-brand-camel text-brand-navy font-semibold`
  - Hover: `hover:bg-brand-camel/20`
- Count badge on each (optional): "(12)" in smaller text
- Mobile: horizontal scroll with `overflow-x-auto`, no wrapping
  - `flex gap-2 overflow-x-auto pb-2 scrollbar-hide`

### 4. Project Grid

**`src/components/gallery/project-grid.tsx`**:

Design:
- Uniform grid (not masonry — simpler, consistent):
  - Desktop: 3 columns
  - Tablet: 2 columns
  - Mobile: 1 column
  - `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- Each card: reuse `<ProjectCard />` from Build 04
- Animate filter transitions:
  - Cards that don't match fade out, matching cards fade in
  - Use CSS transitions or simple `opacity` + `transition-all duration-300`
  - Alternatively: `layout` animation with `key={project.id}`
- Empty state (if filter has 0 results):
  - "No projects in this category yet." + "View all" link to reset filter
- Minimum 16px padding on container sides

### 5. Lightbox Component

**`src/components/gallery/lightbox.tsx`** — Client component (dynamic import):

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface LightboxProps {
  images: { image_url: string; alt_text?: string; image_type: string }[]
  initialIndex?: number
  projectTitle: string
  roomType: string
  onClose: () => void
}
```

Design:
- Full-screen overlay: `fixed inset-0 z-[60] bg-black/95`
- Above WhatsApp FAB (z-50)
- **Image:** centred, `max-h-[85vh] max-w-[90vw] object-contain`
- **Navigation arrows:**
  - Left/right: `absolute top-1/2 -translate-y-1/2` large circle buttons
  - `bg-white/10 hover:bg-white/20 text-white`
  - Hidden if only 1 image
- **Close button:** top-right `X` icon, `bg-white/10 hover:bg-white/20 rounded-full p-2`
- **Counter:** bottom-centre: "3 / 7" — `text-white/60 text-sm`
- **Project info:** bottom-left: title + room type badge
- **Keyboard:** ← → for nav, Escape to close
- **Touch:** swipe left/right on mobile (basic touch event handling)
- **Click backdrop** to close (but not on image or controls)
- **Preload:** adjacent images (`<link rel="preload">` or Next.js Image priority)
- **Body scroll lock:** prevent background scrolling when lightbox is open

Dynamic import in gallery page:
```typescript
const Lightbox = dynamic(() => import('@/components/gallery/lightbox'), { ssr: false })
```

### 6. Lightbox Integration

In `<ProjectGrid />` or `<GalleryContainer />`:

```typescript
const [lightboxProject, setLightboxProject] = useState<ProjectWithImages | null>(null)
const [lightboxIndex, setLightboxIndex] = useState(0)

// ProjectCard onClick:
const openLightbox = (project: ProjectWithImages, imageIndex = 0) => {
  setLightboxProject(project)
  setLightboxIndex(imageIndex)
}

// Render:
{lightboxProject && (
  <Lightbox
    images={lightboxProject.project_images}
    initialIndex={lightboxIndex}
    projectTitle={lightboxProject.title}
    roomType={lightboxProject.room_type}
    onClose={() => setLightboxProject(null)}
  />
)}
```

### 7. Before/After Detection

For projects that have both `before` and `after` images:
- Show "Before & After" badge on `<ProjectCard />`
- In lightbox: show before/after pair first, then remaining images

Badge logic (already in ProjectCard from Build 04):
```typescript
const hasBefore = images.some(i => i.image_type === 'before')
const hasAfter = images.some(i => i.image_type === 'after')
const hasBeforeAfter = hasBefore && hasAfter
```

### 8. Bottom CTA

Below the grid:
```typescript
<CtaBanner
  heading="Like what you see?"
  text="Let's design yours. Get a free, no-obligation quote."
  ctaLabel="Get a Free Quote"
  ctaHref="/contact"
/>
```

### 9. Page Assembly

```typescript
export default async function GalleryPage() {
  const projects = await getAllProjects()

  return (
    <>
      <PageHero
        title="Our Work"
        subtitle="Before & after transformations across the Cape Winelands"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Gallery', href: '/gallery' }]}
      />
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <GalleryContainer projects={projects} />
        </div>
      </section>
      <CtaBanner
        heading="Like what you see?"
        text="Let's design yours. Get a free, no-obligation quote."
        ctaLabel="Get a Free Quote"
        ctaHref="/contact"
      />
    </>
  )
}
```

---

## Performance Notes

- All images via Next.js `<Image>` with `sizes` attribute
- Grid images: `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`
- Lightbox images: `sizes="90vw"` with `priority` on current + adjacent
- Lazy load grid images below fold
- Placeholder: blur or `bg-brand-sand` shimmer
- Lightbox: dynamic import (not in initial bundle)

---

## Acceptance Criteria

```
✅ Gallery page renders at /gallery with correct metadata
✅ All active projects from DB display in grid
✅ Filter bar shows room type pills
✅ Clicking a filter shows only matching projects (client-side)
✅ "All" filter shows everything
✅ Empty state message when filter has 0 results
✅ Clicking a project card opens lightbox
✅ Lightbox displays image carousel with arrows
✅ Lightbox keyboard navigation works (← → Escape)
✅ Lightbox touch swipe works on mobile
✅ Lightbox shows project title + room type + counter
✅ Lightbox close works (X button, backdrop click, Escape)
✅ Before/After badge shows on projects with both image types
✅ Bottom CTA links to /contact
✅ Filter bar scrolls horizontally on mobile
✅ Images load fast with Next.js optimization
✅ Responsive: 1/2/3 column grid
```
