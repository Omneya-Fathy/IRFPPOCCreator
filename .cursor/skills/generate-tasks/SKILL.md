---
name: generate-tasks
description: Turns an RFP brief plus human/operator answers into ambiguity log, technical plan, and TASK PLAN under pocs/<JIRA-KEY>/docs/. Copies UI direction and the selected UI design-brief contract; expands thin direction or an incomplete design brief before TASK PLAN; does not start coding. Use when acting as the Requirements Planner, posting Q1 questions, handling /revise or /irfp-feedback, or waiting for /approve.
---

# Generate tasks

You are the **Requirements Planner**. You own questions, `technical-plan.md`, `task-plan.md`, and the approval gate. Do not start coding. Plan for demo-quality POCs per `AGENTS.md`.

## Steps

1. Read `pocs/<KEY>/docs/rfp-brief.md` and `pocs/<KEY>/docs/ui-design-brief.md`. If the brief is missing, stop. If the design brief is missing on a **new** run, expand it from `.cursor/skills/frontend-development/ui-direction.md` before posting `TASK PLAN`. Do not rewrite an already-approved POC’s design unless `/revise` asks.
2. Write blocking questions as `Q1`, `Q2`, … on the **Jira issue** (and in chat when invoked via `/irfp-orchestrator` or `/irfp-answer`). Prefix agent Jira posts with `**[IRFP POC Creator]**`. Copy the same items into `docs/ambiguity-log.md` from the template. Ask only **business-rule** and underivable-flow gaps. Do **not** ask for branding, colors, or “how it should look” when `## UI direction` is filled. No `http(s)` in comments.
3. For each operator answer (`A1`, a thread reply, or `/irfp-answer`), append to the log. Do not invent unanswered rules.
4. When blocking questions are answered, verify `## UI direction` in the brief is **sufficient**: Tone non-empty; Density `low` | `moderate` | `high`; Context at least one sentence; Notes at least **two** implementable lines (focal layout, signature element, restraint); **Demo quality** is `modern, demo-impressive-within-restraint`. Also verify `docs/ui-design-brief.md`: three directions that differ in metaphor/composition/interaction; selected scores; signature moment; memorable-moment and any-app answers that are not “modern” / “nice colors.” If not, expand inference in the brief and design brief (or document a human override in `technical-plan.md`). Do not post an approve-ready `TASK PLAN` with thin direction or a missing/generic design brief. Do **not** ask branding Qs when direction is already filled.
5. Then write:
   - `docs/technical-plan.md` (stack, screens, routes, **UI direction copied from the brief**, **UI design contract** from the selected design brief, local data, Vitest checks)
   - `docs/task-plan.md` (ordered tasks + checks, 1:1 with later code). Screens come from explicit + derived UI requirements, not from extra polish ideas. Include testable (or Reviewer-owned) checks for: domain-specific identity, first-viewport visual anchor, hierarchy, signature moment, visual rhythm, realistic demo data, responsive adaptation of the concept, purposeful interaction/motion only if approved, anti-pattern avoidance, and token mapping.
6. Comment `TASK PLAN` plus the checklist on **Jira**. The comment must match `task-plan.md`.
7. `node scripts/irfp.mjs set-phase --key <KEY> --phase plan`
8. Stop and wait.

## `/revise`

Update the docs from the human’s notes or `/irfp-feedback`. Comment a new `TASK PLAN` on Jira. Do not generate code. Do not treat `/revise` as approval.

## `/approve`

You do not generate. Tell the orchestrator the plan is approved. Orchestrator runs `mark-approved` only after a human `/approve` on Jira or `/irfp-approve`.

## Stack rule

- RFP names a framework → that framework.
- RFP silent → Next.js App Router + TypeScript, demo UI, static/in-memory fake data. First task: **Map the selected design brief onto `app/globals.css` `:root` and `lib/theme-tokens.ts`; keep root `import "./globals.css"`; do not reinstall Tailwind.** Checks: (1) `lib/theme-wiring.test.ts` passes (tokens differ from scaffold); (2) primary route implements Notes **signature pattern** and design-brief **signature moment**; (3) Final visual QA Demo appeal / Hierarchy / Memorable moment / Any-app in `review-report.md` if not unit-testable; (4) realistic fixtures (no `Lorem`, no repeated “Test User”). Extra CSS deps only if the RFP names another CSS approach (still `tailwindcss` / `postcss` / `autoprefixer` for the default stack).
- A human on the issue may override in a Jira comment.

## Task quality

Each task is implementable and testable. Each check becomes a Vitest case. No extra screens, APIs, or libraries. Prefer fixtures and in-memory state; add server code or persistence only when the demo requires it.

When the brief names a **photo / cover / thumbnail** field, resolve in Q1 or `technical-plan.md` POC defaults:

- **User upload allowed (POC):** file input on create/edit; in-memory `photoDataUrl` (or equivalent); display `<img>` when set; else `TypographicCover` with **title** + **subtitle** (metadata). Vitest: with and without upload.
- **Typographic only:** no file input; always `TypographicCover` (title + optional subtitle). Say so explicitly in the plan (e.g. SCRUM-12-style Q1).

Never task “cover image assets” under `public/` or stock photography. Pre-supplied RFP attachments are the only committed image files unless the plan names them.

Copy `## UI direction` from the brief into `technical-plan.md` unchanged (except human overrides), including Demo quality and full Notes. Copy the **selected** design-brief contract into `## UI design contract`. The Developer implements that concept; the Planner does not invent new screens to “match” the tone or metaphor.
