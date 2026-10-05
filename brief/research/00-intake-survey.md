# Intake survey — raw dump (2026-10-05)

> **consult.** The Phase 1 adoption survey, verbatim from four read-only agent runs at commit `4515532`.
> `brief/EVIDENCE.md` carries what the rest of the brief cites; this file is the working behind it.
> Observations, not decisions: nothing here binds until it is in `DECISIONS.md` or `CLAUDE.md`.


---

# 01-grounder

anchor: task=intake · agent=grounder · spine=grounder v9 · contract=v1 · utc=2026-10-05T15:00:17Z · commit=4515532

### Inputs
none (brief only; `_SURFACE.md` read; its adoption-time claims re-measured below). Working tree per `git status --porcelain` at start: ` M package-lock.json`. All counts F = fact (read or run), I = inference.

### 1. Stack and commands

| Item | Finding | F/I |
|---|---|---|
| Package manager | npm; `package-lock.json` (modified, uncommitted) | F |
| Framework | next 16.1.6, react 19.2.3, Tailwind 4, supabase-js 2.95 + ssr 0.8, resend 6 + nodemailer 6 (`package.json:17-48`) | F |
| `dev` / `build` / `start` | `next dev` / `next build` / `next start` | F |
| `lint` | `eslint` | F |
| `check` | `check:hooks` + `check:agents` + `lint`. No typecheck, build or test step | F |
| `check:hooks` | hook registration script + 4 `.claude/hooks/*.probe.mjs` | F |
| `check:agents` | `check-commands.mjs`, `check-handoff-contract.mjs` (+ selftests), `agent-distribution.mjs --selftest` | F |
| `secrets`, `secrets:pull`, `secrets:push` | `scripts/sync-secrets.mjs status/pull/push` (OneDrive channel) | F |
| Not in scripts | `setup-db.sh`, `delivery-report.mjs`, `check-brief.mjs`, `check-claude-md.mjs`, `check-install-platform.mjs` exist in `scripts/` but are not wired to a script | F |
| CI | none: no `.github/` | F |
| Tests | none: zero `*.test.*` / `*.spec.*` tracked, no runner in deps | F |
| `npx tsc --noEmit` | exit 0, **0 errors** | F |
| `npx eslint .` | **3 errors, 0 warnings**: `app/(public)/about/page.tsx` no-explicit-any x1; `app/admin/pages/services/page.tsx` react/no-unescaped-entities x2. Matches `_SURFACE.md` | F |
| `next.config.ts` | `typescript.ignoreBuildErrors: true` (comment: Turbopack-on-Windows workaround). `images.remotePatterns`: `*.supabase.co`, `*.b-cdn.net`, `images.unsplash.com`. No headers(), no redirects() | F |
| `vercel.json` | one cron: `/api/cron/daily` at `0 6 * * *` | F |
| Gate vs build | The gate never type-checks and the build ignores type errors. tsc is clean today only by hand-run | F/I |
| `knip.jsonc` | kit template, comment-heavy, generic entry/project; knip not in deps, not in gate | F |
| `tsconfig.tsbuildinfo` | present in working dir; not in `git ls-files` (ignored) | F |

### 2. SSOTs and bypasses

**Feature flags.** `isEnabled(feature: string)` (`config/features.ts:26`) takes a bare `string`, not `FeatureKey`, so a typo compiles and returns false. Direct reads bypassing it:

| Site | Read | Note |
|---|---|---|
| `lib/drip-emails.ts:86` | `siteConfig.features.customerAuth` | bypass |
| `lib/campaign-process.ts:169` | `siteConfig.features.customerAuth` | bypass |
| `components/shared/navbar.tsx:58,98` | `siteConfig.features.shop` | bypass; ignores tier defaults, so it would drift if tier became `commerce` |
| `app/sitemap.ts:51` | `siteConfig.pages[...]` | `pages` is a separate map, no helper exists. Not a bypass |

**Env access.** 24 distinct vars read via `process.env`. There is NO central env module; reads are scattered (F).

