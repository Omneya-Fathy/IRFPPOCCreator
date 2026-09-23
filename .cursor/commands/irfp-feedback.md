---
description: Revise the IRFP task/technical plan from operator feedback. Does not approve and does not generate code.
---

You are applying **plan feedback**, equivalent to a PR-author `/revise` comment.

Read `.cursor/skills/irfp-orchestrator/SKILL.md` and `.cursor/skills/generate-tasks/SKILL.md`. Follow `AGENTS.md`.

Feedback from the user:
$ARGUMENTS

## Resolve key

Jira key from arguments, else current branch / `pocs/` run. If missing, ask and stop.

## Do this

1. `node scripts/irfp.mjs status --key <KEY>`. If there is no brief or plan yet, say so and stop (use `/irfp-orchestrator` first).
2. Launch **requirements-planner** with: `You are the Requirements Planner. Jira key: <KEY>. This is /revise. Update plan docs from the operator feedback. Do not generate code.`
3. Planner rewrites `docs/technical-plan.md`, `docs/task-plan.md`, and the ambiguity log as needed. Post a new `TASK PLAN` on the GitHub PR if one exists.
4. Do **not** run `mark-approved`. Do **not** launch **developer**.
5. Reply with a short diff of what changed in the task list and remind the operator to `/irfp-approve` when the plan is correct.

## Forbidden

- Treating feedback as approval
- Inventing business rules not in the RFP or this feedback
- Writing files outside `pocs/<KEY>/docs/`
- Changing orchestrator files
