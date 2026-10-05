# Project surface — shared notes for every agent

Not an agent file. The facts each agent's surface section draws on, kept once. Written
2026-10-05 at adoption and updated from the Phase 1 survey the same day. `brief/EVIDENCE.md` is
the source for every fact here, and wins when the two disagree.

## The check gate
`npm run check`. **Do not restate the step list anywhere; read `package.json`**, which is the
only copy that cannot go stale. It is GREEN as of
2026-10-05 (the three pre-adoption lint errors were fixed in `f6e9d83`), and it type-checks —
which matters because `next.config.ts` sets `ignoreBuildErrors`, so the build would not. Since the tier-0
slots were wired it is RED at `check:deadcode` (knip) and `check:cycles` (madge) on pre-existing
template code — `brief/GATES.md` G-08. Every step before `check:deadcode` must pass; a failure
there, or a knip/madge finding in a file you touched, is yours.

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
Scaffolded from the Yoros client template. `config/site.ts` sets tier `brochure` and most of the
template's features OFF: booking, shop, LMS, blog, newsletter, customer auth, portal, billing,
campaigns, Paystack. **Their code, routes, admin pages and migrations are still in the tree, and still reachable**:
no public page or API route checks its flag, and **a flag never disables a server action** — any
action a built component imports keeps a public endpoint. "Dormant" means no live UI, not
unreachable. Their tables exist in production and are empty.
Code under a disabled feature is not live behaviour — check `isEnabled()` (`config/features.ts`)
before reasoning about any of it. On: portfolio, i18n (`en`/`af`), dark mode, WhatsApp, Google
Maps, advanced SEO, legal docs, Google Analytics, Resend.

## SSOTs

| | |
|---|---|
| `config/site.ts` | Name, domain, tier, brand colours and fonts, locale, every feature flag. |
| `config/features.ts` | `isEnabled()` — the only correct way to ask whether a feature is on. |
| `lib/supabase/` | `server.ts`, `client.ts`, `admin.ts` (service role — bypasses RLS). |
| `lib/email.ts` | Email sending, Resend first and SMTP as the fallback. |
| `lib/cms/queries.ts` | Every read of the site's CMS content. |

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
