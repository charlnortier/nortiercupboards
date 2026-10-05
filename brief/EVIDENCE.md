# Evidence

> **Every fact available to this project, with its source.** Nothing elsewhere in this tree may
> state a fact this file does not carry. If a claim is not here it is not established — ask; do not
> estimate, round or infer.
>
> Filled 2026-10-05 from the Phase 1 adoption survey at commit `4515532`. "Survey" below means
> `research/00-intake-survey.md`, which holds the working behind each line.

## The client and the business

- **Client: Nortier Cupboards — custom cupboard design, manufacture and installation, Paarl, Western
  Cape; 20+ years trading.** — *source: project-brief/PROJECT_BRIEF.md:3,14; config/site.ts:98-99*
- **Contact person: "Charl"; the GitHub repo owner is `charlnortier`.** Surname is not stated in any
  document. — *source: PROJECT_BRIEF.md:105,189,334; `git remote -v`*
- **Service area: Paarl, Stellenbosch, Franschhoek, Wellington, Somerset West, broader Western
  Cape.** — *source: PROJECT_BRIEF.md:123; supabase/migrations/026_seed_content.sql:21*
- **Domain `nortiercupboards.co.za` is client-owned; it previously served a broken WordPress
  site.** — *source: PROJECT_BRIEF.md:8,35,325; config/site.ts:100*
- **Phone, WhatsApp number, street address and contact email are in no repo file** (only
  placeholders such as `27XXXXXXXXXX`). The live values are database settings, edited at `/admin`.
  — *source: survey, scout §Not found; app/admin/settings/page.tsx:123*
- **Developer: Yoros (yoros.co.za), on "pilot pricing: standard Yoros template build"; the repo
  operator is Stéan Bouwer.** — *source: PROJECT_BRIEF.md:7; components/shared/footer.tsx:82; git
  config*
- **Locales `en` (default) and `af`; currency ZAR; timezone Africa/Johannesburg.** — *source:
  config/site.ts:102-104*

## The live system

- **Hosting: Vercel, deploying every push to `main`; there is no staging environment, and `main` is
  the only branch.** — *source: operator, 2026-10-05; `git branch -a`*
- **One Supabase project, `honctnszuqsyvzbvxbkg`, which is production.** — *source: .env.local
  `NEXT_PUBLIC_SUPABASE_URL`, read in-process by db-inspector 2026-10-05*
- **Every table created by migrations 001–026 exists in production (52 tables probed, none
  absent).** Whether 011/013/017/018 (ALTER-only) applied in full is unverified; the migration
  history schema is not exposed to PostgREST. — *source: survey, db-inspector Q1*
- **How migrations reach production is unknown** — there is no CI, and no record of which channel
  applied them. — *source: survey, grounder §1, db-inspector Q1*
- **Production rows (2026-10-05): `contact_submissions` 50 (latest 2026-10-04 16:05 UTC);
  `user_profiles` 2, both `admin`; 2 auth users; `portfolio_items` 8; `cron_runs` 637.** —
  *source: survey, db-inspector Q2, Q4*
- **Commerce, booking, LMS, campaign and payment tables are all empty; Paystack has never recorded a
  transaction or credential.** — *source: survey, db-inspector Q3*
- **Live features (config/site.ts, tier `brochure`): portfolio, i18n, darkMode, whatsapp,
  googleMaps, seoAdvanced, legalDocs, googleAnalytics, resend. Everything else is off.** — *source:
  config/site.ts:113-153*
- **Disabled features are still routable:** `/shop`, `/blog`, `/book`, `/courses`, `/api/checkout`,
  `/api/booking/*`, `/api/lms/checkout`, `/api/webhooks/paystack`, and their server actions, carry no
  flag check. — *source: survey, grounder §4 and census §B*
- **One cron job: `/api/cron/daily` at 06:00 UTC; 3 of its 7 tasks run live (contact archive at 90
  days, sitemap ping, cron-run cleanup). It requires `CRON_SECRET` only if that variable is set.** —
  *source: vercel.json; app/api/cron/daily/route.ts:9; survey, census §C*
