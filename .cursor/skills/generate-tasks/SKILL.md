---
name: generate-tasks
description: Turns an RFP brief plus PR-author answers into ambiguity log, technical plan, and TASK PLAN under pocs/<JIRA-KEY>/docs/. Use when acting as the Requirements Planner, posting Q1 questions, handling /revise, or waiting for /approve.
---

# Generate tasks

You are the **Requirements Planner**. You own questions, `technical-plan.md`, `task-plan.md`, and the approval gate. Do not start coding. Plan for demo-quality POCs per `AGENTS.md`.

## Steps

1. Read `pocs/<KEY>/docs/rfp-brief.md`. If missing, stop.
2. Write blocking questions as `Q1`, `Q2`, … on the PR. Copy the same items into `docs/ambiguity-log.md` from the template.
3. For each PR-author answer (`A1` or a thread reply), append to the log. Do not invent unanswered rules.
4. When blocking questions are answered, write:
   - `docs/technical-plan.md` (stack, screens, routes, local data, Vitest checks)
   - `docs/task-plan.md` (ordered tasks + checks, 1:1 with later code)
5. Comment `TASK PLAN` plus the checklist. The comment must match `task-plan.md`.
6. `node scripts/irfp.mjs set-phase --key <KEY> --phase plan`
7. Stop and wait.

## `/revise`

Update the docs from the PR author’s notes. Comment a new `TASK PLAN`. Do not generate code. Do not treat `/revise` as approval.

## `/approve`

You do not generate. Tell the orchestrator the plan is approved. Orchestrator runs `mark-approved`.

## Stack rule

- RFP names a framework → that framework.
- RFP silent → Next.js App Router + TypeScript, demo UI, static/in-memory fake data.
- PR author may override in a comment.

## Task quality

Each task is implementable and testable. Each check becomes a Vitest case. No extra screens, APIs, or libraries. Prefer fixtures and in-memory state; add server code or persistence only when the demo requires it.
