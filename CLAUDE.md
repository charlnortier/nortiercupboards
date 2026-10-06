# CLAUDE.md — Nortier Cupboards

<!--
  Built from dev-standards kit/CLAUDE_TEMPLATE.md (CLAUDE-MD-STANDARD v4.5), 2026-10-05, at
  adoption. BINDING METRIC: the unenforceable ratio N of D, held by
  scripts/check-claude-md.mjs against scripts/check-claude-md.ceiling.json. N may only fall.
  Markers: @enforced <ns:id> as an inline comment at the end of the rule line; the
  UNENFORCEABLE word in bold with its reason; MECHANISABLE → M-0NN points into
  docs/MECHANISABLE.md. Harness experiments: docs/EXPERIMENTS.md (inherited from pleks).
  Full contract: E:\dev\dev-standards\standards\CLAUDE-MD-STANDARD.md.
-->

## 1 · START HERE

**Repo location.** `E:\dev\nortier\nortiercupboards` on this machine — never inside OneDrive (it
lived there until 2026-10-05; syncing `.git` and `node_modules` corrupts both). Canon's register
still records `C:/dev/nortier/nortiercupboards`; canon resolves it.

**`E:\dev\dev-standards` IS READ-ONLY FROM THIS SESSION.** **floor** — no mechanism in this repo can
see a write to a sibling checkout, so this is a claim about the world and it is held by you.

Read it freely: the playbooks, the standards, the kit, `ledgers/LESSONS.md`. Write nothing — not the
kit, not `tools/`, not a MANIFEST version, not `ledgers/projects.json`, not `kitAdopted`. Never run
`apply-kit --write` (the dry run is read-only and is the right way to read the plan), except the
`--carry-only --write` upgrade named below, which writes only this tree.

**A finding about canon is worth more than a fix to canon.** Write it to `docs/CANON-FINDINGS.md`
and let the estate session make the change — OBSERVED · COMMAND · WHY IT IS CANON'S · SMALLEST FIX.
A finding carried only in a chat report goes undelivered.

**First moves, before touching code:**

```bash
git status        # never assume this machine is current
git fetch && git log --oneline HEAD..origin/main
git pull
npm run secrets   # compare the secrets channel, change nothing
```

**The secrets channel.** Git deliberately does not carry `.env.local` or
`.claude/settings.local.json`. They live in `~/OneDrive/dev-secrets/nortier/nortiercupboards/`
(override: `NORTIERCUPBOARDS_SECRETS_DIR`) and move with `scripts/sync-secrets.mjs`: `status` ·
`pull` (after a clone, or when another machine changed a key) · `push` (after YOU change one).
**A machine that has never had the repo:** clone to `E:\dev\nortier\nortiercupboards` →
`npm install` (by you, not an agent shell) → `npm run secrets:pull` → `npm run check`.
There is no bootstrap installer in the channel yet.

**Session state:** `brief/CURRENT.md`. Read it before asking; it survives compaction.
**Canon's inbox:** `node E:/dev/dev-standards/tools/inbox.mjs nortiercupboards` — handovers,
kit drift, tier 0, spines, open lessons. Answer what you owe in `docs/CANON-FINDINGS.md`. The
`canon-inbox` hook prints the short form at session start; a plain upgrade is taken with
`node E:/dev/dev-standards/tools/apply-kit.mjs nortiercupboards --carry-only --write`, then the
gate, then a commit.

---

## 2 · WHAT THIS PROJECT IS, AND HOW TO REACH ITS SYSTEMS

A brochure site for Nortier Cupboards (custom cupboards, Paarl) at `nortiercupboards.co.za`, built
on the Yoros client template: Next 16, Supabase, Resend, Vercel. Its job is turning visitors into
contact-form leads. The template's other features (booking, shop, LMS, blog, portal, payments,
campaigns) were deleted on 2026-10-05 and will not return; their tables stay in production, empty.

| System | Reach it by | Note |
|---|---|---|
| Database | `db-inspector` (PostgREST, service key from `.env.local`) | **the one Supabase project is production** — there is no staging |
| Deploys | Vercel MCP, when connected | every push to `main` deploys |
| Repo | `gh` / GitHub MCP | `github.com/charlnortier/nortiercupboards` — the client's account; the operator is a collaborator |