- **`SUPABASE_DB` (40 characters, in the secrets channel) is read nowhere in the repo.** — *source:
  survey, db-inspector Q5*

## Code and gates

- **Stack: Next 16.1.6, React 19.2.3, Tailwind 4, supabase-js 2.95 + ssr 0.8, Resend 6 with a
  nodemailer SMTP fallback; npm.** — *source: package.json:17-48*
- **No tests, no CI.** — *source: survey, grounder §1 (no `.github/`, no `*.test.*`/`*.spec.*`, no
  runner in deps)*
- **`npx tsc --noEmit`: 0 errors. `npx eslint .`: 3 errors, all from before adoption —
  `app/(public)/about/page.tsx:12` no-explicit-any; `app/admin/pages/services/page.tsx:213`
  no-unescaped-entities ×2.** — *source: survey, grounder §1, run 2026-10-05*
- **`next.config.ts` sets `typescript.ignoreBuildErrors: true`, so a type error deploys.** —
  *source: next.config.ts*
- **`npm run check` = hook probes + agent checks + lint; it does not type-check, build or test.** —
  *source: package.json:10-12*

## Dangers

- **`lib/storage.ts` `uploadFile`/`deleteFile` are `"use server"` exports using the service-role
  client with no admin check; the bucket and folder come from the caller's FormData.** Live:
  anyone who can post to the action can upload to or delete from storage. Exploitability not tested.
  — *source: lib/storage.ts:18-19; survey, grounder §2*
- **Service-role server actions with no auth, behind disabled features but reachable:**
  `lib/booking/actions.ts` `cancelBookingByCustomer`, `updateClientNotes` (trust a caller-supplied
  `userId`); `lib/shop/actions.ts` `validateAndDecrementStock`. — *source: survey, census §B*
- **25 admin files read and write tables from the browser client, so RLS is their only control; the
  policies have not been examined.** — *source: survey, grounder §2*
- **Open redirect: `/api/track/click` redirects to any https URL.** — *source:
  app/api/track/click/route.ts; survey, census §C*
- **Contact form defence is a honeypot plus an in-memory per-instance rate limit (5 per 300 s per
  instance); no CAPTCHA. Each accepted submission emails the submitter-supplied address, so it can
  mail third parties.** — *source: lib/contact/actions.ts:18-22,38-42; lib/rate-limit.ts:2-10*
- **`supabase/seed.sql` deletes all `nav_links`, `footer_sections` and `faqs` before reinserting;
  `scripts/setup-db.sh` always runs it.** Against production it would overwrite the client's edits.
  — *source: supabase/seed.sql; scripts/setup-db.sh; survey, census §D*
- **`lib/email.ts` silently defaults the sender to `noreply@example.com` and the admin recipient to
  `admin@example.com` when `RESEND_FROM`/`ADMIN_EMAIL` are unset.** Production values not read. —
  *source: lib/email.ts:50-51*

## History

- **Scaffolded from yoros-client-template 2026-02-26; full build-out 2026-03-02; real client photos
  2026-03-11; then idle seven months.** — *source: `git log` (1a126ec, 3d26db4, a0ab053)*
- **Incident: contact-form emails were sent un-awaited and dropped by Vercel; two real leads lost,
  2026-10-02 and 2026-10-04. Fixed with `after()` in 47b597b.** No fire-and-forget email remains on
  a live path (18 send sites: 14 awaited, 4 in `after()`). — *source: commit 47b597b; survey, census
  §A*
- **The pre-adoption docs are stale in parts: `PROJECT_TODO.md` (2026-02-26, "~95%") lists the
  logo and real photos as outstanding, both since done; `TECHNICAL_DESIGN.md` says Next "14+"; three
  build numberings disagree.** — *source: survey, scout §3 items 6, 7, 24, 25*

---

## Claims that are interpretation, not fact

Defensible, and **not evidence**. They are argued in `product/`, and must not be quoted as though
they came from a source.

- Leads through the contact form are the site's whole commercial purpose — argued in
  `product/PROJECT_BRIEF.md` (once filed)
- "Charl doesn't need complexity": admin UX should stay minimal — argued in
  `product/PROJECT_BRIEF.md` (once filed)
