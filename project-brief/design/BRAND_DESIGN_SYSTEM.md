# NORTIER CUPBOARDS — Brand Identity & Design System

> **Version:** 1.0  
> **Date:** 20 February 2026  
> **Status:** Ready for implementation

---

## 1. Competitive Landscape

### South African Custom Cupboard Market

- **Lovett Co** (Cape Town) — Modern minimal website, clean photography, "request a quote" flow. Good lifestyle imagery. Premium feel but generic template.
- **The Cutting Edge Carpenters** (Stellenbosch) — Direct competitor. "Custom carpentry in the Cape Winelands." Clean enough but basic WordPress. Before/after gallery. Lacks personality.
- **HPH Carpentry** (Cape Town) — Owner-run, personal brand. Portfolio-heavy. Dated design. Shows the range (decking, cupboards, roofing) but spread too thin visually.
- **JH Woodworks** (Cape Town) — Family business, est. 2006. Functional site, no visual flair. Southern Suburbs focus. "No job too big or small" — generic messaging.
- **Two Oceans Carpentry** (Cape Town) — Better copy, personal founder story (Juan Botha). Clean layout. Kitchens, vanities, wall units. Shows what "personality + craft" can look like.
- **Deckspertz** — Dark theme, outdoor focus. Shows that a darker palette can work for carpentry if done right.

### What's Missing

Most SA custom cupboard sites look like WordPress templates with a contact form. They all use the same stock-photo-driven, white-background, grey-text approach. Nobody owns a distinctive visual identity. The opportunity is to create a site that looks like the owner actually cares about design — which Charl does, because he's been doing this for 20+ years and uses ArtiCAD to design 3D renders for clients.

### Nortier's Position

**"The craftsman you trust with your home."** Not the cheapest, not the most corporate. A seasoned professional with 20 years of proof. The site should feel like walking into a well-organised workshop — confident, warm, capable. Not a factory. Not a startup.

---

## 2. Brand Personality

### Voice
- Experienced and confident — 20+ years speaks for itself
- Straightforward — no fluff, no buzzwords
- Warm but professional — these are people's homes
- Afrikaans-rooted without being exclusionary — Paarl, Winelands context
- Quality-first — "we'd rather do it right than do it fast"

### Key Messages
1. "Quality, experience and professional service" (existing tagline — keep it)
2. Design to installation — we handle everything
3. ArtiCAD 3D design — you see it before we build
4. No job too big or too small — R30k to R300k
5. 20+ years and counting

### Tone Examples
- ✅ "We'll visit your home, measure up, and show you a 3D design before we build a single cupboard."
- ✅ "From a single bathroom vanity to a full kitchen renovation — we've done it all."
- ❌ "We leverage cutting-edge design technology to deliver bespoke solutions."
- ❌ "Your dream kitchen awaits! Click here NOW for your FREE quote!!!"

---

## 3. Design Concept: "The Craftsman's Workshop"

### The Inspiration

Charl's personal style — navy blue jeans and camel-coloured shirts — is the starting point. This is a man who shows up neat, professional, and consistent. Not flashy, not trendy. Dependable. That outfit translates directly into the colour palette: **royal navy as the authority colour, camel/sand as the warmth.**

The combination of navy + camel is classic menswear — think well-made work boots, quality leather aprons, brass hardware on solid wood. It signals craftsmanship, tradition, and quiet confidence. It's also distinctive in the SA cupboard market where everyone defaults to white + grey + one random accent colour.

### Design Principles

1. **Distinguished, not flashy** — Navy and camel is a palette that gets better with age. No gradients, no glows, no trendy effects.
2. **Let the work speak** — Large photography, minimal decoration. The cupboards are the stars.
3. **Warm authority** — Navy commands trust, camel adds warmth. Together they say "we know what we're doing and we're easy to work with."
4. **Clean and direct** — No clutter. Clear hierarchy. Easy to scan. This is a tradesman's site, not a design agency portfolio.
5. **Built to last** — Like the cupboards. No design trends that will date in 6 months.

---

## 4. Colour Palette

### Primary Palette

| Role | Name | Hex | RGB | Usage |
|------|------|-----|-----|-------|
| **Brand Primary** | Royal Navy | `#1B2A4A` | 27, 42, 74 | Nav background, page hero backgrounds, headings, footer, dark sections |
| **Brand Secondary** | Camel | `#C4A265` | 196, 162, 101 | Logo accent, nav text/links, CTA buttons, highlights, accent borders |
| **Background** | Parchment | `#FAF7F2` | 250, 247, 242 | Primary page background — warm off-white |
| **Surface** | Cream | `#FFFFFF` | 255, 255, 255 | Cards, form inputs, elevated surfaces |
| **Text Primary** | Navy Dark | `#0F1D36` | 15, 29, 54 | Body text, headings on light backgrounds |
| **Text Secondary** | Slate | `#5C6B7A` | 92, 107, 122 | Descriptions, secondary text, labels |
| **Border** | Sandstone | `#E2DAD0` | 226, 218, 208 | Dividers, input borders, card borders |

