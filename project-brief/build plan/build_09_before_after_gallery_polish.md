# Build 09 — Before/After Slider + Gallery Polish

> **Type:** UI / Component  
> **Estimated Time:** 45–60 min  
> **Dependencies:** Build 08 (gallery page + lightbox)  
> **Context Files:** TECHNICAL_DESIGN.md §3.2 (BeforeAfter), PROJECT_BRIEF.md §3.3

---

## Objective

Add the interactive before/after comparison slider for projects that have both image types, and polish the gallery with loading states, hover effects, and image optimization.

---

## Tasks

### 1. Before/After Slider Component

**`src/components/gallery/before-after-slider.tsx`** — Client component:

```typescript
'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeAlt?: string
  afterAlt?: string
}
```

Design:
- Container: `relative overflow-hidden rounded-xl aspect-4/3`
- **After image:** full width, z-0 (bottom layer)
- **Before image:** absolute positioned, z-10, clipped by slider position
  - `clip-path: inset(0 ${100 - sliderPosition}% 0 0)` or `width: ${sliderPosition}%` with overflow hidden
- **Divider line:** vertical line at slider position
  - `w-0.5 bg-white h-full absolute z-20`
  - Circular handle at centre: `w-10 h-10 rounded-full bg-white shadow-lg` with left/right arrows
- **Labels:**
  - "Before" — top-left of before image, `bg-black/60 text-white text-xs px-3 py-1 rounded-full`
  - "After" — top-right of after image, same style
- **Interaction:**
  - Mouse: `onMouseDown` on handle starts drag, `onMouseMove` updates position, `onMouseUp` stops
  - Touch: `onTouchStart`, `onTouchMove`, `onTouchEnd` — same logic
  - Position: percentage 0–100 of container width
  - Default start: 50% (half and half)
  - Smooth: no jank, use `requestAnimationFrame` or CSS transforms
  - Cursor: `cursor-col-resize` on handle and active drag

```typescript
const containerRef = useRef<HTMLDivElement>(null)
const [position, setPosition] = useState(50)
const [isDragging, setIsDragging] = useState(false)

const handleMove = useCallback((clientX: number) => {
  if (!containerRef.current) return
  const rect = containerRef.current.getBoundingClientRect()
  const x = clientX - rect.left
  const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
  setPosition(percent)
}, [])

const onMouseMove = useCallback((e: MouseEvent) => {
  if (isDragging) handleMove(e.clientX)
}, [isDragging, handleMove])

const onTouchMove = useCallback((e: TouchEvent) => {
  if (isDragging) handleMove(e.touches[0].clientX)
}, [isDragging, handleMove])
```

### 2. Integrate into Lightbox

When lightbox opens for a project with before + after images:
- First "slide" in carousel is the `<BeforeAfterSlider />` (not a static image)
- Remaining slides are standard images from the project
- Lightbox detects: if current slide is the before/after pair, render slider instead of `<Image />`

```typescript
// In lightbox image carousel:
const beforeImg = images.find(i => i.image_type === 'before')
const afterImg = images.find(i => i.image_type === 'after')
const hasComparison = beforeImg && afterImg
const otherImages = images.filter(i => i.image_type !== 'before')

// Carousel order: [BeforeAfterSlider, ...otherImages]
```

### 3. Before/After Card Preview

On the `<ProjectCard />` in the gallery grid, if the project has both before + after:
- Show a mini before/after preview on hover (optional — nice touch):
  - Default state: shows "after" image
  - Hover: crossfade to "before" image with `transition-opacity duration-500`
  - Or: split the card image 50/50 with a diagonal divider
- Keep it subtle — the main interaction is the lightbox slider

Simpler alternative: just show the "Before & After" badge (already from Build 04) and let the lightbox handle the comparison.

### 4. Loading States

**Image skeleton:**
```typescript
// Placeholder while images load
function ImageSkeleton() {
  return (
    <div className="animate-pulse bg-brand-sandstone rounded-xl aspect-[4/3]" />
  )
}
```

**Gallery grid skeleton** (shown during ISR revalidation or slow loads):
```typescript
function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <ImageSkeleton key={i} />
      ))}
    </div>
  )
}
```

### 5. Hover Effects Polish

**ProjectCard enhancements:**
- Default: `shadow-sm`
- Hover: `hover:shadow-xl hover:scale-[1.02] transition-all duration-300`
- Image: slight zoom on hover: `group-hover:scale-105 transition-transform duration-500`
  - Container has `overflow-hidden` to clip the zoom
- Room type badge: always visible (not just on hover)
- Before/After badge: subtle glow or border on hover

### 6. Filter Transition Animation

When switching filters:
- Cards that are removed: fade out (`opacity-0 scale-95`)
- Cards that appear: fade in (`opacity-100 scale-100`)
- Use CSS transition on each card with staggered delay:
```typescript
style={{ transitionDelay: `${index * 50}ms` }}
className={cn(
  'transition-all duration-300',
  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
)}
```

### 7. Image Optimization Check

Verify across all gallery components:
- [ ] All `<Image>` components have `sizes` prop set correctly
- [ ] Grid images: `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`
- [ ] Lightbox images: `sizes="90vw"`
- [ ] Before/after slider images: `sizes="(max-width: 768px) 100vw, 50vw"`
- [ ] All images have `alt` text (from `alt_text` or fallback to project title)
- [ ] Blur placeholder enabled (or `bg-brand-sand` colour placeholder)
- [ ] Lazy loading on grid images below fold (Next.js default)
- [ ] Priority loading on first 3 grid images and lightbox current image

### 8. Responsive Polish

- [ ] Gallery grid: 1 col → 2 col → 3 col breakpoints work cleanly
- [ ] Filter bar: horizontal scroll on mobile, no wrapping, scrollbar hidden
- [ ] Lightbox: full-screen on mobile, arrows at screen edges, swipe works
- [ ] Before/after slider: touch drag works smoothly on iOS + Android
- [ ] Project cards: consistent aspect ratio at all screen sizes

---

## Acceptance Criteria

```
✅ Before/after slider renders with draggable divider
✅ Slider works with mouse drag (desktop)
✅ Slider works with touch drag (mobile)
✅ "Before" and "After" labels visible on slider
✅ Slider defaults to 50% position
✅ Slider integrates into lightbox as first carousel item
✅ Projects with before+after images show badge on card
✅ Loading skeletons display while images load
✅ Hover effects on project cards (shadow + slight scale + image zoom)
✅ Filter transitions animate smoothly
✅ All images use Next.js Image with correct sizes
✅ No layout shift (CLS < 0.1) on gallery page
✅ Gallery looks polished and premium with placeholder content
```
