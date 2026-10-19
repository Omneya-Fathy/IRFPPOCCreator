---
description: Start or resume the IRFP POC pipeline (Ready for POC First fetch / Resume; generate after /irfp-approve).
---

You are running **IRFP POC Creator** from a Cursor slash command. This is an orchestrator entry, equivalent to the Cloud Agent **Ready for POC** path (Desktop may drive without a status webhook).

Follow `.cursor/skills/irfp-orchestrator/SKILL.md`. Do not re-read `Readme.md`. Do not skip gates.

User arguments (Jira key, PR URL, or mode hint):
$ARGUMENTS

## Resolve the run

1. Jira key: first `PROJECT-123` in the arguments, else the current git branch (`poc/KEY`), else `gh pr view --json title,body`, else the newest folder under `pocs/`.
2. If no key: ask for `PROJ-123` and stop.
3. `node scripts/irfp.mjs ensure-run --key <KEY>` — **`route: start`** if `docs/run-state.json` is missing (First fetch); **`route: resume`** if durable state has `rfpFetched` true.

The human who invoked this command is the operator (same gate as a human on the Jira issue). When Jira MCP is available, post Q1 / TASK PLAN / stop messages on the **Jira issue**, and transition to **In Review** after questions when you can. Do not invent business rules.

Durable state: `pocs/<KEY>/docs/run-state.json` — commit and push on `poc/<KEY>` after each Q&A round so Cloud runs stay in sync.

## First fetch (`route: start`)

Follow orchestrator **Ready for POC → First fetch**. After questions: commit/push docs, transition to **In Review**. Write only `pocs/<KEY>/docs/` until `/irfp-approve`. No app code.

## Resume (`route: resume`)

Follow orchestrator **Ready for POC → Resume**. Use this chat and/or Jira comments as the human thread. Route:

- Attachment choice → only when a human **explicitly names a different filename** to re-fetch
- Answers → tell the user to use `/irfp-answer` unless arguments already contain `A1`/`A2` text (then treat as answers)
- Plan feedback → `/irfp-feedback`
- Approval → `/irfp-approve` only; this command must not treat “looks good” as `/approve`
- More blocking Qs → honor `qaLoopCount` max 3; then human-review stop

Launch one subagent stage at a time. Return status, `qaLoopCount`, open questions, and the next command to run.