### Accent & Functional

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| **CTA Primary** | Camel | `#C4A265` | Primary buttons, "Get a Quote", links on dark bg |
| **CTA Hover** | Dark Camel | `#A8893F` | Hover/pressed state for CTA buttons |
| **Navy Light** | Officer Blue | `#2A3F6B` | Lighter navy for hover states, secondary sections |
| **Navy Pale** | Fog | `#E8ECF3` | Light navy tint for alternating sections, highlights |
| **Success** | Forest | `#3D7A4A` | Form success, confirmations |
| **Error** | Brick | `#C44B3A` | Form errors, validation failures |
| **WhatsApp** | WA Green | `#25D366` | WhatsApp button (standard brand green) |

### How It Works Together

```
NAVIGATION BAR
┌─────────────────────────────────────────────┐
│  bg: Royal Navy (#1B2A4A)                   │
│  logo: Camel (#C4A265)                      │
│  links: White (#FFFFFF)                     │
│  active link: Camel underline               │
│  CTA pill: Camel bg, Navy text              │
└─────────────────────────────────────────────┘

PAGE HERO (About, Services, Gallery, Contact)
┌─────────────────────────────────────────────┐
│  bg: Royal Navy (#1B2A4A)                   │
│  heading: White                             │
│  subtitle: White/70                         │
│  breadcrumb: Camel                          │
└─────────────────────────────────────────────┘

HOMEPAGE HERO
┌─────────────────────────────────────────────┐
│  bg: Kitchen photo + Navy overlay (#1B2A4A) │
│  heading: White                             │
│  CTA primary: Camel bg, Navy text           │
│  CTA secondary: White outline               │
└─────────────────────────────────────────────┘

BODY SECTIONS (alternating)
┌─────────────────────────────────────────────┐
│  bg: Parchment (#FAF7F2) or White           │
│  heading: Navy Dark (#0F1D36)               │
│  body text: Navy Dark                       │
│  secondary text: Slate (#5C6B7A)            │
│  accent: Camel for icons, links, borders    │
└─────────────────────────────────────────────┘

TRUST STATS STRIP
┌─────────────────────────────────────────────┐
│  bg: Royal Navy (#1B2A4A)                   │
│  numbers: Camel (#C4A265)                   │
│  labels: White/70                           │
└─────────────────────────────────────────────┘

CTA BANNER
┌─────────────────────────────────────────────┐
│  bg: Camel (#C4A265)                        │
│  text: Navy Dark (#0F1D36)                  │
│  button: Royal Navy bg, White text          │
└─────────────────────────────────────────────┘

FOOTER
┌─────────────────────────────────────────────┐
│  bg: Navy Dark (#0F1D36)                    │
│  headings: Camel                            │
│  links: White/60 → White on hover           │
│  powered by: Slate                          │
└─────────────────────────────────────────────┘
```

### Dark Mode

Not required for this project. Nortier's audience is homeowners browsing on their phones — they expect a warm, inviting site. The navy sections already provide dark contrast without needing a full dark mode toggle. Skip for now; add later if requested.

---

## 5. Typography

### Font Selection

**Headings: Plus Jakarta Sans (ExtraBold 800)**
- Category: Geometric sans-serif
- Why: Strong, modern, highly legible. The geometric shapes echo precision woodworking — clean lines, measured proportions. At ExtraBold weight it commands attention without being decorative. Works well in navy on light backgrounds and in white on navy backgrounds.
- Weights used: 700 (Bold), 800 (ExtraBold)
- Use: H1, H2, H3, hero text, stat numbers, nav logo text

**Body: Inter (Regular 400, Medium 500)**
- Category: Humanist sans-serif
- Why: The most readable screen font available. Designed specifically for computer screens with open apertures and optimised letter-spacing. Disappears into the content — lets the message come through without the font getting in the way. Professional without being cold.
- Weights used: 400 (Regular), 500 (Medium), 600 (SemiBold)
- Use: Body text, descriptions, form labels, buttons, nav links

### Type Scale

