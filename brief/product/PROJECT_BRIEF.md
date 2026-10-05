# NORTIER CUPBOARDS — Project Brief

> **Client:** Nortier Cupboards  
> **Project:** Complete website rebuild (broken WordPress → Yoros template)  
> **Date:** 20 February 2026  
> **Build type:** Simple 5-page brochure site + portfolio gallery  
> **Pilot pricing:** Standard Yoros template build  
> **Domain:** nortiercupboards.co.za (existing)

---

## 1. Business Overview

**Nortier Cupboards** is a specialist cupboard design and installation business based in Paarl, Western Cape. With 20+ years in the trade, they build custom cupboards for kitchens, bedrooms, studies, and bathrooms — from affordable melamine through to hand-painted and high-gloss spray finishes.

**Tagline:** "Quality, experience and professional service"

**Services offered:**
- Custom kitchen cupboards (design + manufacture + install)
- Bedroom built-in cupboards & wardrobes
- Bathroom vanities & cupboards
- Study/office built-ins
- Loose-standing furniture units
- Security shutters
- Blinds (aluminium, basswood, plaswood, bamboo)

**Differentiators:**
- 20+ years experience — established, trusted, references available
- Uses ArtiCAD design software — clients see 3D renders before manufacturing
- Full range from R30k kitchens to R300k kitchens — no job too big or small
- Designs, manufactures, AND installs (not just one piece of the chain)
- Service area: Paarl, Stellenbosch, Cape Winelands, broader Western Cape

**Current web presence:**
- nortiercupboards.co.za — broken WordPress, 404 on most pages
- Homeimprovement4U listing (active, has old copy)
- Snupit profile
- Pinterest account (dormant)

---

## 2. Project Scope

### What we're building
A clean, modern 5-page website that showcases Nortier's work and generates leads. No booking systems, no e-commerce, no client portal — just a professional online presence that makes the phone ring.

### Pages

| # | Page | URL | Purpose |
|---|------|-----|---------|
| 1 | Home | `/` | Hero + quick intro + featured projects + CTA |
| 2 | About | `/about` | Story, experience, process, trust signals |
| 3 | Gallery | `/gallery` | Portfolio grid with before/after showcase |
| 4 | Services | `/services` | What they offer + materials/finishes |
| 5 | Contact | `/contact` | Form + details + map + WhatsApp |

### Global elements
- Sticky nav with logo + 5 page links + WhatsApp button (green, always visible)
- Floating WhatsApp button (bottom-right, mobile + desktop)
- Footer with contact details, quick links, service area, Yoros credit
- Mobile responsive (phone-first — most leads come from mobile)
- SEO basics (meta tags, structured data, sitemap)

---

## 3. Page Specifications

### 3.1 Homepage (`/`)

**Goal:** Impress in 3 seconds, show the work, make it easy to get in touch.

1. **Hero section**
   - Full-width background image: completed kitchen (their best work)
   - Headline: "Custom Cupboards. Built to Last."
   - Subtitle: "20+ years of quality craftsmanship in the Cape Winelands"
   - Primary CTA: "Get a Free Quote" → `/contact`
   - Secondary CTA: "View Our Work" → `/gallery`
   - WhatsApp shortcut: "Or WhatsApp us now"

2. **Quick intro** (2-column)
   - Left: Short paragraph — who they are, what they do, why they're trusted
   - Right: 3-4 stat blocks (20+ years, 500+ kitchens, Paarl-based, Free quotes)

3. **Featured projects** (3-4 cards)
   - Best kitchen/bedroom/bathroom projects
   - Large image, project type label, "View Project" link → gallery
   - Before/after toggle on hover (optional — depends on photo availability)

4. **Services snapshot**
   - Icon + title + one-liner for each service
   - Kitchens, Bedrooms, Bathrooms, Studies, Loose Units, Shutters & Blinds
   - "See All Services" → `/services`

5. **Trust strip**
   - "20+ Years Experience · Free Quotes · Design to Installation · Paarl & Surrounds"

6. **CTA banner**
   - "Ready to transform your kitchen?" + "Get a Free Quote" + WhatsApp alternative

