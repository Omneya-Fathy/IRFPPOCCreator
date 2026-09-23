---
description: Print IRFP run status (phase, approval, Vitest). Does not generate code.
---

You are reporting **IRFP run status**. Read-only.

Read `.cursor/skills/irfp-orchestrator/SKILL.md` only as needed to name the next command. Follow `AGENTS.md`.

Optional arguments (Jira key):
$ARGUMENTS

## Resolve key

1. Jira key: first `PROJECT-123` in the arguments, else the current git branch, else `gh pr view --json title,body`, else the newest folder under `pocs/`.
2. If no key: ask for `PROJ-123` and stop.

## Do this

1. `node scripts/irfp.mjs status --key <KEY>`. If there is no state, say so and tell the operator to run `/irfp-orchestrator`.
2. Reply with: key, phase, `approved`, `rfpFetched`, `vitestPassed` (if present), and the **next** command (`/irfp-answer`, `/irfp-feedback`, `/irfp-approve`, or wait).
3. If a GitHub PR exists, mention its number. Do not comment unless the operator asks.

## Forbidden

- Application source
- `mark-approved` or `mark-vitest`
- Launching **developer**
- Inventing business rules
