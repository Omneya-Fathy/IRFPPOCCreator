---
description: Approve the IRFP TASK PLAN and run generate → review → Vitest → push (same gate as PR /approve).
---

You are recording **operator approval** of the IRFP task list, equivalent to a PR-author `/approve` comment.

Read `.cursor/skills/irfp-orchestrator/SKILL.md`. Follow `AGENTS.md` and `Readme.md` hard rules.

Optional arguments (Jira key or notes — notes are not extra scope):
$ARGUMENTS

## Resolve key

Jira key from arguments, else current branch / `pocs/` run. If missing, ask and stop.

## Gate

1. `node scripts/irfp.mjs status --key <KEY>`.
2. Require `pocs/<KEY>/docs/task-plan.md` and `docs/technical-plan.md`. If blocking questions in `ambiguity-log.md` are still open, stop — use `/irfp-answer` first.
3. Only the human who invoked this command may approve in Cursor. Do not approve from memory or from an agent-written “looks good”.
4. `node scripts/irfp.mjs mark-approved --key <KEY>`.
5. If a GitHub PR exists, comment `/approve` as the operator record. Continue even if comment fails; the stamp is the gate.

## Generate

Follow orchestrator **Generate after `/approve`** in order, one subagent at a time:

1. **developer** — `scaffold-poc` then retokenize scaffold UI and implement under `pocs/<KEY>/` from the approved plan. No invented rules.
2. **reviewer** — write `docs/review-report.md`. Stop on any hard-rule fail.
3. **tester** — Vitest in the POC directory; `mark-vitest --passed true` only when green; then commit app + docs.

Push to the existing PR branch if this run is on a PR. Never `--force`. Never open a second PR. Do not push if Vitest failed.
