---
description: Answer open IRFP RFP ambiguities (A1, A2, …). Updates the log and plan; does not generate app code.
---

You are recording **PR-author / operator answers** to IRFP blocking questions.

Read `.cursor/skills/irfp-orchestrator/SKILL.md` and `.cursor/skills/generate-tasks/SKILL.md`. Follow `AGENTS.md`.

Answers from the user (map to `A1`, `A2`, … if they did not number them):
$ARGUMENTS

## Resolve key

Jira key from arguments, else `node scripts/irfp.mjs status` against the current branch / `pocs/` folder. If missing, ask and stop.

## Do this

1. Read `pocs/<KEY>/docs/ambiguity-log.md` and `docs/rfp-brief.md`. If the log is missing, stop.
2. Apply only what the user stated. Do not invent unanswered rules. Do not treat this as `/approve`.
3. Launch **requirements-planner** (`subagent_type: requirements-planner`) with: `You are the Requirements Planner. Jira key: <KEY>. Record these operator answers and update the plan docs.` Include the numbered A-lines.
4. Planner updates `docs/ambiguity-log.md`. When all blocking questions are answered, update `technical-plan.md` and `task-plan.md`, then `set-phase --phase plan`.
5. If a GitHub PR exists for this branch, comment the same `A1`… answers (operator is the author analogue). Skip if `gh` fails; docs remain source of truth.
6. Reply with: which questions are now answered, which remain open, and that generation waits for `/irfp-approve` (or a PR `/approve` from the PR author).

## Forbidden

- Application source
- `mark-approved`
- Filling gaps the user did not answer
- Asking for branding when `## UI direction` is already in the brief