### 3.2 About (`/about`)

**Goal:** Build trust. Show the person behind the business.

1. **Owner/team intro**
   - Photo of Charl (if available) or workshop
   - Brief story: 20+ years, started in Paarl, family business, passion for quality
   - "No job too big or too small"

2. **Our process**
   - Step 1: Consultation — we visit, measure, discuss your vision
   - Step 2: Design — 3D ArtiCAD renders so you see it before we build
   - Step 3: Manufacture — built locally in our Paarl workshop
   - Step 4: Installation — professional fitting with minimal disruption

3. **Why choose us**
   - 20+ years in the trade
   - ArtiCAD 3D design software
   - Full service: design → manufacture → install
   - References available on request
   - From R30k to R300k — we work with your budget

4. **Service area**
   - Paarl, Stellenbosch, Franschhoek, Wellington, Somerset West, broader WC
   - Simple map or area list

### 3.3 Gallery (`/gallery`)

**Goal:** Let the work sell itself. Before/after is the money shot.

1. **Filter bar**
   - All | Kitchens | Bedrooms | Bathrooms | Studies | Other

2. **Project grid**
   - Masonry or uniform grid layout
   - Each card: main image, project type label, optional location
   - Click → lightbox with image carousel
   - Before/after slider component where photos are available

3. **CTA at bottom**
   - "Like what you see? Let's design yours." + quote button

**Admin requirements:**
- Upload project images via admin panel
- Tag by room type (kitchen, bedroom, bathroom, study, other)
- Optional: before image, after image, description, location
- Drag to reorder / set featured

### 3.4 Services (`/services`)

**Goal:** Show the full range so people know what to ask for.

1. **Kitchen Cupboards** (hero service — largest section)
   - Melamine, wrap, spray-painted, hand-painted finishes
   - Soft-close hinges, drawer systems
   - Countertop coordination
   - ArtiCAD 3D design included

2. **Bedroom Cupboards**
   - Built-in wardrobes, walk-ins
   - Sliding doors, hinged doors
   - Custom interiors (shelves, drawers, hanging rails)

3. **Bathroom Vanities**
   - Wall-hung and freestanding
   - Moisture-resistant materials
   - Mirror cabinets

4. **Study & Office**
   - Desks, bookshelves, built-in storage
   - Cable management

5. **Loose Furniture**
   - Freestanding units you take when you move
   - TV units, sideboards, display cabinets

6. **Security Shutters & Blinds**
   - Aluminium, basswood, plaswood, bamboo
   - Motorised options
   - Measure + supply + install

Each service: image, description, key features, "Get a Quote" CTA.

### 3.5 Contact (`/contact`)

**Goal:** Make it stupidly easy to reach them.

1. **Contact form**
   - Name, email, phone, service interest (dropdown), message
   - Submit → Supabase + email notification to Charl
   - Success: "Thanks! We'll get back to you within 24 hours."

2. **Direct contact details**
   - Phone number (click-to-call on mobile)
   - Email address
   - WhatsApp (click-to-chat with pre-filled message)
   - Physical address / workshop location in Paarl

3. **Google Maps embed**
   - Workshop/office pin

4. **Business hours**
   - Mon–Fri: 07:30–17:00
   - Sat: 08:00–12:00 (by appointment)
   - Sun: Closed

---

## 4. Floating WhatsApp Button

Present on every page, bottom-right corner.

- Green WhatsApp icon (branded green `#25D366`)
- On mobile: 56px circle, fixed bottom-right with 16px offset
- On desktop: 56px circle or pill with "WhatsApp Us" label
- Click opens: `https://wa.me/27XXXXXXXXXX?text=Hi%20Nortier%20Cupboards%2C%20I'm%20interested%20in%20getting%20a%20quote.`
- Subtle pulse animation on first load, then static
- Never overlaps other CTAs or nav elements

---

## 5. Design Direction

