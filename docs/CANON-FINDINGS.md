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

*None open — CF-1 to CF-5 were taken by canon; see Filed.*

---

## 2 · Lesson answers

From `node <canon>/tools/check-lessons.mjs --emit-open <project>`. Read the entry before answering.
A date is the day this project's tree came to carry the lesson, with the evidence that shows it; a
reasoned `n/a:` closes an item as surely as a date. "Not yet" is not an answer — leave the lesson
off this table and it stays open.

| Lesson | Answer — `YYYY-MM-DD` or `n/a: <reason>` | Evidence — SHA, path or command |
|---|---|---|

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