| Var | Where | Central? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `_ANON_KEY` | `lib/supabase/{server,client,middleware,admin}.ts` | yes (inside lib/supabase) |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase/admin.ts:7` | yes |
| `NEXT_PUBLIC_APP_URL` | **~25 sites**, mostly `|| https://${siteConfig.domain}` (layout, sitemap, robots, seo/*, drip, campaign, cron, checkout x2, booking, lms, courses, shop, blog, portfolio); also bare with no fallback: `lib/auth/actions.ts:75`, `lib/auth/password-reset.ts:78`, `lib/contact/actions.ts:72` | **no**, bypass x25 |
| `NEXT_PUBLIC_SITE_URL` | `lib/email.ts:77` | second URL var for the same concept (vs APP_URL); both in `.env.example` |
| `NEXT_PUBLIC_SITE_NAME` | `components/email/_base-layout.tsx:226,249` | fallback "Your Company"; siteConfig.name exists |
| `RESEND_API_KEY`, `RESEND_FROM`, `ADMIN_EMAIL`, `SMTP_HOST/PORT/SECURE/USER/PASS` | `lib/email.ts` | yes. Defaults `noreply@example.com` / `admin@example.com` when unset. SMTP vars not in `.env.example` |
| `CRON_SECRET` | `lib/cron/auth.ts:13` AND `app/api/cron/daily/route.ts:9` | duplicated; the route reads it itself (I: may bypass `verifyCronAuth`, not verified) |
| `PAYSTACK_SECRET_KEY`, `PAYSTACK_WEBHOOK_SECRET` | `lib/paystack/*` | yes |
| `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN` | `lib/whatsapp.ts:15` | yes; not in `.env.example` |
| `MICROSOFT_GRAPH_*` (4) | `lib/integrations/microsoft-graph.ts` | yes; not in `.env.example` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_FB_PIXEL_ID` | `app/layout.tsx:14,87` | in-place; FB id not in `.env.example` |
| `NODE_ENV` | `lib/supabase/{config,middleware}.ts` | fine |
| `CLAUDE_PROJECT_DIR`, `NORTIERCUPBOARDS_SECRETS_DIR` | hooks, `scripts/sync-secrets.mjs` | tooling only |

**Supabase clients.** `createClient` outside `lib/supabase/`: none from `@supabase/supabase-js` directly. But `@/lib/supabase/client` (browser client) is imported by **25 files under `app/admin` + `components/admin`** that do direct table reads and writes from the browser (e.g. `app/admin/blog/page.tsx:155`, `app/admin/portfolio/page.tsx:4`), plus `components/auth/login-form.tsx` and `components/shared/navbar-auth-button.tsx` (F). So admin writes are split: server actions with `ensureAdmin` (`lib/cms/actions.ts`, 38 uses) AND browser-side writes gated only by RLS (I: policies unread, migrations not examined). Matters because RLS is the sole control on the browser path.

**Service-role client (`createAdminClient`, `lib/supabase/admin.ts`).** 32 import sites. **0 are in a `"use client"` file** (grep: no client file imports it). Classification:
- Server actions (`"use server"`), 15: `lib/admin/*` (9), `lib/cms/actions.ts`, `lib/booking/actions.ts`, `lib/contact/actions.ts`, `lib/newsletter/actions.ts`, `lib/lms/actions.ts`, `lib/shop/actions.ts`, `lib/auth/password-reset.ts`, `lib/storage.ts`, `app/admin/campaigns/actions.ts`.
- Route handlers, 7: `app/api/{checkout,cron/daily,email/unsubscribe,lms/checkout,track/click,track/open,webhooks/paystack}`.
- Server-only libs, 9: `lib/admin/queries.ts`, `lib/auth/queries.ts`, `lib/booking/credits.ts`, `lib/campaign-process.ts`, `lib/drip-emails.ts`, `lib/email-render.ts`, `lib/whatsapp.ts`, etc. No `import "server-only"` guard anywhere I saw (I: not exhaustively grepped); `lib/admin/queries.ts` has no auth call and relies on callers being admin pages.

**FINDING (high): `lib/storage.ts` `uploadFile` / `deleteFile` are `"use server"` exports using the service-role client with NO `ensureAdmin`/`getUser` check (F: grep of `lib/storage.ts`, 0 hits; used by `components/admin/image-upload.tsx:45`, `multi-image-upload.tsx:51`).** A server action is a public POST endpoint, so any visitor who can call it can upload to or delete from any bucket named in the form (`bucket` and `folder` are taken from FormData, `lib/storage.ts:19-20`). Exploitability not tested (no network); needs a human ruling.

**Money/date.** Helpers: `lib/shop/format.ts` (`formatPrice`, `getCurrencySymbol`, 15-currency table, cents to `"R 150.00"`), `lib/utils.ts:8 formatCents` (`"R150"`, no decimals, hardcoded `R`/en-ZA). Two competing formatters. No date helper exists. Bypasses (F):
- `.toFixed(2)` on cents: `lib/seo/structured-data.ts:130,156,220`, `app/admin/lms/page.tsx:282` (hardcodes `R `).
- Inline `toLocaleDateString/String("en-ZA")`: ~20 sites across `app/admin`, `app/portal`, `app/(public)`, `components/blog/post-card.tsx`. Locale-less `toLocaleDateString()`/`toLocaleString()` (browser locale): `app/admin/activity/page.tsx:41`, `app/admin/contact/contact-table.tsx:82` (the contact table, live data).
- Hardcoded `"ZAR"` instead of `siteConfig.currency`: `app/api/checkout/route.ts:133`, `app/api/lms/checkout/route.ts:78`, `lib/admin/invoice-actions.ts:123`, `lib/paystack/client.ts:15,71` (type literal). Hardcoded `"Africa/Johannesburg"` in `lib/integrations/microsoft-graph.ts:172,227` despite `siteConfig.timezone`.
- `new Date().toLocaleString("en-US",{timeZone})` for tz math: `lib/booking/availability.ts:48,109`.
- `Intl.*` itself: 0 uses.
- Hex brand colours hardcoded (`#1B2A4A`/`#C4A265`): `app/(auth)/layout.tsx`, `components/home/home-content.tsx`, `components/services/services-content.tsx`, `components/shared/footer.tsx`, `navbar.tsx` (besides `globals.css`).

**Admin gating (F).** Three layers, none a single choke point:
1. `proxy.ts` (Next 16 proxy, matcher excludes only static/images) calls `updateSession` (`lib/supabase/middleware.ts`): refreshes the session; for `/admin` with a user, enforces a 15-style inactivity cookie (`ADMIN_ACTIVITY_COOKIE`, `lib/supabase/config.ts`); no user on `/admin` redirects `/login?redirect=`. It does NOT check role.
2. `app/admin/layout.tsx:10-14`: `getCurrentUser()` (`lib/auth/queries.ts`), non-admin redirected to `/portal`. Role from DB `user_profiles.role`.
3. Mutations: `ensureAdmin()`/`requireAdmin()` (`lib/admin/auth.ts`), DB-role check. Used in `lib/admin/*`, `lib/cms/actions.ts`, `lib/shop`, `lib/lms`, `lib/booking`, `app/admin/campaigns/actions.ts`. Missing in `lib/storage.ts` (above).
Also `lib/auth.ts` `requireRole(role)` (second guard, redirects) and `app/api/auth/role/route.ts`. Quirk (I): with `customerAuth` off, a logged-in non-admin lands on `/portal`, which `middleware.ts` redirects to `/` only when unauthenticated; the portal layout still renders for an authenticated non-admin.

### 3. Conventions (F unless marked)
- Layout: `app/(public)`, `app/(auth)`, `app/admin`, `app/portal`, `app/api`, `app/auth/callback`. Components by domain under `components/{admin,shared,ui,...}`; `components/ui` is shadcn. Logic in `lib/<domain>/{actions,queries}.ts`. Types in `types/` (`cms.ts`, `index.ts`). Alias `@/*` = repo root.
- Naming: kebab-case files, `page.tsx`/`*-content.tsx` pattern: public page = server component fetching via `lib/cms/queries.ts`, passing data to a client `*-content.tsx` (`app/(public)/services/page.tsx` + `components/services/services-content.tsx`).
- Header style: mixed. Some `// lib/x.ts` + purpose comment (`lib/admin/auth.ts`), many with none, `config/*` use JSDoc blocks. No enforced header.
- i18n: `LocalizedString = {en, af}` (`types/cms.ts`); client `useLocale()` / `t()` in `lib/locale.tsx` (`"use client"`; fallback of the default context returns `.en` only); hardcoded defaults in `lib/cms/queries.ts`; admin edits via `components/admin/localized-input.tsx`. Copy is DB-driven.
- Admin pages: mostly `"use client"` `page.tsx` using browser Supabase client for reads/writes plus a server action for some writes (`app/admin/portfolio/page.tsx`); a few server components (`app/admin/page.tsx`, `layout.tsx`).
- Server actions vs API routes: server actions for all form/admin mutation (19 `"use server"` files); API routes only for webhooks (`paystack`), cron, tracking pixels, checkout (`checkout`, `lms/checkout`), booking slots, unsubscribe, role lookup.
- Rate limit: `lib/rate-limit.ts`, used in `lib/auth/actions.ts`, `password-reset.ts`, `booking/actions.ts`, `contact/actions.ts`, `newsletter/actions.ts`.
- Docs: `PROJECT_TODO.md` says "~95% complete", last updated 2026-02-26 (stale vs `project-brief/`, which is the pre-adoption copy).

### 4. Live vs dormant

| Flag (`config/site.ts`) | State | Routes / modules still in tree |
|---|---|---|
| portfolio | ON | `app/(public)/portfolio/*`, `app/admin/portfolio`, `components/portfolio`, `components/gallery` |
| i18n, darkMode, whatsapp, googleMaps, seoAdvanced, legalDocs | ON | `lib/locale.tsx`, `theme-*`, `lib/whatsapp.ts`, `app/admin/{whatsapp,legal,seo}`, `components/shared/google-map.tsx` |
| googleAnalytics, resend | ON | `app/layout.tsx`, `lib/email.ts` |
| blog | off | `app/(public)/blog/*`, `app/admin/blog/*`, `components/blog`, `feed.xml` |
| booking, googleCalendar, microsoftGraph, sessionCredits, hybridPackages | off | `app/(public)/book/*`, `app/admin/booking/*`, `app/api/booking/*`, `lib/booking/*`, `components/booking`, `lib/integrations/microsoft-graph.ts` |
| shop, coupons, gifts, multiCurrency | off | `app/(public)/shop/*`, `app/admin/{shop,commerce}`, `app/api/checkout`, `lib/shop`, `components/shop` |
| lms | off | `app/(public)/courses/*`, `app/admin/lms`, `app/api/lms/checkout`, `lib/lms`, `app/portal/courses` |
| newsletter, emailCampaigns, dripEmails | off | `app/admin/campaigns`, `lib/newsletter`, `lib/campaign-process.ts`, `lib/drip-emails.ts`, `app/api/track/*`, `app/api/email/unsubscribe` (note: newsletter admin route does not appear; subscribers read in `lib/admin/queries.ts`) |
| customerAuth, portal, billing, clientOnboarding, clientImport | off | `app/(auth)/*`, `app/portal/*`, `app/admin/{billing,clients/import}`, `lib/auth/*` |
| paystack | off | `app/api/webhooks/paystack`, `lib/paystack/*` |
| facebookPixel, serviceAreaPages | off | `components/shared/facebook-pixel.tsx`; serviceAreaPages: no route found |

**Are disabled routes reachable? Mostly YES (F).** `isEnabled` is called in only 24 files; none of the public pages for blog, shop, book, courses, cart, checkout, portfolio, or any `app/admin/{blog,booking,shop,lms,commerce,billing,campaigns}` page check a flag (grep of `app/(public)/{shop,blog,book,courses}` found no `isEnabled`/`notFound` gating besides `shop/checkout` using `siteConfig.currency`). The only gating found: `app/(auth)/register/page.tsx:11`, `lib/supabase/middleware.ts` (portal only, when unauthenticated), nav/sidebar/footer link hiding, `app/sitemap.ts`, cron job branches, `lib/booking/*`. So `/shop`, `/blog`, `/book`, `/courses`, `/api/checkout`, `/api/booking/*`, `/api/lms/checkout`, `/api/webhooks/paystack` are routable on the live site; what they render depends on empty tables (I, not requested/verifiable here without DB). Server actions `createBooking` / `enrollInCourse` / `submitNewsletter` likewise exist as callable endpoints. The sitemap respects `siteConfig.pages` only.

### Collisions and duplications (ranked)
1. Unauthenticated service-role file upload/delete (`lib/storage.ts`); see section 2.
2. Disabled-feature routes and APIs reachable (section 4).
3. Two money formatters (`lib/shop/format.ts` vs `lib/utils.ts:8`), plus inline `toFixed` and hardcoded `ZAR`.
4. Two site-URL env vars (`NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_URL`), ~25 copy-pasted fallbacks.
5. Two role guards (`lib/auth.ts requireRole`, `lib/admin/auth.ts`) + layout check + `/api/auth/role`.
6. Admin writes split between browser client + RLS and server actions + `ensureAdmin`.
7. `CRON_SECRET` read twice.

### Gaps
- No typecheck, build, or test in the gate; `ignoreBuildErrors: true`, so a type error would deploy.
- No CI.
- `isEnabled(string)` is untyped.
- `.env.example` lacks `SMTP_*`, `WHATSAPP_*`, `MICROSOFT_GRAPH_*`, `NEXT_PUBLIC_FB_PIXEL_ID`.
- No env validation module; `lib/email.ts` silently defaults sender to `noreply@example.com` if `RESEND_FROM` unset.
- `docs/CANON-FINDINGS.md` and `brief/` were not read (out of scope).

### Schema pressure
None implied by this survey. RLS policies for the browser-write path (25 admin files) were NOT examined; whether they hold is unconfirmed and would need migrations read (`supabase/migrations/001-026`) by a human or db-inspector. `decision-needed` is for the storage finding and the reachable-dormant-routes ruling, not DDL.

### Nothing found
- CI (`.github/`, `.gitlab-ci`, other): none. Tests (`*.test.*`, `*.spec.*`, jest/vitest/playwright in deps): none.
- Central env module (`env.ts`, `lib/env*`, zod validation): none. `import "server-only"` guards: none seen (grep for exact string not run; I).
- `next.config.ts` headers/redirects/CSP: none. Security headers elsewhere (`vercel.json`): none.
- Date formatting helper: none. `Intl.*`: none.
- Route for `serviceAreaPages`: none found.
- Newsletter admin page: none under `app/admin/` (searched dir list).

### Rules summoned
`.claude/rules/*.md`: none exist (not in `git ls-files`). Only CLAUDE.md-level context and `.claude/agents/_SURFACE.md` read.


---

# 02-census

anchor: task=intake · agent=census · spine=census v12 · contract=v1 · utc=2026-10-05T15:00:24Z · commit=4515532

### Inputs
none

### Headline numbers
LIVE flags (config/site.ts, tier brochure): portfolio, i18n, darkMode, whatsapp, googleMaps, seoAdvanced, legalDocs, googleAnalytics, resend. OFF: booking, shop, lms, blog, newsletter, customerAuth, portal, billing, emailCampaigns, dripEmails, coupons, gifts, clientImport, microsoftGraph, googleCalendar, paystack.
Column key: LIVE = flag on or ungated; DORMANT-REACH = flag off but route/action still callable by URL or crafted POST (no server-side gate found); DORMANT = behind a gate that holds.

**A. Email: 18 call sites** (sendEmail 9 + notifyAdmin 3 + sendRawEmail 6). Awaited 14, in after() 4, fire-and-forget 0. 14+4+0=18. In cron 4 (1 sendEmail, 3 via sendRawEmail in campaign/drip), in webhook 3 (all awaited). Provider calls inside lib/email.ts: resend.emails.send x2, createTransport x2, sendMail x2 (these are the wrappers' internals, not counted as sites).
**B. DB writes: ~180 call sites in 31 files** (not itemised per call; per-file below). Clients: admin service-role in 29 files, anon/server `createClient` in 3 (lib/auth/actions.ts, app/admin/homepage/page.tsx browser client, app/api/lms/checkout GET only), mixed in 3. Browser anon client: 1 file.
**C.** Third-party fetch sites: 6 files. Cron tasks: 7 (3 live, 4 dormant; arithmetic 3+4=7).
**D.** DROP/TRUNCATE in migrations: 0. `delete from` statements: 3 in supabase/seed.sql + 5 in scripts/seed-industry (1 each). `supabase db reset`: 1.
**E.** Rate limit: in-memory Map, per instance.

### A. Email sends (defects first)
| file + symbol | send | mode | LIVE? | note |
|---|---|---|---|---|
| lib/contact/actions.ts submitContactForm | sendEmail + notifyAdmin | after() | LIVE | the known positive; fixed in 47b597b |
| lib/auth/actions.ts signUp | sendEmail welcome | after() | DORMANT-REACH | register page gated on customerAuth; action still in bundle |
| lib/newsletter/actions.ts subscribeNewsletter | sendEmail | after() | DORMANT-REACH | footer form gated on newsletter; action in bundle |
| lib/auth/password-reset.ts requestPasswordReset | sendRawEmail | awaited | LIVE | forgot-password page has no isEnabled gate; also calls admin.auth.admin.listUsers() per request |
| lib/admin/email-template-actions.ts (test send) | sendRawEmail | awaited | LIVE | admin only, ensureAdmin |
| app/admin/campaigns/actions.ts (test send, ~360) | sendRawEmail | awaited | DORMANT-REACH | admin only |
| lib/campaign-process.ts sendCampaign + processCampaigns (2 sites) | sendRawEmail | awaited, cron | DORMANT | cron gated emailCampaigns; sendCampaign callable from admin |
| lib/drip-emails.ts processDripEmails | sendRawEmail | awaited, cron | DORMANT | cron gated dripEmails |
| app/api/cron/daily bookingReminders | sendEmail | awaited, cron | DORMANT | gated booking |
| lib/booking/actions.ts createBooking, updateBookingStatus | sendEmail x2, notifyAdmin x1 | awaited | DORMANT-REACH | /book page and /api/booking/* have no gate |
| lib/lms/actions.ts enrollInCourse | sendEmail | awaited | DORMANT-REACH | /courses page ungated |
| app/api/webhooks/paystack/route.ts | sendEmail x2, notifyAdmin x1 | awaited, webhook | DORMANT-REACH | HMAC signature checked; reachable |

Fire-and-forget emails remaining on LIVE paths: **none found.** Residual: lib/email.ts defaults FROM to noreply@example.com and ADMIN_EMAIL to admin@example.com when env unset, so notifyAdmin would silently go to example.com. Env not verified (read-only, no secrets read).

Related fire-and-forget (not email, same Vercel-drop class): app/api/track/open/route.ts GET (un-awaited async IIFE doing admin.rpc increment_email_opens) and app/api/track/click/route.ts GET (same pattern, one write). Class: defect, low severity (analytics counter lost). Reachable (no gate), harmless when no campaigns.

### B. DB writes by file (client; LIVE?)
LIVE writes (reachable now): lib/contact/actions.ts (admin, insert contact_submissions, **unauthenticated**, rate-limited), lib/admin/actions.ts (admin, requireAdmin; contacts/site settings), lib/cms/actions.ts (admin client, 37 exports all ensureAdmin), lib/admin/seo-actions.ts (requireAdmin), lib/admin/legal-actions.ts, lib/admin/email-template-actions.ts, app/admin/homepage/page.tsx (browser anon client, relies on RLS, **unverified**), lib/auth/password-reset.ts (admin; tokens), lib/whatsapp.ts (admin, whatsapp_logs; no caller of sendWhatsApp found), app/api/email/unsubscribe (admin; token-keyed update), app/api/track/{open,click} (admin rpc), app/api/cron/daily (admin: cron_runs insert, contact_submissions archive, newsletter_subscribers delete, cron_runs delete).
DORMANT-REACH writes: lib/booking/actions.ts (admin; 12 exports), lib/booking/credits.ts, lib/shop/actions.ts, lib/lms/actions.ts (admin+server), lib/newsletter/actions.ts (admin upsert, unauthenticated), lib/auth/actions.ts (server client), lib/auth/queries.ts, app/api/checkout, app/api/lms/checkout, app/api/webhooks/paystack, lib/admin/{campaign,commerce,invoice,credit,client-import}-actions.ts, app/admin/campaigns/actions.ts, lib/campaign-process.ts, lib/drip-emails.ts.
**Defects / judgment (service-role action, no admin check):**
- lib/booking/actions.ts cancelBookingByCustomer and updateClientNotes: take `userId` from the caller, use admin client, no getUser(). A crafted POST can cancel or edit any booking given its id plus its owner's user id. DORMANT-REACH. needs-human-judgment on exposure.
- lib/booking/actions.ts createBooking: public by design; rate-limited (in-memory).
- lib/shop/actions.ts validateAndDecrementStock: exported from a "use server" file with no guard; decrements stock via admin client (shop off; callable by crafted POST).
- Guard tally (exports vs ensureAdmin/requireAdmin): campaign-actions 8/8, cms 37/37, commerce 7/7, invoice 7/7, credit 4/4, legal 5/5, seo 4/4, admin/actions 5 of 6 (the 6th, getAdminNotificationPrefs, try/catches ensureAdmin and returns defaults, fine), client-import 1 of 2 (parseCSV is pure), booking 9 of 12 (3 above are the gaps), shop 6 of 7 (gap above), lms 8 of 10 (2 gaps use getUser).
Per-call counts per file are in the raw grep, not reproduced; the file list above is complete for the 31 files that matched `.(insert|update|upsert|delete|rpc)(` with a Supabase receiver (non-Supabase hits such as Map.delete, searchParams.delete, hash.update, cookies.delete excluded).

### C. External side effects
| site | target | LIVE? |
|---|---|---|
| lib/email.ts | Resend / SMTP | LIVE (resend on) |
| lib/paystack/client.ts paystackFetch (initializeTransaction from app/api/checkout, app/api/lms/checkout) | api.paystack.co | DORMANT-REACH: no flag check, throws only if PAYSTACK_SECRET_KEY unset |
| lib/paystack/webhooks.ts verifyWebhookSignature + app/api/webhooks/paystack | inbound webhook, signature required | DORMANT-REACH |
| lib/whatsapp.ts sendWhatsApp | graph.facebook.com v18 | Flag on, but **no caller found**; code path unreachable. wa.me links in components are client links, not sends |
| lib/integrations/microsoft-graph.ts (graphFetch x4) | graph.microsoft.com | DORMANT: no importer found outside the file |
| Google Calendar | commented out in lib/booking/actions.ts | DORMANT, no live code |
| app/api/cron/daily sitemapPing | google.com/ping | LIVE only if a content flag on (portfolio is on) and an item updated in 24h. Google retired this ping endpoint; likely a no-op |
| app/api/track/click | redirect, https any host allowed | LIVE reachable. Open redirect to any https URL (see below) |
Cron (vercel.json: one job, `0 6 * * *`, /api/cron/daily). Auth: Bearer CRON_SECRET only **if the env var is set**; unset means the endpoint is open to any GET. 7 tasks:
1 reminders DORMANT (booking) · 2 cleanup LIVE (archives contacts older than 90 days; deletes soft-deleted subscribers) · 3 orders DORMANT (shop) · 4 campaigns DORMANT · 5 drip DORMANT · 6 sitemap LIVE-conditional · 7 cron_cleanup LIVE. Live 3 (cleanup, sitemap, cron_cleanup), dormant 4 = 7.
Click tracker: parsed URL must be http(s); non-own domains must be https, so effectively any https URL. Open redirect on the live domain: needs-human-judgment.

### D. Destructive / DDL
- scripts/setup-db.sh: `--reset` runs `supabase db reset --no-seed` after a y/N prompt; no `--linked` flag, so it targets the local stack by default (default behaviour of the CLI; not run). Then it runs migrations (`db push --include`, psql fallback via DATABASE_URL), then **always** runs supabase/seed.sql and the chosen seed-industry file. Without `--reset` the seeds still run.
- supabase/seed.sql: `delete from nav_links`, `delete from footer_sections`, `delete from faqs` (unconditional wipes) then reinserts. Run against the live DB it overwrites admin edits to nav, footer and FAQs. defect-if-run-on-prod.
- scripts/seed-industry/{health,hospitality,professional,retail,trades}.sql: each `delete from public.faqs` (5 files); generic.sql has none.
- supabase/migrations/026_seed_content.sql: INSERT only, no DROP/DELETE. Its `faqs` insert has no ON CONFLICT, so a re-run duplicates FAQs; site_content/homepage_sections/page_seo use ON CONFLICT DO UPDATE (overwrites edited content). Not a wipe.
- Migrations 001-026: 0 DROP/TRUNCATE; `on delete cascade/set null` FKs only (cascades from auth.users and booking/course parents delete child rows when parent deleted).
- scripts/sync-secrets.mjs copies secret files, guarded by git check-ignore. Not a data path.
- App paths that delete rows: cron (subscribers, cron_runs), bookings delete, cms deletes, coupon/gift/invoice deletes. All admin-guarded.

### E. Contact form spam defence
- Honeypot: field `website`, hidden by `absolute -left-[9999px]` (app/(public)/contact/contact-form.tsx, the div before the input, ~line 49). Server check lib/contact/actions.ts lines 18-22: non-empty returns `{success:true}` silently, before any DB write. Only defence beyond the limiter; no CAPTCHA, no time-to-submit check, no content filter; bots that skip the field pass.
- Rate limit: lib/rate-limit.ts, `Map` at module scope (line ~10), cleanup via setInterval unref'd; header comment lines 2-4 says it resets per cold start and instance and should be replaced before launch. **Not persistent**, so on Vercel each instance has its own counter; effective limit is a multiple of 5.
- Call: lib/contact/actions.ts ~lines 38-42, key = first x-forwarded-for entry, fallback "unknown" (shared bucket), 5 per 300 s. Runs after the honeypot and email-regex check, before the insert and `after()` emails. Every non-honeypot spam message that clears it inserts a row and sends 2 emails (confirmation to the spammer-supplied address, plus admin notice), so the form can be used to mail arbitrary third parties.
- Same in-memory limiter used by: newsletter (3/300 s), signUp (5/300 s), password reset (3/300 s), createBooking (5/300 s).

### Spellings swept
Email: `sendEmail(`, `notifyAdmin(`, `sendRawEmail(`, `emails.send`, `sendMail(`, `createTransport`, `after(`, `.then(`, `void send`, line-start bare calls. Also checked importers of lib/email, lib/email-render (renderEmail only builds HTML, sends nothing). DB: `.insert( .update( .upsert( .delete( .rpc(` across app, lib, components in .ts/.tsx/.js/.mjs; also scripts and supabase SQL via `delete from|drop|truncate` case-insensitive. External: `fetch(`, graph.microsoft, googleapis, api.paystack, graph.facebook, wa.me, and importers of lib/whatsapp, lib/integrations/microsoft-graph, lib/paystack/client. Exclusions: node_modules, .next, project-brief, .claude (agent docs contain the strings only as prose), .handoff. No fan-out used (single scripted pass).

### Zero-verification
- Fire-and-forget email = 0: probe proven. The bare-call pattern `^\s+(sendEmail|notifyAdmin|...)\(` plus `.catch` search matches pre-fix `git show 47b597b^:lib/contact/actions.ts` (lines 59, 64, 70) and today matches only the 4 calls inside after() (contact x2, auth, newsletter). `after(` also hits lib/contact/actions.ts as briefed.
- DROP/TRUNCATE in migrations/scripts = 0: the case-insensitive alternation was proven live on `delete ` hits (in migrations) but there is no known DROP positive in the tree, so the DROP/TRUNCATE term alone is **unproven**; supported by `grep -l "drop table"` returning nothing and whole-word `drop|truncate` count 0 across supabase/, setup-db.sh, seed-industry.
- sendWhatsApp callers = 0 and microsoft-graph importers = 0: probe is the same grep proven on sendRawEmail callers (6 hits); definition site found each time. Dynamic import strings not searched, unproven for `import("...")` forms.
- Feature-gating zero (no isEnabled in /book, /shop, /courses, /blog, forgot-password pages): grep of those five files returned nothing while the same grep returns hits for register/page.tsx; proven.
- Not checked: env var values, RLS policies, live DB state, whether Vercel actually serves ungated routes (inferred from source).


---

# 03-db-inspector

anchor: task=intake · agent=db-inspector · spine=db-inspector v7 · contract=v1 · utc=2026-10-05T15:01:13Z · commit=4515532

### Inputs
none

### Answer
Every table from every table-creating migration exists in production (no 404/PGRST205). Four migrations (011, 013, 017, 018) only ALTER tables, so their application is not testable by table existence. Paystack is not live: all payment/order tables exist and hold 0 rows. 2 auth users, both admin.

### Evidence
Script: `.handoff/intake/scratch/probe.mjs` (GET only, key read from .env.local in-process). Existence test: `GET /rest/v1/<t>?select=*&limit=0` with `Prefer: count=exact`; 200/206 = table exists, count from Content-Range.

**Q1 migration -> table probe** (all applied-looking; 52 tables probed, none absent)

| Mig | Table probed | Rows |
|---|---|---|
| 001 | site_content (also nav_links 6, footer_sections 3, faqs 7, page_seo 8, homepage_sections 5) | 5 |
| 002 | user_profiles (activity_log 0) | 2 |
| 003 | contact_submissions | 50 |
| 004 | newsletter_subscribers | 0 |
| 005 | blog_posts (blog_categories) | 0 |
| 006 | portfolio_items | 8 |
| 007 | bookings (booking_services, availability_rules, blocked_dates) | 0 |
| 008 | orders (products, product_categories 0; shop_settings 3) | 0 |
| 009 | payment_logs | 0 |
| 010 | courses (modules, lessons, enrollments, completions) | 0 |
| 011 | none created; ALTERs user_profiles (columns not probed) | n/a |
| 012 | integration_credentials | 0 |
| 013 | none created; ALTERs page_seo/blog_posts/products | n/a |
| 014 | cron_runs | 637 |
| 015 | password_reset_tokens | 0 |
| 016 | email_templates (email_logs 0) | 8 |
| 017 | none created (extended profiles ALTER) | n/a |
| 018 | none created (booking ALTER) | n/a |
| 019 | session_credit_balances (+transactions) | 0 |
| 020 | invoices (billing_entities 0; invoice_sequences 1) | 0 |
| 021 | whatsapp_templates (whatsapp_logs 0) | 3 |
| 022 | campaigns (+ emails, progress, drip_emails, drip_progress) | 0 |
| 023 | legal_documents (document_acceptances 0) | 2 |
| 024 | client_intakes | 0 |
| 025 | coupons (hybrid_packages, gifts) | 0 |
| 026 | seed only; data present (site_content 5, faqs 7, page_seo 8, etc.) | n/a |

`supabase_migrations` schema: GET with `Accept-Profile: supabase_migrations` -> 406 PGRST106, "Only public, graphql_public exposed". Not reachable; applied-migration history cannot be read.

**Q2 counts:** contact_submissions 50; site_content 5; homepage_sections 5; faqs 7; portfolio_items 8; page_seo 8; nav_links 6; legal_documents 2. No `profiles` table; `user_profiles` 2.
contact_submissions per day (created_at, UTC) 2026-09-25..10-05: 09-27 = 1; 10-02 = 1; 10-03 = 1; 10-04 = 2; all other days 0 (incl. 10-05). Latest row 2026-10-04T16:05:14Z.

**Q3 Payments:** `payment_logs` 0, `orders` 0, `invoices` 0, `bookings` 0, `products` 0, `coupons` 0, `integration_credentials` 0. Paystack has never recorded a transaction or credential in prod.

**Q4 Auth:** `GET /auth/v1/admin/users?per_page=1` -> 200; body has no `total`, but `x-total-count` header = 2. `user_profiles` by role (`select=role`): admin = 2 (customer 0).

**Q5 SUPABASE_DB:** appears only in `.claude/agents/_SURFACE.md` (a note) and my probe; zero references in app code, scripts, or config. Value length 40, not a URL (no postgres:/http: prefix), not `sbp_` prefix, not the project ref contained in the URL (project ref is 20 chars). Looks like a bare token/password-like string; purpose unconfirmed, apparently unused by the repo. Possibly a DB password or a legacy secret from the OneDrive secrets channel.

### Caveats
- Empty vs broken: every zero is a 200 `*/0` on a table that answers with Content-Range, so the table exists and is reachable; a 404 would have shown PGRST205. Zeros are real emptiness, not wrong filter. contact_submissions' per-day zeros are backed by the 50-row total and latest-row date.
- Dates are UTC; app-local (SAST) day boundaries could shift a row across midnight.
- 011/013/017/018 column-level application unverified (would need a SELECT naming the new column).
- Existence of a table does not prove the migration ran in full (RLS, policies, functions, indexes not visible via PostgREST). Migration 026 seed inferred from row counts only.
- Column `role` exists in user_profiles (SELECT succeeded). No personal fields read.

### Schema notes
- `user_profiles.role` values observed: admin only. Admin count equals auth user count (2 = 2).
- cron_runs 637 rows indicates scheduled jobs actively running.
- Tables with data in prod: content tables (001), user_profiles, contact_submissions, portfolio_items, shop_settings, cron_runs, email_templates, invoice_sequences, whatsapp_templates, legal_documents. All commerce/LMS/booking/campaign tables exist but are empty.


---

# 04-scout

anchor: task=intake · agent=scout · spine=scout v2 · contract=v1 · utc=2026-10-05T15:00:41Z · commit=4515532

### Inputs
none (read `.claude/agents/_SURFACE.md` as context; its "unconfirmed" lines are not relied on)

### Question
1. Inventory of project-brief/ + PROJECT_TODO.md, with class (a) own / (b) Yoros template / (c) build step.
2. Target path under brief/ for each; flag do-not-file.
3. Top rules/scars/decisions to surface, each classified against code.
4. Facts for EVIDENCE.md.
5. History in <=8 lines.

### Answer

### 1+2. Inventory and filing map
Naming rule (brief/build/README.md): bands `00,10..90` reserved, `NN-name.md`, amendments `20.1-`, no two docs one number. The other five role READMEs (design, legal, product, research, runbooks, vendors) state no naming rule, only a verb and an empty file table. brief/build/INDEX.md exists as an empty table.

| Source (bytes) | Purpose | Class | Proposed target / note |
|---|---|---|---|
| PROJECT_BRIEF.md (12452) | Client business, scope, 5 pages, content needs | a | `brief/product/PROJECT_BRIEF.md` (verb: argue). Keep name. Facts go to EVIDENCE.md, not copied |
| TECHNICAL_DESIGN.md (27672) | Architecture, schema, route map, DNS | a | `brief/build/10-technical-design.md`. Rename forced: build/ needs a band prefix. Mark SUPERSEDED in part (see 3) |
| design/BRAND_DESIGN_SYSTEM.md (19438) | Brand, palette, type | a | `brief/design/BRAND_DESIGN_SYSTEM.md` (no band rule in design/) |
| design/LOGO_ASSETS.md (892) | Logo spec | a | `brief/design/LOGO_ASSETS.md`; STALE (file `nc-logo-monogram.png` named, absent; real logo is `public/logo.png`). File with stale note, or hold |
| design/nortier-cupboards-mockup.html (36292), .pdf (274285) | Visual mockup | a | `brief/design/` as-is. Binary/large; operator may prefer leave in place |
| design/nortier-logo.png (97026) | Logo | a | Asset; do not file in brief (duplicate of public/logo.png unverified). Hold |
| YOROS_UNIVERSAL_PROJECT_BRIEF.md (15525) | Template baseline standards | b | `brief/research/YOROS_UNIVERSAL_PROJECT_BRIEF.md` (consult). Argument: it is an input, not this project's decision; vendors/ is wrong, Yoros is the developer's own template, not a contract. Header must say "template, not binding" |
| YOROS_I18N_DARKMODE_STANDARD.md (6645) | Template i18n/dark standard | b | `brief/research/` likewise |
| build plan/BUILD_INDEX.md (4878) | 14-build order | c | `brief/build/INDEX.md` has its own format and a 40 KB cap. Do not overwrite; file as `brief/build/10.1-build-plan-index.md` or hold. Its numbering contradicts TODO and TD (see 3) |
| build plan/build_01..14 (14 files, 4-12 KB) | Per-build session specs | c | HISTORICAL: all executed (commit 3d26db4). Recommend NOT filing as live build docs; if kept, `brief/build/` bands 10-90 do not map 1:1 to 14 steps, so rename is forced. Suggest leaving in `project-brief/` or an archive. Operator decision |
| build plan/migrations/001-003 .sql (4-7 KB) | Original bespoke schema | c | DO NOT FILE. Superseded: `supabase/migrations/` is 26 template files (001_foundation .. 026_seed_content), none named core_tables/rls_policies. Content is SQL, not a brief |
| PROJECT_TODO.md (2553, root) | Status tracker | a | Do not file as is: dated 2026-02-26, claims ~95%, wrong references (`project_brief/`, 25 migrations). File as a historical snapshot only, or retire into DECISIONS/GATES |

Do-not-file summary: build plan SQL (superseded), PROJECT_TODO.md (stale), TECHNICAL_DESIGN route/build numbering and Next "14+" (stale parts), LOGO_ASSETS (stale).

### 3. Surface candidates (top 25, quoted briefly)
STILL = still-true-in-code; CONTRA = contradicted; UNV = unverifiable here.

1. "Nothing is hardcoded. Everything is admin-editable." YOROS_UNIVERSAL:10 — STILL in spirit: copy via `lib/cms/queries.ts` portfolio_items etc (queries.ts:230); footer hardcodes the Yoros credit (components/shared/footer.tsx:82).
2. Brochure site, "no booking, no e-commerce, no client portal" TECHNICAL_DESIGN:14, PROJECT_BRIEF:45 — STILL as flags (config/site.ts:113-141), CONTRA as tree: app/(public) still has blog, book, courses, shop, portal, 26 migrations.
3. Gallery at `/gallery`, 5 pages, PROJECT_BRIEF:49-55 — CONTRA: route is `app/(public)/portfolio`; no gallery dir. Also faq/terms/privacy pages enabled (site.ts:147-153).
4. "Hero... Full-width background image" PROJECT_BRIEF:73 — CONTRA/changed: hero video background added (2be0cca, 62b01cc play once; public/video/workshop.mp4; home-content.tsx:78).
5. Brand navy `#1B2A4A`, camel `#C4A265` — STILL (site.ts:106-108). Fonts Plus Jakarta Sans + Inter — STILL (site.ts:110).
6. "Logo design (currently text-only)" PROJECT_TODO:60 — CONTRA: logo images used (cf2dc02), public/logo.png.
7. "Real project photography (client-supplied, currently placeholders)" TODO:59 — CONTRA: a0ab053 "add real client photos"; public/images/* present.
8. "WhatsApp number update in admin settings" TODO:61 — UNV: number lives in DB `whatsapp_number` (admin/settings/page.tsx:123); value not readable without a DB read.
9. "Google Maps embed URL configuration" TODO:62 — UNV (DB setting).
10. "Newsletter signup integration" TODO:63 — CONTRA/moot: `features.newsletter: false` (site.ts:118) although lib/newsletter/actions.ts exists.
11. "Domain setup & deployment" TODO:64; TD 10.2 A 76.76.21.21 — UNV (site live per _SURFACE, DNS not checked).
12. "Performance audit & optimisation" TODO:55; Lighthouse >90 PROJECT_BRIEF:279 — UNV; no CI/test. Open.
13. i18n by cookie `locale`, no URL prefixes, YOROS_I18N:11-14 — CONTRA in part: `lib/locale.tsx:35,47` stores `yoros-lang` in localStorage; no cookie in that file. Verify SSR path.
14. Localized fields as JSONB `{en,af}` YOROS_I18N — STILL: seed uses `{"en":..,"af":..}` (supabase/migrations/026_seed_content.sql:21).
15. Email: form -> Supabase + Resend to Charl; from `noreply@nortiercupboards.co.za` TD:392,421 — STILL partly: from/admin addresses are env (`RESEND_FROM`, `ADMIN_EMAIL`, lib/email.ts:50-51), values unverifiable; _SURFACE says admin goes to info@nortier.co.za.
16. Contact form returns "We'll get back to you within 24 hours." PROJECT_BRIEF:190 — UNV (copy in DB/i18n).
17. Hours Mon-Fri 07:30-17:00, Sat 08:00-12:00 PROJECT_BRIEF:202 — UNV (DB settings).
18. Scar: un-awaited email dropped on Vercel, leads lost 2 and 4 Oct 2026 — STILL: `after()` at lib/contact/actions.ts:61, lib/auth/actions.ts:69, lib/newsletter/actions.ts:46 (47b597b). Source is _SURFACE.md:24 and commit, not the project-brief.
19. "Charl doesn't need complexity" PROJECT_BRIEF:269 — client-preference; UNV in code, binds admin UX.
20. "Mobile-first — most leads come from mobile" PROJECT_BRIEF:61 — UNV.
21. Floating WhatsApp FAB every page, green #25D366, pulse once PROJECT_BRIEF:208-217 — STILL present (components/shared/whatsapp-button.tsx:20); details unverified.
22. "Before/after pairs are the highest priority content" PROJECT_BRIEF:247 — STILL (before/after badge fix a0ab053).
23. Footer "Yoros credit" PROJECT_BRIEF:60 — STILL (footer.tsx:82 links yoros.co.za).
24. Stack "Next.js 14+" TD:18 — CONTRA: next 16.1.6 (package.json). "Vercel, production branch main" TD:707 — STILL (_SURFACE; only branch).
25. "Total estimated builds 18-22" TD:754 vs BUILD_INDEX 14 vs PROJECT_BRIEF 8-12 vs TODO "Build 01-09" with different names — internal contradiction; the three build numberings do not agree. Also vercel.json cron `/api/cron/daily` (template, not in any brief) — scar candidate: runs on live site.

### 4. Facts for EVIDENCE.md
- Client: Nortier Cupboards, custom cupboard design/manufacture/install, Paarl, Western Cape; 20+ years (PROJECT_BRIEF.md:3,14; config/site.ts:98-99).
- Owner/contact person: "Charl" (surname not stated; GitHub owner `charlnortier`) (PROJECT_BRIEF.md:105,189,334; `git remote -v`). Inference: Charl Nortier.
- Tagline "Quality, experience and professional service" (PROJECT_BRIEF.md:16).
- Service area: Paarl, Stellenbosch, Franschhoek, Wellington, Somerset West, broader WC (PROJECT_BRIEF.md:123; 026_seed_content.sql:21).
- Domain nortiercupboards.co.za, client-owned, previously broken WordPress (PROJECT_BRIEF.md:8,35,325; site.ts:100). Email domain: noreply@nortiercupboards.co.za (TECHNICAL_DESIGN.md:421); admin to info@nortier.co.za (_SURFACE.md:23, not independently confirmed).
- Phone, WhatsApp, street address, email: NOT in any brief document ("Needed", PROJECT_BRIEF.md:289-296; WhatsApp `27XXXXXXXXXX` :215). Live values are in DB site_settings.
- Hosting: Vercel (GitHub `https://github.com/charlnortier/nortiercupboards.git`), Supabase `honctnszuqsyvzbvxbkg` (_SURFACE.md:20), Resend, GA4 (site.ts:142-146). Vercel DNS per TD:714-717 (A 76.76.21.21).
- Stakeholders: client = Charl/Nortier; developer = Yoros (yoros.co.za, footer.tsx:82), repo operator Stéan Bouwer (git user). Pricing "Pilot pricing: standard Yoros template build" (PROJECT_BRIEF.md:7). Existing listings: Homeimprovement4U, Snupit, Pinterest (PROJECT_BRIEF.md:35-38).
- Locales en (default) and af; currency ZAR; tz Africa/Johannesburg (site.ts:102-104).

### 5. History
- 1a126ec 2026-02-26 scaffold from yoros-client-template; daa838b .gitignore.
- 750157b polish pages; 88ed329 PROJECT_TODO.md added (same day).
- 52d5910 admin homepage editor, seed content, i18n+SEO; c12b6da Afrikaans seeds; cf2dc02 logo/favicon/OG.
- 2026-03-02: 3d26db4 full buildout (pages, legal, admin); 2be0cca/62b01cc hero video; f2618d9 SEO sheet; 033cc14 gallery populated.
- a0ab053 2026-03-11 real client photos, before/after badge fix.
- 7 months idle, then 2026-10-05: 47b597b fix lost contact emails with `after()`.
- 7a0615a move to E:\dev\nortier + OneDrive secrets channel; b426f16 check gate (lint only).
- fb53624 adopt dev-standards kit; 4515532 install canon agents. (17 commits total.)

### Read vs inferred
- Read: all of PROJECT_BRIEF.md, PROJECT_TODO.md, BUILD_INDEX.md, LOGO_ASSETS.md, first 40 lines of YOROS_*, TECHNICAL_DESIGN headings and 700-770, config/site.ts, the cited code lines.
- Inferred: build_NN bodies and SQL files executed in commit 3d26db4 (only headers read); logo.png duplicates nortier-logo.png; "Charl Nortier" from repo owner; claim 1 holds across components (only footer and queries.ts sampled); item 13 SSR cookie path not read beyond lib/locale.tsx. Confirm by diffing the PNGs and grepping `cookies()` in lib/ and app/layout.tsx.

### Not found
- Phone/WhatsApp/street address/email values in any repo file (grepped `+27`, `wa.me`, digit patterns, `info@`): only placeholders. Needs a DB read of site_settings.
- A `/gallery` route (listed `app/(public)`); `nc-logo-monogram.png`; any Vercel project file (`.vercel/`); production DNS state.
- `info@nortier.co.za` in code: only `_SURFACE.md`; env-driven, so source is `.env.local` (not read).

