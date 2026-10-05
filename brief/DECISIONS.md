# Decisions

> One row per settled question. Append at the bottom. **A reversed decision is struck through, not
> deleted** — the record of a closed gate is what stops it being re-asked.
>
> **Sweep past 40 rows** — every table row, dated or not. Apply the test to each: does this row still
> govern anything — a file in the tree, or work still queued — with nothing since having superseded
> it? A row fails only on evidence: its subject retired, its work cancelled, or a later row
> superseding it. Unbuilt work and "don't" rulings still bind. Move the rows that fail it to
> `_ARCHIVE/DECISIONS-<YYYY-MM>.md`, then record the sweep as a line (not a table row) below the
> table: `**Swept:** YYYY-MM-DD — N of M rows still bind` — M tested, N kept, and the log then holds
> exactly N. There is no size limit on this file (BRIEF-STANDARD §2.4, §7).

| Date | Decision |
|---|---|
| 2026-10-05 | **This repo adopts dev-standards (Session B).** Kit, hooks, agents and the brief spine; findings about canon go to `docs/CANON-FINDINGS.md`. |
| 2026-10-05 | **The unauthenticated storage actions are fixed now, outside the adoption, in their own commit.** `lib/storage.ts` let anyone write to storage (`EVIDENCE.md`, Dangers); fixed in `5d8c906`, walker-reviewed. |
| 2026-10-05 | **The three pre-adoption lint errors are fixed, not baselined.** Separate commit `f6e9d83`; the gate is green from here. |
| 2026-10-05 | ~~**The gate adds `tsc --noEmit`, `check-brief` and `check-claude-md`; knip, madge and a build step stay out for now.**~~ Superseded below. `ignoreBuildErrors` means the build would deploy a type error, and tsc was already clean. Canon tier-0 stays red on the knip/madge slots by choice. |
| 2026-10-05 | **Push policy: `main` is the only branch; announce intent, then push; bash-gate asks every time.** Every push deploys the live site; no develop branch. |
| 2026-10-05 | **The repo stays on the client's GitHub account (`charlnortier`); the operator works as a collaborator.** |
| 2026-10-05 | **Token economy tier 2 is installed (`context-budget` hook and its check, from pleks); tier 1 (statusline) is not** — it is CLI-only and this project is worked in VS Code. |
| 2026-10-05 | **The pre-adoption brief is filed and the remainder retired.** `PROJECT_BRIEF`, `TECHNICAL_DESIGN`, brand, logo and mockups moved into `brief/`; the executed build plan, its superseded SQL, the duplicate logo PNG and `PROJECT_TODO.md` deleted (in git history before this commit). Supersedes `project-brief/`. |
| 2026-10-05 | ~~**Reachable dormant code is recorded as a gate, not fixed now.**~~ Superseded below. |
| 2026-10-05 | **The gate also runs knip (`check:deadcode`) and madge (`check:cycles`), filling canon's four tier-0 slots; there is still no build step.** Canon needs the slots wired, not passing, and both are red on existing code. Settling that is G-08. Supersedes the "knip, madge … stay out" row. |
| 2026-10-05 | **Every feature not active today will never be: their code is deleted, their migrations and production tables are kept.** Operator ruling; closes G-01. Non-admins who sign in are signed out; signed-in users on `/login` go to `/admin`; the "Open your portal" email link is gone. Data leftovers (unused `page_seo`, `email_templates` rows, unused env vars) are not touched. |
| 2026-10-05 | **Missing email or cron env vars fail safe: email falls back to the site's real addresses with a logged error; the cron refuses to run without `CRON_SECRET`.** Narrows G-03 to confirming the values. |
| 2026-10-05 | **Contact-form spam defence: two honeypots (`website`, `subject`, labelled as required) plus a 3-second fill-time check measured in the browser, now; Cloudflare Turnstile to follow (G-04).** A trapped submission gets the normal success reply and nothing is saved or sent. |
