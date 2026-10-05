# Gates

> Everything that cannot move without a decision from a person. **Nothing else lives here** — not
> the plan, not progress, not what was built.
>
> The **open since** column is the point: a gate nobody is chasing has quietly become a decision to
> do nothing.
>
> The row below is the shape, not a gate — `G-nn` is deliberately not a number, so the checker does
> not read it as one. Real rows start at `G-01`.

| id | Blocked | The question | Owner | Open since | Closes when |
|---|---|---|---|---|---|
| G-02 | Trusting the browser-side admin writes | Do the RLS policies on the 25 browser-written admin tables restrict writes to admins? Needs the migrations' policies read and the live ones confirmed. | Stéan | 2026-10-05 | an `EVIDENCE.md` line, either way |
| G-03 | Knowing the live config is complete | Are `RESEND_FROM`, `ADMIN_EMAIL` and `CRON_SECRET` set in Vercel production? Unset, admin notices go to example.com and the cron is open. Needs Vercel access. | Stéan | 2026-10-05 | an `EVIDENCE.md` line per variable |
| G-04 | Contact-form spam | Keep honeypot plus in-memory rate limit, or add CAPTCHA / a persistent limit? The form can mail arbitrary third parties. | Stéan | 2026-10-05 | a DECISIONS row |
| G-05 | The open redirect | Restrict `/api/track/click` to own and allow-listed hosts, or remove it while campaigns are off? | Stéan | 2026-10-05 | a DECISIONS row |
| G-06 | Live site details | Are the WhatsApp number and Google Maps URL in admin settings the real ones, and does DNS point at Vercel? (carried from `PROJECT_TODO.md`) | Stéan / Charl | 2026-10-05 | an `EVIDENCE.md` line |
| G-07 | What `SUPABASE_DB` is | Nothing reads it — keep, rename, or drop it from the secrets channel? | Stéan | 2026-10-05 | a DECISIONS row |

## Closed

| id | Closed | Answer |
|---|---|---|
| G-01 | 2026-10-05 | Deleted: every OFF feature's code removed (`DECISIONS.md`, 2026-10-05). |
| G-08 | 2026-10-05 | Green: dormant code deleted, `cmdk` and `framer-motion` uninstalled; `npm run check` exits 0 with all four tier-0 slots passing. |