| Element | Font | Weight | Size (desktop) | Size (mobile) | Colour |
|---------|------|--------|---------------|---------------|--------|
| H1 (hero) | Jakarta | 800 | 56px / 3.5rem | 36px / 2.25rem | White (on navy) or Navy Dark (on light) |
| H2 (section) | Jakarta | 700 | 36px / 2.25rem | 28px / 1.75rem | Navy Dark |
| H3 (card title) | Jakarta | 700 | 24px / 1.5rem | 20px / 1.25rem | Navy Dark |
| H4 (subsection) | Jakarta | 700 | 20px / 1.25rem | 18px / 1.125rem | Navy Dark |
| Body | Inter | 400 | 16px / 1rem | 16px / 1rem | Navy Dark |
| Body large | Inter | 400 | 18px / 1.125rem | 16px / 1rem | Navy Dark |
| Small / caption | Inter | 500 | 14px / 0.875rem | 13px / 0.8125rem | Slate |
| Badge | Inter | 600 | 12px / 0.75rem | 12px / 0.75rem | Various |
| Button | Inter | 600 | 16px / 1rem | 16px / 1rem | Per button style |
| Nav link | Inter | 500 | 15px / 0.9375rem | 16px / 1rem | White (on navy) |

### Line Heights
- Headings: 1.15 (tight — headings should feel compact and punchy)
- Body: 1.65 (comfortable reading)
- Small text: 1.4

---

## 6. Logo

### Logo Mark
N|C monogram — gold serif "N" and "C" separated by a vertical line, enclosed in a circle. Elegant, architectural feel. Reads well at small sizes.

**File:** `design/nc-logo-monogram.png`
**Colours:** Camel `#C4A265` on Royal Navy `#1B2A4A`

### Usage

**Nav (on navy background):**
- N|C monogram (32px) + "NORTIER CUPBOARDS" text
- Monogram: Camel `#C4A265`
- Text: White `#FFFFFF`, Plus Jakarta Sans 700, tracked `0.05em`

**On light background:**
- N|C monogram with navy circle + camel letters
- Text: Royal Navy `#1B2A4A`

**Favicon:**
- N|C monogram cropped to circle
- Generate: favicon.ico (32×32), apple-touch-icon.png (180×180)

**OG Image:**
- N|C monogram centred on navy `#1B2A4A` background, 1200×630px

**Admin sidebar:**
- N|C monogram small + "Admin" badge

---

## 7. Photography Direction

### What We Need

| Type | Priority | Notes |
|------|----------|-------|
| Completed kitchens (hero shots) | 🔴 Critical | Wide angle, good natural light, styled (kettle, fruit bowl, etc.) |
| Before/after pairs | 🔴 Critical | Same angle both shots — this is the money content |
| Bedroom built-ins | 🟡 Important | Open doors showing interiors, folded clothes, organised |
| Bathroom vanities | 🟡 Important | Clean, styled with towels/soap |
| Workshop / manufacturing | 🟢 Nice to have | Machines, boards, works in progress — builds trust |
| Charl / team | 🟢 Nice to have | On-site or in workshop, wearing the navy + camel outfit |

### Photo Style Guidelines
- **Natural light** preferred — kitchens and bedrooms look best in daylight
- **Warm tone** — consistent with the camel/warm palette, avoid clinical cool tones
- **Wide angle** for rooms — show the full installation, not just a close-up of a hinge
- **Straight-on** for before/after — same angle, same room, dramatically different result
- **Styled but real** — a coffee mug on the counter is good, obviously staged flowers are not
- **High resolution** — minimum 2000px wide for hero use, will be compressed to WebP

### What to Avoid
- Stock photography of any kind — every image should be Nortier's actual work
- Extreme wide-angle lens distortion (makes cupboards look warped)
- Messy job sites as "before" photos — before should show the old cupboards, not construction chaos
- Inconsistent lighting between before and after (makes the comparison less impactful)

---

## 8. Component Design Patterns

### Buttons

**Primary CTA:**
- Background: Camel `#C4A265`
- Text: Royal Navy `#1B2A4A`, Inter 600
- Border radius: `8px` (slightly rounded, not pill)
- Padding: `12px 24px` (desktop), `14px 20px` (mobile — larger tap target)
- Hover: Dark Camel `#A8893F`
- Focus: `ring-2 ring-offset-2 ring-Camel`

**Secondary:**
- Background: transparent
- Text: Royal Navy `#1B2A4A`
- Border: `2px solid #1B2A4A`
- Hover: `bg-Navy/5`

**On dark (navy) backgrounds:**
- Primary: Camel bg, Navy text (same as light)
- Secondary: White outline, White text
- Hover: `bg-white/10`

**WhatsApp CTA:**
- Background: `#25D366`
- Text: White
- Icon: WhatsApp logo SVG
- Hover: `#1FAD54`

### Cards