### Aesthetic
- Clean, modern, professional — NOT generic contractor site
- Let the photos do the talking — large images, minimal text
- Warm and inviting (these are people's homes)
- Trust and craftsmanship over flashy

### Colour palette (to be finalized)
- Primary: Warm charcoal / dark grey (professionalism)
- Accent: Wood-tone gold or warm amber (craftsmanship)
- Background: Clean white / very light warm grey
- Text: Dark grey, not pure black
- CTA: Strong warm accent (amber/gold or similar)
- WhatsApp: Standard WhatsApp green `#25D366`

### Typography
- Headings: Bold sans-serif (similar weight to Plus Jakarta Sans)
- Body: Clean readable sans-serif (Inter or similar)
- Keep it simple — 2 fonts max

### Photography
- Hero: Best completed kitchen (wide angle, good lighting)
- Gallery: Mix of completed projects, before/afters
- About: Workshop, team, manufacturing process
- Client needs to provide: high-res photos of completed projects, workshop, team
- **Before/after pairs are the highest priority content**

---

## 6. Technical Specification

### Stack
- Next.js (App Router) from Yoros template
- Supabase (database, storage for images, auth for admin)
- Vercel hosting
- Resend for form notification emails

### Database tables needed
- `projects` — id, title, room_type, description, location, featured, sort_order, created_at
- `project_images` — id, project_id, image_url, is_before, is_after, sort_order
- `contact_submissions` — id, name, email, phone, service_interest, message, created_at, read
- `site_content` — CMS blocks for editable text sections

### Admin panel
- **Projects:** CRUD for gallery items, image upload, drag-to-reorder, before/after tagging
- **Contact submissions:** View incoming leads, mark as read/contacted
- **Content:** Edit homepage text, about page text, service descriptions
- Simple, clean — Charl doesn't need complexity

### SEO
- Target keywords: "cupboards paarl", "kitchen cupboards western cape", "built-in cupboards paarl", "custom kitchens stellenbosch", "bedroom cupboards cape winelands"
- Meta tags per page
- Structured data: LocalBusiness, Service
- Google Business Profile integration (link from site)
- Sitemap + robots.txt

### Performance targets
- Lighthouse: >90 across all metrics
- Image optimization via Next.js `<Image>`
- Static generation for all pages (ISR for gallery if needed)

---

## 7. Content Requirements from Client

| Item | Priority | Status |
|------|----------|--------|
| 10–20 high-res project photos (completed work) | 🔴 Critical | Needed |
| 3–5 before/after photo pairs | 🔴 Critical | Needed |
| Owner/team photo | 🟡 Nice to have | Needed |
| Workshop/manufacturing photos | 🟡 Nice to have | Needed |
| Logo file (vector/high-res PNG) | 🔴 Critical | Has "20 Years" badge — needs clean logo |
| WhatsApp number | 🔴 Critical | Needed |
| Physical address | 🔴 Critical | Paarl — exact address needed |
| Email address | 🔴 Critical | Needed |
| Phone number | 🔴 Critical | Needed |
| About text / business story | 🟡 Can write from brief | Available from directory listings |
| Service descriptions | 🟡 Can write from brief | Available from directory listings |
| Google Business Profile URL | 🟡 Nice to have | Check if exists |
| Testimonials / references | 🟡 Nice to have | Homeimprovement4U has one |

---

## 8. Build Estimate

### Scope summary
- 5-page brochure site
- Gallery with before/after
- Contact form with email notifications
- WhatsApp integration
- Basic admin panel (projects + leads + content)
- Mobile responsive
- SEO fundamentals

### Estimated builds: 8–12
This is a straightforward Yoros template deployment. Most effort goes into gallery/image handling and making the design look premium with the client's photos.

### Timeline: 2–3 days active build time

---

## 9. Domain & Hosting

- **Domain:** nortiercupboards.co.za (client owns, needs DNS update to Vercel)
- **Hosting:** Vercel (free tier sufficient for this traffic level)
- **Email:** Keep existing or set up forwarding
- **SSL:** Automatic via Vercel

---

## 10. Post-Launch

- Train Charl on admin panel (add projects, view leads)
- Set up Google Search Console
- Submit sitemap
- Monitor form submissions
- Monthly: add new project photos as jobs complete
- Future: potential blog for SEO ("Kitchen trends 2026", "Melamine vs spray paint", etc.)
