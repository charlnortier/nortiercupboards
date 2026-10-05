# NORTIER CUPBOARDS — Technical Design Document

> **Version:** 1.0  
> **Date:** 20 February 2026  
> **Companion to:** PROJECT_BRIEF.md (business requirements & page specs)  
> **Standards:** YOROS_UNIVERSAL_PROJECT_BRIEF.md + YOROS_I18N_DARKMODE_STANDARD.md

---

## 1. Architecture Overview

### 1.1 Project Type

Simple brochure site with portfolio gallery and lead capture. No calculator, no e-commerce, no client portal, no booking system. This is the leanest Yoros template deployment.

### 1.2 Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 14+ (App Router, TypeScript) | SSG for all pages |
| Styling | Tailwind CSS + shadcn/ui | Warm cupboard-craft theme |
| Database | Supabase (Postgres) | Projects, leads, site content |
| Storage | Supabase Storage | Project images (before/after) |
| Auth | Supabase Auth | Admin only — no public accounts |
| Hosting | Vercel | Git deploy from GitHub |
| Email | Resend + React Email | Contact form notifications |
| Analytics | GA4 + Search Console | Standard setup |
| Domain | nortiercupboards.co.za | Existing — DNS to Vercel |

### 1.3 Route Map

```
Public Routes
├── /                     → Homepage
├── /about                → About page
├── /services             → Services overview
├── /gallery              → Portfolio grid + lightbox
├── /gallery/[slug]       → Individual project detail (optional — can be lightbox only)
├── /contact              → Contact form + details + map
├── /sitemap.xml          → Auto-generated
├── /robots.txt           → Auto-generated
└── /api/
    └── /contact          → Form submission handler

Admin Routes (auth-protected)
├── /admin                → Dashboard — recent leads, quick stats
├── /admin/projects       → CRUD gallery projects
├── /admin/projects/new   → Add new project
├── /admin/projects/[id]  → Edit project + manage images
├── /admin/leads          → Contact form submissions
├── /admin/content        → Edit site text blocks
└── /admin/settings       → Business details, social links, WhatsApp number
```

---

## 2. Database Schema

### 2.1 Migration 001 — Core Tables

```sql
-- ============================================
-- NORTIER CUPBOARDS — Migration 001
-- Core tables: site content, projects, leads
-- ============================================

-- Site settings (single row — business details)
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL DEFAULT 'Nortier Cupboards',
  tagline TEXT DEFAULT 'Quality, experience and professional service',
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT DEFAULT 'Paarl',
  province TEXT DEFAULT 'Western Cape',
  postal_code TEXT,
  google_maps_embed TEXT,
  google_maps_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  business_hours JSONB DEFAULT '{
    "mon_fri": "07:30 – 17:00",
    "sat": "08:00 – 12:00 (by appointment)",
    "sun": "Closed"
  }'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Navigation links
CREATE TABLE nav_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_cta BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Footer links
CREATE TABLE footer_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  column_name TEXT NOT NULL,     -- 'services', 'company', 'contact'
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CMS content blocks (editable text for any page section)
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,             -- 'home', 'about', 'services', 'contact'
  section TEXT NOT NULL,          -- 'hero_title', 'hero_subtitle', 'intro_text', etc.
  content_type TEXT NOT NULL DEFAULT 'text',  -- 'text', 'rich_text', 'image_url'
  value TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page, section)
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,            -- 'Kitchen Cupboards'
  slug TEXT NOT NULL UNIQUE,      -- 'kitchen-cupboards'
  short_description TEXT,         -- one-liner for homepage cards
  full_description TEXT,          -- rich text for services page
  icon TEXT,                      -- emoji or icon name
  image_url TEXT,                 -- hero image for service
  features JSONB DEFAULT '[]',   -- ["Melamine finishes", "Soft-close hinges", ...]
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Projects (gallery)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,            -- 'Modern Kitchen — Stellenbosch'
  slug TEXT NOT NULL UNIQUE,
  room_type TEXT NOT NULL,        -- 'kitchen', 'bedroom', 'bathroom', 'study', 'other'
  description TEXT,               -- optional project description
  location TEXT,                  -- 'Paarl', 'Stellenbosch', etc.
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Project images (multiple per project, supports before/after)
CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL DEFAULT 'after',  -- 'before', 'after', 'progress'
  alt_text TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact form submissions (leads)
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  service_interest TEXT,          -- from dropdown: 'kitchens', 'bedrooms', etc.
  message TEXT,
  source TEXT DEFAULT 'website',  -- 'website', 'whatsapp', 'manual'
  status TEXT DEFAULT 'new',      -- 'new', 'read', 'contacted', 'quoted', 'closed'
  notes TEXT,                     -- admin notes
  created_at TIMESTAMPTZ DEFAULT now(),
  read_at TIMESTAMPTZ
);

-- Trust stats (homepage counters)
CREATE TABLE trust_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,            -- '20+ Years'
  value TEXT NOT NULL,            -- '20+'
  suffix TEXT,                    -- 'Years', 'Kitchens', etc.
  icon TEXT,                      -- emoji or icon
  sort_order INT DEFAULT 0
);
```