---

## 3 · THE GATES

| Gate | Command |
|---|---|
| Before every commit | `npm run check` |
| Before every push | `npm run check` green, then `/walk` on the range |
| Before every deploy | a deploy IS a push to `main` — the push gate is the deploy gate |

**Push policy: `main` only; announce intent, then push.** `bash-gate` asks on every push to `main`.

**Hook-denied** (bash-gate): force pushes and `+refspec`, `npm publish`, agent commits/pushes.
**Hook-asked:** push or merge to `main`, `supabase db push|reset`, `setup-db.sh`, `psql`, hard
reset, `git clean -f`, PR merge.
**Settings-ask twins:** the same patterns in `.claude/settings.json`, dormant while the hook lives.

Approval-gated actions sequence to the **end** of a task. Run the check after each logical change.

---

## 4 · WHERE THE RULES LIVE

| Family | Where |
|---|---|
| ESLint rules | `eslint.config.mjs` (next core-web-vitals + typescript; no custom rules) |
| Audit checks | `npm run check` — `check:hooks`, `check:agents`, `check:brief`, `check:claude-md`, `typecheck`, `lint` |
| Hooks + twins | `.claude/hooks/` + `.claude/settings.json` (`ask` twins) |
| Tests | none — there is no test runner |
| Commands | `/walk` (adversarial pre-push review; does not push) · `/wrap` (end-of-session registers; does not push unasked) |
| Rule files | none |

**Where a new rule goes — what does it cost the day the model ignores it once?** Annoyance →
prose here. Incident → a hook and/or a check, plus a settings twin at `ask`, plus probes —
**probe first, both directions: a planted violation must fail AND a known-good case must pass.**
If it concerns one file, it goes in that file as a comment.

**Precedence:** mechanisms enforce, they don't assert. Prose contradicting a green check is stale
prose — report it, don't act on it.

### Enforced

- **A push or merge to `main` is a deployment to the live site and asks first; force pushes are denied.** <!-- @enforced hook:bash-gate:shared -->
- **Nothing runs `supabase db push|reset`, `setup-db.sh` or `psql` without asking — the only database is production, and `supabase/seed.sql` wipes the client's nav, footer and FAQs.** <!-- @enforced hook:bash-gate:shared -->
- **A subagent writes only its artefact under `.handoff/`, and never commits or pushes.** <!-- @enforced hook:agent-write-scope -->
- **Every spawn names its artefact and asks for nothing inline; `Explore` and `general-purpose` are refused.** <!-- @enforced hook:agent-brief-gate -->
- **A type error fails the gate** — `next.config.ts` sets `ignoreBuildErrors`, so the build will not catch it. <!-- @enforced check:typecheck -->
- **`brief/` stays conformant: every document filed in a role folder and indexed.** <!-- @enforced check:check-brief -->
- **The context size is in view every turn.** <!-- @enforced hook:context-budget -->

---

## 5 · DOCTRINE THE MACHINE CANNOT HOLD

- **Every email send on a request path is awaited or inside `after()` — Vercel drops an un-awaited promise when the response returns.** **UNENFORCEABLE** — MECHANISABLE → M-001.
- **Every `"use server"` export that uses `createAdminClient` checks its caller with `ensureAdmin`, unless it is public by design (contact form, password reset).** A feature flag does not disable a server action. **UNENFORCEABLE** — MECHANISABLE → M-002.
- **Never write the client's site copy.** Copy lives in the database and is edited by the client at `/admin`; a change to what a page says is a data change the client makes. **UNENFORCEABLE** — the copy is rows, not files, so no code artefact sees it.
- **A new user-facing string exists in both `en` and `af`.** **UNENFORCEABLE** — most strings are `{ en, af }` database values, outside anything a check reads.
- **`config/site.ts` decides what is live; a brief describing a feature does not.** **UNENFORCEABLE** — a judgement about which document to believe.

---

## 6 · SCARS

