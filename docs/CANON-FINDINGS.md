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

### CF-1 · check-kit-drift's M-KIT-21 reports an un-ignored directory row as GITIGNORED
OBSERVED   check-kit-drift reported `nortiercupboards/brief/: this row is ADOPTED and GITIGNORED — `.gitignore:45:	brief/``. This repo's .gitignore line 45 is blank and nothing ignores brief/. thedecklab gets the identical line.
COMMAND    (2026-10-05, git 2.50.1.windows.1, in this repo)
           `git check-ignore -v "brief/"` → `.gitignore:45:	brief/`, exit 0 (an EMPTY pattern at a blank line, then a tab and the path)
           `git check-ignore -q "brief"`  → exit 1
           `git status --porcelain --ignored brief` → `?? brief/` (untracked, not ignored)
WHY IT IS  The check queries a directory row with its trailing slash, and on this git a trailing-slash
CANON'S    query matches a blank .gitignore line. Any adopter with a blank line in .gitignore hits it.
SMALLEST   Strip the trailing slash before `check-ignore` (or query a file the row wrote, such as
FIX        `brief/README.md`). It must still catch a real `brief/` rule: `brief` without the slash is
           matched by a `brief/` pattern only when the directory exists, which it does once apply-kit wrote it.

### CF-2 · check-claude-md ships pleks's ESLint prefix as the kit default
OBSERVED   `kit/project-kit/scripts/check-claude-md.mjs:187` has `ESLINT_CUSTOM_PREFIX = "pleks/"` inside `KIT:CONFIG resolvers`, so every adopter inherits another project's value.
COMMAND    `grep -n 'ESLINT_CUSTOM_PREFIX = ' kit/project-kit/scripts/check-claude-md.mjs` → `187:const ESLINT_CUSTOM_PREFIX = "pleks/"`
WHY IT IS  A region's default is canon's, and this one is a project value. yoros and this repo both had to set it to `""`.
CANON'S
SMALLEST   Ship `""`. pleks's copy carries its own region forward and does not change.
FIX

### CF-3 · apply-kit installs agent-facing hooks and commands but no `.claude/agents/`
OBSERVED   apply-kit wrote agent-write-scope, agent-brief-gate (configs listing 7 canon agents) and walk.md (which spawns walker, db-inspector, census), and no agent files. check-commands reports NOT MEASURED — no SPINE blocks under .claude/agents/.
COMMAND    `node scripts/check-commands.mjs` → `NOT MEASURED — no SPINE blocks under .claude/agents/, so no command was checked for restating one`
WHY IT IS  The probes pass against a table of agents this project does not have, so they are green over
CANON'S    the wrong subject, and /walk cannot run as written. Either the agents are a later phase and
           the kit should say so, or the kit row is missing.
SMALLEST   Say which: install the agents with the hooks, or have apply-kit name the agents as a deliberate
FIX        later step so the gap is visible rather than inferred.

### CF-4 · Token-economy tier 2 is a playbook row with no kit row
OBSERVED   3-TOKEN-ECONOMY.md lists `.claude/hooks/context-budget.js` and `scripts/check-context-budget.mjs` as tiers 2–3, but apply-kit has no row for either; this project copied both byte-for-byte from E:\dev\pleks.
COMMAND    `node E:/dev/dev-standards/tools/apply-kit.mjs nortiercupboards` → no `context-budget` row in the plan; `cp E:/dev/pleks/.claude/hooks/context-budget.js .claude/hooks/` then `node scripts/check-context-budget.mjs` → `✅ probes green`
WHY IT IS  A project-to-project copy has no drift check: when pleks fixes the hook, this copy never hears.
CANON'S    Both files ran green here unmodified, so they are portable as they stand.
SMALLEST   Add `context-budget` and `check-context-budget` as optional kit rows (`--with`), sourced from
FIX        pleks's current bytes; this project would then take them with `--carry-only`.

### CF-5 · `apply-kit --carry-only --write` carries from canon's working tree, mid-edit included
OBSERVED   2026-10-06, canon HEAD `003dad8` (bash-gate v13) with an uncommitted v14 being written. The carry
           wrote a bash-gate.probe.mjs headed `@kit … v13` that held 11 `v14` probe lines; the gate here
           went green on it. The inbox run straight after said canon's inputs were "rewritten during the
           run" and its result NOT ATTRIBUTABLE — but the carry itself had reported `✅ carried`.
COMMAND    `node E:/dev/dev-standards/tools/apply-kit.mjs nortiercupboards --carry-only --write` while
           canon was dirty, then `git -C E:/dev/dev-standards show 003dad8:kit/project-kit/hooks/bash-gate.probe.mjs | diff - .claude/hooks/bash-gate.probe.mjs`
           → 14 lines of v14 probes beyond canon's committed v13.
WHY IT IS  The carry is canon's tool and its bytes are canon's. A project cannot tell a hybrid from a
CANON'S    release: the version header said v13, the gate passed, and only a diff against canon's commit
           showed it. Caught here and the hybrid dropped from the commit (`55c5659`); v14 taken clean later
           (`22d3069`, canon `c4db289`).
SMALLEST   Make the carry read canon's committed bytes (`git show HEAD:<path>`), or refuse to write when a
FIX        carried row's source is dirty in canon — the same guard the inbox already has, applied before
           writing rather than after.

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
| `check-context-budget` | v1 | Adopted: canon's bytes (answers CF-4). | `cmp scripts/check-context-budget.mjs E:/dev/dev-standards/kit/project-kit/scripts/check-context-budget.mjs` → identical |

---

## Filed

A pointer, not a restatement — the canon entry is the record.

| # | Item | Filed as | Canon SHA |
|---|---|---|---|