### 2.2 Migration 002 — RLS Policies

```sql
-- ============================================
-- NORTIER CUPBOARDS — Migration 002
-- Row Level Security policies
-- ============================================

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_stats ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ — site content, services, projects, nav, footer, stats
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read nav_links" ON nav_links FOR SELECT USING (is_active = true);
CREATE POLICY "Public read footer_links" ON footer_links FOR SELECT USING (is_active = true);
CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (is_active = true);
CREATE POLICY "Public read project_images" ON project_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE id = project_images.project_id AND is_active = true)
);
CREATE POLICY "Public read trust_stats" ON trust_stats FOR SELECT USING (true);

-- PUBLIC INSERT — contact form only
CREATE POLICY "Public insert contact" ON contact_submissions FOR INSERT WITH CHECK (true);

-- ADMIN FULL ACCESS — all tables
CREATE POLICY "Admin all site_settings" ON site_settings FOR ALL USING (is_admin());
CREATE POLICY "Admin all nav_links" ON nav_links FOR ALL USING (is_admin());
CREATE POLICY "Admin all footer_links" ON footer_links FOR ALL USING (is_admin());
CREATE POLICY "Admin all site_content" ON site_content FOR ALL USING (is_admin());
CREATE POLICY "Admin all services" ON services FOR ALL USING (is_admin());
CREATE POLICY "Admin all projects" ON projects FOR ALL USING (is_admin());
CREATE POLICY "Admin all project_images" ON project_images FOR ALL USING (is_admin());
CREATE POLICY "Admin all contact_submissions" ON contact_submissions FOR ALL USING (is_admin());
CREATE POLICY "Admin all trust_stats" ON trust_stats FOR ALL USING (is_admin());
```

### 2.3 Migration 003 — Seed Data

