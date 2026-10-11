#!/usr/bin/env node
/**
 * scripts/check-ci.mjs — the GitHub files still say what CLAUDE.md §3 claims they say.
 *
 * CLAUDE.md claims CI runs the SAME `npm run check` on every push to main and every PR, and that
 * Dependabot PRs are never auto-merged. Nothing else reads `.github/`, so without this a one-line
 * edit there could quietly make the claim false. It also gives check-scope a step that reads
 * `.github/**` (KIT:CONFIG scope → MAP), so a change there runs this and not the whole chain.
 *
 * Run: node scripts/check-ci.mjs            (the live files)
 *      node scripts/check-ci.mjs --selftest (a planted break must fail, the known-good must pass)
 */
import { existsSync, readFileSync } from "node:fs"

const CI = ".github/workflows/ci.yml"
const DEPENDABOT = ".github/dependabot.yml"

/** Returns what is wrong with the two files' text, or []. */
export function findings(ci, dependabot) {
  const out = []
  if (ci === null) return [`${CI} is missing`]
  if (!/^\s*(?:-\s*)?run:\s*npm run check\s*$/m.test(ci)) out.push(`${CI} does not run \`npm run check\` as a step`)
  if (!/push:\s*\n\s*branches:\s*\[\s*main\s*\]/.test(ci)) out.push(`${CI} does not run on push to main`)
  if (!/^\s*pull_request:/m.test(ci)) out.push(`${CI} does not run on pull requests`)
  if (dependabot === null) out.push(`${DEPENDABOT} is missing`)
  else if (/auto-?merge/i.test(dependabot.replace(/#.*$/gm, ""))) out.push(`${DEPENDABOT} configures auto-merge — a merge to main deploys`)
  return out
}

const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : null)

if (process.argv.includes("--selftest")) {
  const good = "on:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\nsteps:\n  - run: npm ci\n  - run: npm run check\n"
  const dep = "version: 2\n# never auto-merge\nupdates: []\n"
  let failed = 0
  const ok = (cond, label) => { if (!cond) failed++; console.log(`  ${cond ? "✓" : "✗"} ${label}`) }
  ok(findings(good, dep).length === 0, "KNOWN-GOOD: CI running the gate on push and PR passes (a comment naming auto-merge is fine)")
  ok(findings(good.replace("npm run check", "npm run lint"), dep).length === 1, "PLANTED: CI running a subset of the gate fails")
  ok(findings(good.replace("pull_request:", "workflow_dispatch:"), dep).length === 1, "PLANTED: CI without pull_request fails")
  ok(findings(good, "version: 2\nauto-merge: true\n").length === 1, "PLANTED: auto-merge in dependabot.yml fails")
  ok(findings(null, dep).length === 1, "PLANTED: a missing ci.yml fails")
  process.exit(failed ? 1 : 0)
}

const found = findings(read(CI), read(DEPENDABOT))
if (found.length) {
  console.log(`❌ check-ci:\n${found.map((f) => `  ${f}`).join("\n")}`)
  process.exit(1)
}
console.log("✅ check-ci: CI runs npm run check on push and PR; Dependabot never auto-merges")