- **2026-10-02 and 2026-10-04 · dropped email on Vercel.** Cost: two real leads — the contact form
  saved the submission but the admin notice and the visitor's confirmation were sent un-awaited and
  died when the response returned, so nobody knew the leads existed. Fixed in `47b597b` with
  `after()`. Un-mechanised → M-001; the walker checks it on every walk.
- **2026-10-05 · unauthenticated service-role server action.** Cost: none known — found by the
  adoption survey, not by an attacker. `lib/storage.ts` let anyone upload to or delete from any
  storage bucket. Fixed in `5d8c906`. Un-mechanised → M-002.

---

## 7 · AGENTS

| Agent | For | Access |
|---|---|---|
| `grounder` | Before writing code: map the machinery a task touches | one artefact, hook-scoped |
| `census` | Repo-wide counts / find-all-usages, returned **classified** | one artefact, hook-scoped |
| `db-inspector` | Live-data claims; every answer carries its query | one artefact + GET-only PostgREST against **production** |
| `implementer` | Pre-scoped mechanical transform | declared scope, **main checkout**, never commits |
| `walker` | Adversarial pre-push review — tries to **refute** | one artefact, hook-scoped |
| `scout` | "Go find out X" when no pipeline step fits — replaces `Explore` and `general-purpose` | one artefact, hook-scoped |
| `crawler-doctrine` | Drift between the brief and the build | one artefact |

**"Read-only" is not a thing an agent can be** (E8): `tools:` is a grant, not a fence. What bounds
them is `agent-write-scope`. **Never spawn the implementer with `isolation: "worktree"`** (E10).

Every agent's reply ends with the fixed block — `Agent / Verdict / Summary / Artefact / Promote` —
and the brief names the artefact:

```
pipeline: P3 · step 1 of 1 · artefact: .handoff/<task-slug>/01-scout.md
<the question, and any input artefact to read first>
```

Relay the block; open the artefact only at the section it names. Shared facts the agents use are in
`.claude/agents/_SURFACE.md`. **Classify per site, never sweep.**

---

## 8 · SESSION HYGIENE

**Read the actual source files before writing code.** **Anchor grounding claims** to the SHA read.
**Verify before you tick** — a commit message proves attempt, not landing. **Citations verified,
not plausible** — a zero-hit grep is the check. **Commit ≠ push**: one coherent revertable change
per commit; here a push is also a deploy. **Ambiguous spec or spec-vs-code conflict:** flag and
stop.

---

## 9 · PROJECT SLOTS

**SSOTs — never restate values here:**

| What | File |
|---|---|
| Live features, brand, locales, currency, timezone | `config/site.ts` (read flags through `isEnabled`, `config/features.ts`) |
| Site copy | the database, read through `lib/cms/queries.ts` |
| Email | `lib/email.ts` (`sendEmail`, `notifyAdmin`, `sendRawEmail`) |
| Admin check | `lib/admin/auth.ts` `ensureAdmin` |
| Facts about the live system | `brief/EVIDENCE.md` |

**What does not live in code:**
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS on the production database — every use is a production
  write path.
- `RESEND_FROM` / `ADMIN_EMAIL` unset → `lib/email.ts` falls back to the site's real addresses and
  logs an error. Confirm both are set in Vercel (G-03).
- `CRON_SECRET` unset → `/api/cron/daily` refuses to run (503), so the cron silently stops.
- `SUPABASE_DB` in the secrets channel is read by nothing in the repo; purpose unconfirmed.

**Naming:** kebab-case files; `lib/<domain>/{actions,queries}.ts`; public pages are a server
`page.tsx` passing CMS data to a client `components/<domain>/*-content.tsx`.

**Gotchas:**
1. Two site-URL env vars (`NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_URL`) for one concept; ~25
   copy-pasted fallbacks.
2. No date helper: dates are formatted inline with `toLocaleDateString("en-ZA")`, and two admin sites
   use the browser's locale.
3. 25 admin files write from the browser client, so RLS is their only control — unexamined.
4. The contact form's rate limit is in memory, per Vercel instance — not a real limit.
