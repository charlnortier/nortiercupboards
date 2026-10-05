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
| 2026-10-05 | **The gate adds `tsc --noEmit`, `check-brief` and `check-claude-md`; knip, madge and a build step stay out for now.** `ignoreBuildErrors` means the build would deploy a type error, and tsc was already clean. Canon tier-0 stays red on the knip/madge slots by choice. |
| 2026-10-05 | **Push policy: `main` is the only branch; announce intent, then push; bash-gate asks every time.** Every push deploys the live site; no develop branch. |
| 2026-10-05 | **The repo stays on the client's GitHub account (`charlnortier`); the operator works as a collaborator.** |
| 2026-10-05 | **Token economy tier 2 is installed (`context-budget` hook and its check, from pleks); tier 1 (statusline) is not** — it is CLI-only and this project is worked in VS Code. |
| 2026-10-05 | **The pre-adoption brief is filed and the remainder retired.** `PROJECT_BRIEF`, `TECHNICAL_DESIGN`, brand, logo and mockups moved into `brief/`; the executed build plan, its superseded SQL, the duplicate logo PNG and `PROJECT_TODO.md` deleted (in git history before this commit). Supersedes `project-brief/`. |
| 2026-10-05 | **Reachable dormant code is recorded as a gate, not fixed now.** See `GATES.md` G-01. |