```sql
-- ============================================
-- NORTIER CUPBOARDS — Migration 003
-- Seed data
-- ============================================

-- Nav links
INSERT INTO nav_links (label, href, sort_order, is_cta) VALUES
  ('Home', '/', 0, false),
  ('About', '/about', 1, false),
  ('Services', '/services', 2, false),
  ('Gallery', '/gallery', 3, false),
  ('Contact', '/contact', 4, false),
  ('Get a Quote', '/contact', 5, true);

-- Services
INSERT INTO services (title, slug, short_description, icon, sort_order, features) VALUES
  ('Kitchen Cupboards', 'kitchen-cupboards',
   'Custom kitchens designed, built, and installed — from melamine to hand-painted finishes.',
   '🍳', 0,
   '["Melamine, wrap, spray & hand-painted finishes", "Soft-close hinges & drawer systems", "Countertop coordination", "ArtiCAD 3D design included"]'::jsonb),

  ('Bedroom Cupboards', 'bedroom-cupboards',
   'Built-in wardrobes and walk-in closets tailored to your space.',
   '🛏️', 1,
   '["Sliding & hinged door options", "Custom interiors — shelves, drawers, rails", "Walk-in closet design", "Full range of finishes"]'::jsonb),

  ('Bathroom Vanities', 'bathroom-vanities',
   'Wall-hung and freestanding vanities in moisture-resistant materials.',
   '🚿', 2,
   '["Wall-hung & freestanding options", "Moisture-resistant materials", "Mirror cabinets", "Custom sizing"]'::jsonb),

  ('Study & Office', 'study-office',
   'Built-in desks, bookshelves, and storage for productive workspaces.',
   '📚', 3,
   '["Built-in desks & bookshelves", "Cable management solutions", "Custom storage", "Home office design"]'::jsonb),

  ('Loose Furniture', 'loose-furniture',
   'Freestanding units you take with you when you move.',
   '🪑', 4,
   '["TV units & sideboards", "Display cabinets", "Custom freestanding pieces", "Portable — take it when you move"]'::jsonb),

  ('Security Shutters & Blinds', 'shutters-blinds',
   'Aluminium, basswood, plaswood, and bamboo — measured, supplied, and installed.',
   '🪟', 5,
   '["Aluminium venetian blinds", "Basswood & plaswood options", "Bamboo blinds", "Security shutters", "Motorised options", "Measure + supply + install"]'::jsonb);

-- Trust stats
INSERT INTO trust_stats (label, value, suffix, icon, sort_order) VALUES
  ('Experience', '20+', 'Years', '🏗️', 0),
  ('Kitchens Built', '500+', 'Projects', '🍳', 1),
  ('Based In', 'Paarl', 'Western Cape', '📍', 2),
  ('Quotes', 'Free', 'Always', '✓', 3);

-- Homepage content
INSERT INTO site_content (page, section, value) VALUES
  ('home', 'hero_title', 'Custom Cupboards. Built to Last.'),
  ('home', 'hero_subtitle', '20+ years of quality craftsmanship in the Cape Winelands'),
  ('home', 'hero_cta_primary', 'Get a Free Quote'),
  ('home', 'hero_cta_secondary', 'View Our Work'),
  ('home', 'intro_text', 'Nortier Cupboards has been designing, manufacturing, and installing custom cupboards for over 20 years. Based in Paarl, we serve the Cape Winelands and broader Western Cape with kitchens, bedrooms, bathrooms, and studies — from affordable melamine to hand-painted high-gloss finishes.'),
  ('home', 'trust_strip', '20+ Years Experience · Free Quotes · Design to Installation · Paarl & Surrounds'),
  ('home', 'cta_heading', 'Ready to transform your kitchen?'),
  ('home', 'cta_text', 'Get a free, no-obligation quote. We''ll visit, measure, and design your dream cupboards.'),
  ('about', 'story', 'With over 20 years of experience in the trade, Nortier Cupboards has built a reputation for quality, reliability, and professional service. Based in Paarl, we design, manufacture, and install custom cupboards for homes across the Cape Winelands and Western Cape. No job is too big or too small — from a single bathroom vanity to a full house of built-in cupboards. We use ArtiCAD design software to give you a 3D preview of your cupboards before we build, so you know exactly what you''re getting.'),
  ('about', 'process_step1', 'Consultation — we visit your home, measure, and discuss your vision.'),
  ('about', 'process_step2', 'Design — 3D ArtiCAD renders so you see it before we build.'),
  ('about', 'process_step3', 'Manufacture — built locally in our Paarl workshop.'),
  ('about', 'process_step4', 'Installation — professional fitting with minimal disruption.'),
  ('contact', 'form_success', 'Thanks for getting in touch! We''ll get back to you within 24 hours.');
```

---

## 3. Page Components & Data Flow

### 3.1 Homepage (`/`)

**Rendering:** SSG (static generation at build time, ISR revalidate every 60 minutes)

**Data fetched (server component):**
```typescript
// All fetched at build time via Supabase server client
const settings = await getSettings()
const heroContent = await getContent('home', ['hero_title', 'hero_subtitle', ...])
const featuredProjects = await getProjects({ featured: true, limit: 4 })
const services = await getServices({ active: true })
const trustStats = await getTrustStats()
```

**Sections → Components:**