**Project card (gallery):**
- Background: White
- Border: none (shadow instead)
- Shadow: `shadow-sm` → `shadow-lg` on hover
- Border radius: `12px`
- Image: `aspect-[4/3] object-cover rounded-t-xl`
- Room type badge: Camel bg, Navy text, `text-xs font-semibold`, top-left overlay

**Service card (homepage/services):**
- Background: White
- Border: `1px solid Sandstone`
- Hover: left border becomes Camel `border-l-4 border-l-Camel`
- Border radius: `12px`
- Padding: `24px`

**Stat card (admin dashboard):**
- Background: White
- Shadow: `shadow-sm`
- Border radius: `12px`
- Number: Camel `text-3xl font-extrabold`

### Form Inputs

- Background: White
- Border: `1px solid Sandstone (#E2DAD0)`
- Focus: `border-Camel ring-1 ring-Camel/30`
- Border radius: `8px`
- Padding: `12px 16px`
- Label: Slate, Inter 500, `text-sm`, above input
- Error: Brick red border + error text below
- Placeholder: `text-Slate/50`

### Badges

| Type | Background | Text |
|------|-----------|------|
| Room type | `bg-Camel/15` | `text-Camel` (on light) |
| Room type (on image) | `bg-Camel/90` | `text-Navy` |
| Before/After | `bg-white/90` | `text-Navy` |
| Status: new | `bg-Camel/20` | `text-Camel-dark` |
| Status: read | `bg-Fog` | `text-Officer-Blue` |
| Status: contacted | `bg-green-100` | `text-green-700` |
| Status: closed | `bg-gray-100` | `text-gray-500` |

---

## 9. Spacing & Layout

### Container
- Max width: `1280px` (`max-w-7xl`)
- Padding: `16px` mobile, `24px` tablet, `32px` desktop

### Section Spacing
- Between major sections: `64px` mobile (`py-16`), `96px` desktop (`py-24`)
- Between heading and content: `32px` (`mb-8`)
- Between cards in grid: `24px` (`gap-6`)

### Grid
- Services: 3-col desktop, 2-col tablet, 1-col mobile
- Gallery: 3-col desktop, 2-col tablet, 1-col mobile
- Footer: 4-col desktop, 2-col tablet, 1-col mobile

---

## 10. Tailwind Configuration

```typescript
colors: {
  brand: {
    navy: '#1B2A4A',
    'navy-dark': '#0F1D36',
    'navy-light': '#2A3F6B',
    'navy-pale': '#E8ECF3',
    camel: '#C4A265',
    'camel-dark': '#A8893F',
    parchment: '#FAF7F2',
    sandstone: '#E2DAD0',
    slate: '#5C6B7A',
    success: '#3D7A4A',
    error: '#C44B3A',
    whatsapp: '#25D366',
  },
},
fontFamily: {
  display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
  body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
},
```

---

## 11. Mood & References

### The Feeling
Imagine a well-made leather-bound notebook. Navy cover, camel stitching, cream pages. You open it and the quality is obvious — not because it's decorated, but because every material and detail is considered. That's the Nortier site. No decoration for decoration's sake. Quality visible in the fundamentals: colour, type, spacing, photography.

### Visual References (mood, not copy)
- Gentlemen's outfitters (navy + camel colour blocking)
- Premium hardware store branding (Häfele, Blum)
- Cape Winelands estate websites (warm, confident, grounded)
- Well-designed restaurant menus (hierarchy, restraint, warmth)

### What It Should NOT Look Like
- A generic Wix/Squarespace cupboard template (white + grey + stock photos)
- An over-designed agency portfolio (we're selling cupboards, not design awards)
- A discount furniture store (no starbursts, no "SALE" banners, no red anywhere)
- A tech startup (no gradients, no neon, no glassmorphism)

---

## 12. Implementation Checklist

Before starting Build 01, update the Tailwind config with these exact values:

- [ ] Colours: all `brand.*` tokens as defined in §10
- [ ] Fonts: Plus Jakarta Sans (700, 800) + Inter (400, 500, 600) via `next/font`
- [ ] Update Build 01 scaffold Tailwind config to match this document
- [ ] Update Build 02 nav: navy background, camel logo, white links
- [ ] Update Build 02 footer: navy-dark background, camel headings
- [ ] Update Build 03 hero: navy overlay, white text, camel CTA
- [ ] Update Build 03 stats strip: navy background, camel numbers
- [ ] Update Build 03 CTA banner: camel background, navy text
- [ ] Replace all `bg-brand-charcoal` references in build docs with `bg-brand-navy`
- [ ] Replace all `text-brand-gold` references with `text-brand-camel`
