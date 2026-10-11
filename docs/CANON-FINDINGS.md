# CANON-FINDINGS — what this project owes `dev-standards`

<!-- Kit row `canon-findings`, a TEMPLATE: yours after the copy, and never compared. Modelled on
     pleks's, which opened the first one on 2026-09-10 after a finding carried in a chat report went
     a session undelivered. -->

`dev-standards` is **read-only from this session** (`CLAUDE.md` §1), so anything owed to it is
written here, ready for an estate session to lift **verbatim**. Three things are owed to it, and
each has a section.

**This is an OUTBOX, not a register.** An item leaves when canon files it and drops to **Filed**
with the canon SHA that took it. An empty outbox is the healthy state.

⚠ **Never write "pending" anywhere canon will read.** `LESSONS.md`'s `Applied:` has exactly two
states — a date, or `n/a:` with a reason. A lesson you have not answered is not a value; it is an
open item in this project's queue, and it stays in the `--emit-open` list until it is answered.

---

## 1 · Findings about the method

A defect in canon — a playbook, a standard, a kit file, a check. The portability test decides
whether it belongs here or in this project's own scars: *would it still be true on a repo with a
different stack?*

```
### CF-1 · <the claim, in one line>
OBSERVED   what happened, in one sentence
COMMAND    what you ran, and its output verbatim
WHY IT IS  why it is the method's defect and not this project's
CANON'S
SMALLEST   the narrowest fix, and what it must not break
FIX
```

### CF-6 · `/walk` asks for upstream artefacts by path; check-handoff-contract refuses them
```
OBSERVED   walk.md step 2 briefs the walker with "the upstream artefacts it may read, by path".
           The walker listed .handoff/l112-role-escalation/01-db-inspector.md under ## Inputs,
           and the commit gate failed.
COMMAND    node scripts/check-handoff-contract.mjs
           → .handoff/walk-l112/01-walker.md: `## Inputs` names .handoff/l112-role-escalation/
             01-db-inspector.md — another task directory; a chain is walked inside one task
WHY IT IS  Both files are kit (walk v1, check-handoff-contract v9). Every walk of work that had
CANON'S    its own pipeline hits this, on any stack.
SMALLEST   Let ## Inputs name another task's artefact if it exists and its anchor resolves (an
FIX        upstream input, not a chain step), or have walk.md say upstream artefacts are cited
           outside ## Inputs. Must keep refusing a same-task chain that points at nothing.
           Worked around here by citing the artefact in prose (walk-l112/01-walker.md).
```

### CF-7 · `## Inputs` parsing reads a date-prefixed out-of-tree filename as a chain step
```
OBSERVED   An Inputs line naming E:/dev/dev-standards/docs/handovers/2026-10-11-nortiercupboards-
           role-self-assign.md was read as step file "11-nortiercupboards-role-self-assign.md".
COMMAND    git commit (pre-commit → check:agents)
           → `## Inputs` names 11-nortiercupboards-role-self-assign.md, which is not in
             .handoff/walk-l112/ — the chain points at nothing