| Section | Component | Data source |
|---------|-----------|-------------|
| Hero | `<Hero />` | site_content (hero_*), site_settings (whatsapp) |
| Stats | `<TrustStats />` | trust_stats |
| Featured Work | `<FeaturedProjects />` | projects (featured) + project_images |
| Services | `<ServicesGrid />` | services |
| Trust Strip | `<TrustStrip />` | site_content (trust_strip) |
| CTA Banner | `<CtaBanner />` | site_content (cta_*), site_settings (whatsapp) |

### 3.2 Gallery (`/gallery`)

**Rendering:** SSG with ISR (revalidate on new project publish)

**Data fetched:**
```typescript
const projects = await getProjects({ active: true, withImages: true })
const roomTypes = ['all', 'kitchen', 'bedroom', 'bathroom', 'study', 'other']
```

**Key components:**

| Component | Functionality |
|-----------|---------------|
| `<FilterBar />` | Room type filter pills — client-side filter (no reload) |
| `<ProjectGrid />` | Masonry or uniform grid of project cards |
| `<ProjectCard />` | Image, title, room type badge, location |
| `<Lightbox />` | Full-screen image carousel on click |
| `<BeforeAfter />` | Slider component for before/after pairs |

**Before/After slider logic:**
```typescript
// For each project, check if both 'before' and 'after' images exist
const hasBefore = images.some(i => i.image_type === 'before')
const hasAfter = images.some(i => i.image_type === 'after')

// If both exist → render <BeforeAfterSlider />
// If only after → render standard <ImageCarousel />
```

### 3.3 Contact (`/contact`)

**Rendering:** SSG (form is client component)

**Form submission flow:**
```
User fills form
  → Client-side validation (name required, email or phone required)
  → POST /api/contact
  → Server: validate + sanitize
  → Insert into contact_submissions (via Supabase admin client)
  → Send email notification to Charl (via Resend)
  → Return success
  → Client: show success toast + reset form
```

**API route: `/api/contact/route.ts`**
```typescript
export async function POST(req: Request) {
  const body = await req.json()

  // Validate
  if (!body.name) return error('Name is required')
  if (!body.email && !body.phone) return error('Email or phone is required')

  // Sanitize & insert
  const { error } = await supabaseAdmin
    .from('contact_submissions')
    .insert({
      name: sanitize(body.name),
      email: sanitize(body.email),
      phone: sanitize(body.phone),
      service_interest: body.service_interest,
      message: sanitize(body.message),
    })

  if (error) return serverError()

  // Email notification
  await resend.emails.send({
    from: 'Nortier Website <noreply@nortiercupboards.co.za>',
    to: settings.email,
    subject: `New Quote Request from ${body.name}`,
    react: ContactNotificationEmail({ ...body }),
  })

  return success()
}
```

### 3.4 Services (`/services`)

**Rendering:** SSG

**Data:** `services` table (all active, ordered by sort_order)

Each service renders as a full-width section with: image, title, description, feature list, and "Get a Quote" CTA linking to `/contact?service={slug}`.

### 3.5 About (`/about`)

**Rendering:** SSG

**Data:** `site_content` (about page blocks)

Static layout with process steps, trust signals, and service area.

---

## 4. Global Components

### 4.1 Navigation

```typescript
// Fetched from nav_links table
<Nav>
  <Logo />                    // Nortier Cupboards logo
  <NavLinks />                // Home, About, Services, Gallery, Contact
  <WhatsAppButton />          // Green pill: "WhatsApp Us" (desktop)
  <MobileMenu />              // Hamburger → slide-out drawer
</Nav>
```

- Sticky, blur backdrop
- Mobile: hamburger → slide-out with all links + WhatsApp CTA
- Active page indicator (underline or bold)

### 4.2 Floating WhatsApp Button

```typescript
<WhatsAppFab
  phone={settings.whatsapp}        // from site_settings
  message="Hi Nortier Cupboards, I'm interested in getting a quote."
  position="bottom-right"
  showLabel={isDesktop}             // pill on desktop, icon-only on mobile
  pulseOnLoad={true}                // single pulse animation on first visit
/>
```

