# Build

> **follow** — how the thing is made. Bands are reserved, not required — an absent band means never applicable, not forgotten.

| File | What it settles |
|---|---|
| `INDEX.md` | What is built, in what order. ≤ 40 KB. |

## Reserved bands

`00` cross-cutting · `10` foundation · `20` SSOT · `30` data · `40` auth · `50` surfaces ·
`60` content · `70` integrations · `80` operations · `90` release

`90-release.md` has a grammar when someone pays for the work: milestones, budget, delivery date and
a change log, which `scripts/delivery-report.mjs` turns into the payer's report (dev-standards
DELIVERY-STANDARD §2).

Amendments number under what they amend — `20.1-ssot-cutover.md` sorts beneath `20-ssot.md`.
No two documents may claim the same number.
| `10-technical-design.md` | Architecture, schema, route map and DNS as designed before the build (pre-adoption, filed unchanged). **Stale in part**: says Next "14+" (it is 16), `/gallery` (it is `/portfolio`), a bespoke schema (the tree runs the 26 template migrations) — `EVIDENCE.md` wins |
