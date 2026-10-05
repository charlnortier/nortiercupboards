# Project surface — shared notes for every agent

Not an agent file. The facts each agent's surface section draws on, kept once. Written
2026-10-05 at adoption and updated from the Phase 1 survey the same day. `brief/EVIDENCE.md` is
the source for every fact here, and wins when the two disagree.

## The check gate
`npm run check`. **Do not restate the step list anywhere; read `package.json`**, which is the
only copy that cannot go stale. It is GREEN as of
2026-10-05 (the three pre-adoption lint errors were fixed in `f6e9d83`), and it type-checks —
which matters because `next.config.ts` sets `ignoreBuildErrors`, so the build would not. It is GREEN with all
four tier-0 slots passing (2026-10-05); anything red is a regression.

There is no CI and no test suite.

## What can actually hurt (the danger census, 2026-10-05)

| Danger | Why it is the danger here |
|---|---|
| **Writing to the database** | Supabase `honctnszuqsyvzbvxbkg` is the ONLY database, behind the live site, and there is no staging project. `npm run dev`, and any script run with `.env.local`, reads and writes live data. The service-role key in that file bypasses RLS. |
| **The site's copy is data, not code** | Page text, FAQs, SEO, navigation and portfolio live in tables (`site_content`, `homepage_sections`, `faqs`, `page_seo`, `nav_links`, `portfolio_items`, …) that the client edits through `/admin`, read via `lib/cms/queries.ts`. A "copy fix" in the repo may be overwritten by the client's edit or may not be where the text lives at all. |
| **Real customer data** | `contact_submissions` holds real leads: names, phone numbers, email addresses. Never copy rows into an artefact beyond what the question needs. |
| **Real email** | Resend sends from `noreply@nortiercupboards.co.za`; admin notifications go to `info@nortier.co.za` (a different domain, by design). Anything that triggers a send reaches a real inbox. |
| **A dropped email** | On Vercel a send not awaited or not handed to `after()` from `next/server` is killed when the function returns. Two real leads (2 and 4 Oct 2026) were lost this way while spam got through; fixed in 47b597b (`lib/contact`, `lib/newsletter`, `lib/auth`). |
| **A push to `main`** | Vercel deploys every push to `main` to the live site. There is no other branch and no staging step. A merge or push to `main` is the operator's call, and bash-gate asks. |
| **DDL** | 26 files in `supabase/migrations/` and `scripts/setup-db.sh`, which runs `supabase db push`, `db reset` or `psql`. Neither the supabase CLI nor psql is installed here, so how DDL actually reached production is **unknown** — every migration's tables exist there, but the migration history is not readable. bash-gate asks on all three. `supabase/seed.sql` deletes nav, footer and FAQ rows before reinserting. |

## The template underneath
Scaffolded from the Yoros client template. Every feature that was OFF — booking, shop, LMS, blog,
newsletter, customer auth, portal, billing, campaigns, Paystack and the rest — was **deleted** on
2026-10-05 by operator ruling and will never return; do not rebuild any of it. Their migrations and
(empty) production tables remain, untouched. **A feature flag never disables a server action** — a
lesson from before the deletion that still governs any new flag. **Deleting a route breaks links already in the wild** — sent emails above all: `/portal` kept a redirect in `next.config.ts` for exactly that reason. `config/site.ts` lists only live
features: portfolio, i18n (`en`/`af`), dark mode, WhatsApp, Google
Maps, advanced SEO, legal docs, Google Analytics, Resend.

## SSOTs

| | |
|---|---|
| `config/site.ts` | Name, domain, tier, brand colours and fonts, locale, every feature flag. |
| `config/features.ts` | `isEnabled()` — the only correct way to ask whether a feature is on. |
| `lib/supabase/` | `server.ts`, `client.ts`, `admin.ts` (service role — bypasses RLS). |
| `lib/email.ts` | Email sending, Resend first and SMTP as the fallback. |
| `lib/cms/queries.ts` | Every read of the site's CMS content. |

## Contact-form spam traps
`lib/contact/actions.ts` `detectSpam`. A trapped submission is **saved archived, never
discarded**, and sends no email — a trap that drops mail hides its own false positives. Honeypot
names must match no autofill or password-manager field (`website` did). The fill-time clock starts
at the first input, not on mount, because the server-rendered form takes typing before hydration.

## The schema channel
**Narrow.** The only credential is the service-role key (`.env.local`, from `npm run
secrets:pull`). It reaches PostgREST, so a known table can be read; it cannot read
`information_schema`, so the schema cannot be enumerated from here. No psql, no `pg` package and
no supabase CLI are installed. `SUPABASE_DB` in `.env.local` is a 40-character value, not a
connection URL, and nothing in the repo reads it. **Nothing here may run DDL.**

## Where the brief binds
`brief/README.md` first. The pre-adoption brief was filed into `brief/` role folders on
2026-10-05 (the rest is in git history); the Yoros template's documents sit in `brief/research/`
as inputs, not binding. `config/site.ts` beats any brief about what is live.