- Fixed position, bottom-right, z-index above everything except modals
- 56px circle on mobile, pill with text on desktop
- WhatsApp green `#25D366`
- Click → opens `wa.me` link with pre-filled message
- Never overlaps contact form submit button (add bottom offset on `/contact`)

### 4.3 Footer

```typescript
<Footer>
  <FooterBrand />             // Logo + tagline + short description
  <FooterColumns>             // From footer_links table, grouped by column_name
    <Column title="Services" />
    <Column title="Company" />
    <Column title="Contact" />  // Phone, email, WhatsApp, address
  </FooterColumns>
  <FooterBottom>
    <Copyright />              // © 2026 Nortier Cupboards
    <PoweredBy />              // "Powered by Yoros"
  </FooterBottom>
</Footer>
```

---

## 5. Admin Panel

### 5.1 Overview

Minimal admin — Charl needs to:
1. Add new gallery projects (upload images, tag room type)
2. View contact form leads (mark as read/contacted)
3. Edit basic site text (homepage headlines, about page text)
4. Update business details (phone, email, hours)

**No complex features.** No analytics dashboard, no blog management, no user management.

### 5.2 Admin Routes

| Route | Purpose | Key actions |
|-------|---------|-------------|
| `/admin` | Dashboard | Recent leads count, total projects, quick links |
| `/admin/projects` | Project list | Table with thumbnail, title, type, featured toggle, reorder |
| `/admin/projects/new` | Add project | Title, room type, description, location, image upload (multi) |
| `/admin/projects/[id]` | Edit project | Edit fields + manage images (add, remove, reorder, tag before/after) |
| `/admin/leads` | Contact leads | Table: name, date, service, status. Click to expand details. Mark as read/contacted |
| `/admin/content` | Edit site text | Page → section → editable text field. Save button per field |
| `/admin/settings` | Business details | Phone, email, WhatsApp, address, hours, social links |

### 5.3 Image Upload Flow

```
Admin selects images
  → Client-side resize to max 2000px width (preserve aspect ratio)
  → Upload to Supabase Storage bucket: 'project-images'
  → Path: projects/{project_id}/{uuid}.webp
  → On upload success: insert into project_images table
  → Generate thumbnail (400px) for grid display
  → Admin can drag to reorder, tag as before/after, delete
```

**Storage bucket config:**
- Bucket: `project-images`
- Public: Yes (images served directly)
- Max file size: 5MB
- Allowed types: image/jpeg, image/png, image/webp
- Transform on upload: convert to WebP, max 2000px width

---

## 6. SEO Implementation

### 6.1 Meta Tags (per page)

```typescript
// app/layout.tsx — default metadata
export const metadata: Metadata = {
  title: {
    template: '%s | Nortier Cupboards',
    default: 'Nortier Cupboards | Custom Cupboards in Paarl, Western Cape',
  },
  description: 'Custom kitchen, bedroom, bathroom & study cupboards. 20+ years experience. Design, manufacture & installation in Paarl and the Cape Winelands.',
}
```

| Page | Title | Target keywords |
|------|-------|----------------|
| Home | Nortier Cupboards \| Custom Cupboards in Paarl | cupboards paarl, custom kitchens western cape |
| About | About Us \| Nortier Cupboards | cupboard installer paarl, kitchen manufacturer |
| Services | Our Services \| Nortier Cupboards | built-in cupboards, bedroom cupboards cape winelands |
| Gallery | Our Work \| Nortier Cupboards | kitchen cupboards gallery, before after cupboards |
| Contact | Contact Us \| Nortier Cupboards | cupboard quote paarl, kitchen quote stellenbosch |

### 6.2 Structured Data

```jsonld
// Homepage — LocalBusiness
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Nortier Cupboards",
  "description": "Custom cupboard design, manufacture and installation",
  "address": { "@type": "PostalAddress", "addressLocality": "Paarl", "addressRegion": "Western Cape" },
  "telephone": "+27...",
  "url": "https://nortiercupboards.co.za",
  "priceRange": "$$",
  "areaServed": ["Paarl", "Stellenbosch", "Franschhoek", "Wellington", "Somerset West"]
}

// Services page — Service schema per service
// Gallery — ImageGallery schema
```

