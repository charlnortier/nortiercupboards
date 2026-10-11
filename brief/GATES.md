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
| G-03 | Knowing the live config is complete | Are `RESEND_FROM`, `ADMIN_EMAIL` and `CRON_SECRET` set in Vercel production? Since 2026-10-05 the code is safe either way (real fallback addresses; the cron refuses to run without its secret), but if `CRON_SECRET` is unset the daily cron has stopped — check `cron_runs` or set it. Needs Vercel access. | Stéan | 2026-10-05 | an `EVIDENCE.md` line per variable |
| G-04 | Contact-form spam | Turnstile is decided (`DECISIONS.md`); it waits on a Cloudflare Turnstile site key and secret. Until then, honeypots and a fill-time check are the only guard, and a bot that passes them can still make the form send a confirmation email to any address it types. | Stéan | 2026-10-05 | the keys are in the secrets channel and Vercel |
| G-08 | Closing L-112 on production | Per the repo's migrations (live policies unmeasured), any stranger can sign up and make themselves admin (self-PATCH of `role`, or `role` in signup metadata); signup is measured open. Two steps, both in the Supabase dashboard: switch off "Allow new users to sign up" (the site has no customer accounts), and run `supabase/migrations/027_protect_user_role.sql` in the SQL editor, then its two verify queries. 027 stops new escalations but demotes nobody. | Stéan | 2026-10-11 | an `EVIDENCE.md` line with the verify output, `disable_signup=true`, and a re-read **after** applying of `user_profiles` admins and auth users showing only the two known ids (`bbd14d87`, `f6f5eb31`) |
| G-07 | What `SUPABASE_DB` is | Nothing reads it — keep, rename, or drop it from the secrets channel? | Stéan | 2026-10-05 | a DECISIONS row |

## Closed

| id | Closed | Answer |
|---|---|---|
| G-01 | 2026-10-05 | Deleted: every OFF feature's code removed (`DECISIONS.md`, 2026-10-05). |
| G-08 | 2026-10-05 | Green: dormant code deleted, `cmdk` and `framer-motion` uninstalled; `npm run check` exits 0 with all four tier-0 slots passing. |
| G-05 | 2026-10-05 | Moot: `/api/track/click` was deleted with the campaign code. |
| G-06 | 2026-10-05 | Checked: WhatsApp number, Maps embed (Paarl) and contact email are set in `site_settings`; DNS points at Vercel. Charl to confirm the number is current — not blocking. |
