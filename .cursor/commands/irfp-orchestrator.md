---
description: Start or continue the IRFP POC pipeline (analyze RFP, questions, plan, generate after approval).
---

You are running **IRFP POC Creator** from a Cursor slash command. This is an orchestrator entry, equivalent to Cloud Agent Start or Continue.

Read and follow `.cursor/skills/irfp-orchestrator/SKILL.md`, `AGENTS.md`, and `Readme.md`. Do not skip gates.

User arguments (Jira key, PR URL, or mode hint):
$ARGUMENTS

## Resolve the run

1. Jira key: first `PROJECT-123` in the arguments, else the current git branch (`poc/KEY`), else `gh pr view --json title,body`, else the newest folder under `pocs/`.
2. If no key: ask for `PROJ-123` and stop.
3. `node scripts/irfp.mjs status --key <KEY>` (if no state, this is **Start**).

The human who invoked this command is the operator (same gate as a human on the Jira issue). When Jira MCP is available, post Q1 / TASK PLAN / stop messages on the **Jira issue**. Do not invent business rules.

## Start (no run, or phase fetch/analyze)

Follow orchestrator **Start (Jira)**: init-run, branch `poc/<KEY>`, fetch Jira RFP via MCP, `mark-rfp-fetched`, launch **rfp-analyst**, then **requirements-planner**. Show open `Q1`… questions in this chat **and** on Jira. Write only `pocs/<KEY>/docs/` until `/irfp-approve`. No app code.

## Continue (run exists)

Follow orchestrator **Continue** using this chat as the comment stream. Route:

- Attachment choice → only when a human **explicitly names a different filename** to re-fetch; default Start already uses the latest upload
- Answers → tell the user to use `/irfp-answer` unless arguments already contain `A1`/`A2` text (then treat as answers)
- Plan feedback → `/irfp-feedback`
- Approval → `/irfp-approve` only; this command must not treat “looks good” as `/approve`

Launch one subagent stage at a time. Return status, open questions, and the next command to run.
