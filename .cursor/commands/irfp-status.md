---
description: Print IRFP run status (phase, qaLoopCount, approval, Vitest). Does not generate code.
---

You are reporting **IRFP run status**. Read-only.

Read-only. Do not load the orchestrator skill unless you cannot name the next command from `status` JSON.

Optional arguments (Jira key):
$ARGUMENTS

## Resolve key

1. Jira key: first `PROJECT-123` in the arguments, else the current git branch (`poc/KEY`), else `gh pr view --json title,body`, else the newest folder under `pocs/`.
2. If no key: ask for `PROJ-123` and stop.

## Do this

1. `node scripts/irfp.mjs status --key <KEY>`. If there is no state, say so and tell the operator to run `/irfp-orchestrator` (or move the Jira issue to **Ready for POC** for Cloud).
2. Reply with: key, phase, `qaLoopCount`, `humanReviewRequired`, `approved`, `rfpFetched`, `vitestPassed` (if present), durable path `docs/run-state.json`, and the **next** command (`/irfp-answer`, `/irfp-feedback`, `/irfp-approve`, wait for Ready for POC, or human review).
3. If a GitHub PR exists, mention its number (from `mark-pr-linked` / `gh pr list`). Do not comment unless the operator asks.

## Forbidden

- Application source
- `mark-approved` or `mark-vitest`
- Launching **developer**
- Inventing business rules