WHY IT IS  inputsOf() matches NN-<name>.md anywhere in the line; canon's own handover names are
CANON'S    date-prefixed, and the inbox tells every project to read them.
SMALLEST   Match only a bare `NN-agent.md` or a `.handoff/`-rooted path, not a suffix inside an
FIX        absolute path. Must still catch `.handoff/<slug>/NN-x.md`.
```

---

## 2 · Lesson answers

From `node <canon>/tools/check-lessons.mjs --emit-open <project>`. Read the entry before answering.
A date is the day this project's tree came to carry the lesson, with the evidence that shows it; a
reasoned `n/a:` closes an item as surely as a date. "Not yet" is not an answer — leave the lesson
off this table and it stays open.

| Lesson | Answer — `YYYY-MM-DD` or `n/a: <reason>` | Evidence — SHA, path or command |
|---|---|---|
| L-108 | n/a: no validator or normaliser here has a fast path for already-formed input. The one input validator is the contact form's (`lib/contact/actions.ts`), a single path; there is no date helper (CLAUDE.md §9 gotcha 2). That is a name search, not a proof. | `git grep -nE "normali[sz]e\|fast ?path\|already (canonical\|formed)\|isNaN\(new Date" -- app lib components` → 0 hits, at `672ccf9` |
| L-109 | n/a: nothing accepts a pre-existing value as proof. The two values that open something are minted for it: the password-reset token (`crypto.randomBytes`, stored hashed, `lib/auth/password-reset.ts:4-10`) and Supabase's own `code`/`token_hash` (`app/auth/callback/route.ts:6-7`). The contact form returns no reference. | `git grep -nE "token\|searchParams\.get" -- app lib`, at `672ccf9` |
| L-110 | 2026-10-11 — L-112's fix changed what `user_profiles.role` means (who may write it), so its readers were censused before the push, not only the diff walked: `ensureAdmin`, `/api/auth/role`, the admin layout, `getCurrentUser`, `custom_access_token_hook` → `is_admin()`; no reader of `user_metadata.role` remains. | `b613b4c`. The census (walk-l112 step 2, run at `b613b4c`) is quoted here because `.handoff/` is not kept. **Writes of `role`:** 3 hard-coded `customer` (the `getCurrentUser` insert; 027's `handle_new_user`; 027's trigger); 2 user-controlled, both in 002 (`handle_new_user` from metadata; the self update/insert policies), "closed by 027 IF APPLIED"; 2 admin-only (instruction text in `setup-db.sh` and `seed.sql`). **Authz reads, 4:** `ensureAdmin`/`requireAdmin`, `app/admin/layout.tsx`, `app/admin/account/page.tsx`, and `is_admin()` via the hook's `user_role` claim. **Display reads, 2:** `/api/auth/role`, `login-form.tsx`. **Other `user_profiles` writes, 3:** `lib/auth/actions.ts` (full_name, phone), `password-reset.ts` (password_changed), 011's last_login_at. None of them sets `role`. Known positive: `queries.ts` `role: "customer"` was found. |
| L-111 | 2026-10-11 — the role guard refuses rather than rewrites: `027_protect_user_role.sql` raises `42501` on a role change from `authenticated`/`anon` instead of resetting the value. `handle_new_user` writing `'customer'` is the lesson's allowed case: a create, with no stored value to erase. | `b613b4c` |
| L-112 | 2026-10-11 — the condition held in the tree (002_auth.sql:34-38, :44, :70, unchanged). Tree fixed: `027_protect_user_role.sql` (blindly 041, adapted), plus a fourth route canon's handover did not name: `lib/auth/queries.ts` `getCurrentUser` re-created a missing profile through the **service-role** client with `role` from `user_metadata`, which the user writes via `auth.updateUser` and which the trigger cannot see. **Production is not yet closed**: 027 waits on the operator's SQL editor, and signup is open (G-08). Live state: 2 users, both admin, no `role` in metadata — no sign of use. `pg_policies`/`pg_trigger` are not readable over PostgREST, so the live policies are unmeasured until 027's verify queries run. For L-112's own text (walk-l112 finding 2): a role guard closes the door but evicts nobody — the close condition should re-read the privileged set (admin rows, auth users) **after** applying, not only verify the guard exists. | `b613b4c` (027 + `lib/auth/queries.ts`); the live measurement is kept in `brief/EVIDENCE.md` § The live system, line "Admin escalation (L-112)". Quoted from it: `GET /auth/v1/settings` → `disable_signup=false`, email only, confirmation required. `GET /rest/v1/user_profiles?select=id,email,role,created_at,updated_at` → 2 rows, both `admin` (`bbd14d87`, `f6f5eb31`). `GET /auth/v1/admin/users` → the same 2 users; metadata keys `email_verified` only. `GET /rest/v1/pg_policies` and `/pg_trigger` → 404, so live policies are unmeasured. Production is open until `brief/GATES.md` G-08 closes. |

---

## 3 · Kit reports

Adoptions canon has to record in `kitAdopted`, and pins: a row deliberately behind canon, with the
row id, the version held, the reason, and a review date. A pin means *read and deliberately behind*,
never *exempt*, so the reason has to argue it.

| Row | Version | What | Evidence |
|---|---|---|---|
| `context-budget` | v1 | Adopted: canon's bytes, its default thresholds unchanged (answers CF-4). | `cmp .claude/hooks/context-budget.js E:/dev/dev-standards/kit/project-kit/hooks/context-budget.js` → identical |
| `check-scope` | v2 | Adopted by hand (`apply-kit --write` is off-limits here): canon's bytes, KIT:CONFIG `scope` at canon's defaults — `BRANCH_GUARD = false`, `MAP = {}`. Answers handover 2026-10-09 §1. | `cmp scripts/check-scope.mjs E:/dev/dev-standards/kit/project-kit/scripts/check-scope.mjs` → identical; `node scripts/check-scope.mjs --wired` green |
| `githook-pre-commit` | v1 | Adopted by hand, canon's bytes; `prepare` sets `core.hooksPath`. | `cmp .githooks/pre-commit E:/dev/dev-standards/kit/project-kit/githooks/pre-commit` → identical |
| `githook-pre-push` | v1 | Adopted by hand, canon's bytes. | `cmp .githooks/pre-push E:/dev/dev-standards/kit/project-kit/githooks/pre-push` → identical |
| `lint` | — | Not taken (handover §2): lint stays serial; measured 11.1s → 10.7s with `ESLintPoorConcurrencyWarning`. | handover 2026-10-09 |
| `check-context-budget` | v1 | Adopted: canon's bytes (answers CF-4). | `cmp scripts/check-context-budget.mjs E:/dev/dev-standards/kit/project-kit/scripts/check-context-budget.mjs` → identical |

---

## Filed

A pointer, not a restatement — the canon entry is the record.

| # | Item | Filed as | Canon SHA |
|---|---|---|---|
| CF-1 | check-kit-drift M-KIT-21 reports an un-ignored directory row as GITIGNORED | outbox triage | 1ae8c14 |
| CF-2 | check-claude-md shipped pleks's ESLint prefix as the kit default | outbox triage — the region now ships `""` | 1ae8c14 |
| CF-3 | apply-kit installs agent-facing rows but no agents | outbox triage — agents are a later phase, and the run says so | 1ae8c14 |
| CF-4 | Token-economy tier 2 had no kit row | `context-budget` + `check-context-budget` optional rows | 3169e64 |
| CF-5 | carry-only copied canon's uncommitted edits | apply-kit `--carry-only` refuses while canon is mid-edit | 68572a9 |