### 6.3 Technical SEO

- Sitemap: auto-generated (`app/sitemap.ts`)
- robots.txt: allow public, disallow `/admin/*`, `/api/*`
- Canonical URLs on all pages
- Next.js `<Image>` for all images (WebP/AVIF, lazy loading, blur placeholders)
- No client-side routing for SEO pages — all SSG

---

## 7. Performance

### 7.1 Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 90 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| TTFB | < 800ms |
| Image format | WebP via Next.js Image |

### 7.2 Implementation

- All public pages statically generated
- ISR revalidation: 3600s (1 hour) for gallery, 86400s (24h) for other pages
- Images: Next.js `<Image>` with automatic optimization
- Fonts: self-hosted via `next/font` (no layout shift)
- Minimal JS — gallery filter is the only interactive client component
- Lightbox: dynamic import (only loaded when needed)
- WhatsApp button: lightweight, no library dependency

---

## 8. Email Templates

### 8.1 Contact Form Notification

Sent to Charl when someone submits the contact form.

```
Subject: New Quote Request from {name}

---
NEW ENQUIRY — Nortier Cupboards Website

Name: {name}
Phone: {phone}
Email: {email}
Interested in: {service_interest}

Message:
{message}

---
Received: {date} at {time}
Reply directly to this email or call {phone}

View all leads: https://nortiercupboards.co.za/admin/leads
```

### 8.2 Auto-reply to Customer (optional)

```
Subject: Thanks for contacting Nortier Cupboards

Hi {name},

Thanks for getting in touch! We've received your enquiry and will get back to you within 24 hours.

In the meantime, you can browse our recent work at nortiercupboards.co.za/gallery.

Best regards,
The Nortier Cupboards Team
```

---

## 9. Supabase Storage Configuration

### 9.1 Buckets

| Bucket | Public | Purpose |
|--------|--------|---------|
| `project-images` | Yes | Gallery photos (before/after) |
| `site-assets` | Yes | Logo, hero images, service images |

### 9.2 Storage Policies

```sql
-- Public read for both buckets
CREATE POLICY "Public read project-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "Public read site-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

-- Admin upload/delete
CREATE POLICY "Admin manage project-images"
  ON storage.objects FOR ALL
  USING (bucket_id = 'project-images' AND is_admin());

CREATE POLICY "Admin manage site-assets"
  ON storage.objects FOR ALL
  USING (bucket_id = 'site-assets' AND is_admin());
```

---

## 10. Deployment & DNS

### 10.1 Vercel Setup

- GitHub repo: `nortier-cupboards` (from Yoros template)
- Production branch: `main`
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `NEXT_PUBLIC_GA_ID`

### 10.2 DNS Migration

```
Current: nortiercupboards.co.za → broken WordPress host
Target:  nortiercupboards.co.za → Vercel

Required DNS changes:
  A     @     76.76.21.21         (Vercel)
  CNAME www   cname.vercel-dns.com (Vercel)
```

Client action required: update DNS at their domain registrar or give us access.

---

## 11. Development Phases

### Phase 1: Foundation (Builds 01–04)
- Project setup from Yoros template
- Supabase project + migrations 001–003
- Layout (nav, footer, WhatsApp button)
- Homepage with all sections

### Phase 2: Content Pages (Builds 05–08)
- About page
- Services page
- Contact page with form + API route + email notification

### Phase 3: Gallery (Builds 09–12)
- Gallery page with filter bar
- Lightbox component
- Before/after slider component
- Project detail (if not lightbox-only)

### Phase 4: Admin (Builds 13–18)
- Admin auth + layout
- Projects CRUD + image upload
- Leads viewer
- Content editor
- Settings editor

### Phase 5: Polish & Launch (Builds 19–22)
- SEO (structured data, sitemap, meta)
- Performance audit
- Mobile testing
- DNS migration
- Go live

**Total estimated builds: 18–22**
