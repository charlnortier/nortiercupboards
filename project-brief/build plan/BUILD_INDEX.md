# NORTIER CUPBOARDS — Build Index

> **Total builds:** 14  
> **Estimated active build time:** 2–3 days  
> **Session length:** Each build = 1 focused coding session (30–90 min)  
> **Repo:** `nortier-cupboards` (from Yoros template)

---

## Phase 1: Foundation (Builds 01–04)

| Build | File | Focus | Time |
|-------|------|-------|------|
| 01 | `build_01_project_scaffold.md` | Next.js setup, Supabase project, migrations 001–003, folder structure, Tailwind brand tokens, middleware, env vars | 30–45 min |
| 02 | `build_02_layout_nav_footer_whatsapp.md` | Sticky nav (blur, mobile hamburger), footer (4-col from DB), floating WhatsApp FAB (pulse, wa.me) | 45–60 min |
| 03 | `build_03_homepage_hero_stats_cta.md` | Hero section, trust stats strip, trust strip text, CTA banner — all from DB | 45–60 min |
| 04 | `build_04_homepage_projects_services.md` | Featured projects grid, services grid (6 cards), complete homepage assembly | 45–60 min |

**Milestone:** Homepage complete, layout shell on every page, WhatsApp button live.

---

## Phase 2: Content Pages (Builds 05–07)

| Build | File | Focus | Time |
|-------|------|-------|------|
| 05 | `build_05_about_page.md` | Owner story, 4-step process, why choose us, service area | 30–45 min |
| 06 | `build_06_services_page.md` | 6 alternating service sections, feature pills, per-service CTAs | 30–45 min |
| 07 | `build_07_contact_page_form_api.md` | Contact form + validation, API route, Supabase insert, Resend email notification, Google Maps embed | 45–60 min |

**Milestone:** All 5 public pages built. Contact form saves leads + emails Charl.

---

## Phase 3: Gallery (Builds 08–09)

| Build | File | Focus | Time |
|-------|------|-------|------|
| 08 | `build_08_gallery_page_filter_lightbox.md` | Gallery grid, room-type filter pills, full-screen lightbox with carousel + keyboard/touch nav | 60–75 min |
| 09 | `build_09_before_after_gallery_polish.md` | Before/after drag slider, hover effects, loading skeletons, filter transitions, image optimization | 45–60 min |

**Milestone:** Gallery fully functional with filtering, lightbox, and before/after comparisons.

---

## Phase 4: Admin Panel (Builds 10–12)

| Build | File | Focus | Time |
|-------|------|-------|------|
| 10 | `build_10_admin_auth_layout_dashboard.md` | Login page, admin sidebar + topbar, dashboard with stats + recent leads | 45–60 min |
| 11 | `build_11_admin_projects_crud_images.md` | Projects list, create/edit forms, image upload (resize + WebP), before/after tagging, reorder, delete | 60–90 min |
| 12 | `build_12_admin_leads_content_settings.md` | Leads viewer (status, notes, filter), content editor (per-page tabs), settings form (contact, hours, maps) | 45–60 min |

**Milestone:** Admin panel complete. Charl can manage projects, view leads, edit content, update settings.

---

## Phase 5: Launch (Builds 13–14)

| Build | File | Focus | Time |
|-------|------|-------|------|
| 13 | `build_13_seo_performance_polish.md` | Sitemap, robots.txt, structured data, meta audit, Lighthouse >90, accessibility, responsive polish, 404/error pages | 45–60 min |
| 14 | `build_14_dns_go_live.md` | Vercel deploy, production testing, DNS migration, SSL, Google Search Console + GA4, client handoff | 30–45 min |

**Milestone:** 🚀 nortiercupboards.co.za live.

---

## Migrations

| File | Tables |
|------|--------|
| `migrations/001_core_tables.sql` | site_settings, nav_links, footer_links, site_content, services, projects, project_images, contact_submissions, trust_stats |
| `migrations/002_rls_policies.sql` | RLS on all tables + `is_admin()` helper, public read, admin full access, public insert on contact |
| `migrations/003_seed_data.sql` | Nav links, footer links, 6 services, 4 trust stats, homepage content, about content, 6 placeholder projects |

---

## Total Estimated Time

| Phase | Builds | Min | Max |
|-------|--------|-----|-----|
| Foundation | 4 | 2.5h | 3.5h |
| Content Pages | 3 | 1.5h | 2.5h |
| Gallery | 2 | 1.5h | 2.5h |
| Admin | 3 | 2.5h | 3.5h |
| Launch | 2 | 1.0h | 1.5h |
| **Total** | **14** | **9.0h** | **13.5h** |

---

## Dependencies / Blockers

| Blocker | Impact | Resolution |
|---------|--------|------------|
| Client photos not received | Gallery empty, hero placeholder | Launch with placeholders, add real photos via admin later |
| Logo not finalized | Nav + favicon placeholder | Use text-only logo until designed |
| WhatsApp number not confirmed | FAB links nowhere | Use placeholder, update in admin settings |
| DNS access not available | Can't go live on domain | Deploy to Vercel preview URL, migrate DNS when ready |
| Google Maps embed not set | Contact page missing map | Charl provides address, we generate embed |
