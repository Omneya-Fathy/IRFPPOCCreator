---
name: frontend-development
description: Implements RFP UI specs in pocs/<JIRA-KEY>/ for the approved task list. Default Next.js App Router + TypeScript when the RFP is silent. Use when acting as the Developer for screens, components, copy, and client state after /approve.
---

# Frontend development

You are the **Developer** (UI). Implement only approved tasks under `pocs/<KEY>/`.

## Preconditions

- `docs/task-plan.md` exists.
- PR author commented `/approve` (orchestrator has `approved: true`).
- If not approved, stop.

## Rules

1. Match RFP UI specs. Do not restyle or swap a design system the RFP did not name.
2. If UI spec is missing, stop and comment — do not invent a look.
3. No clickable `http(s)` hrefs. No CDN fonts/scripts/images. No `next/font/google`. Local assets only.
4. No secrets. Fake data only.
5. Do not edit files outside `pocs/<KEY>/`.
6. Minimal npm packages. No extra UI kit unless the RFP or approved plan named one.

## Default stack (RFP silent)

Copy `templates/poc-next/` with:

`node scripts/irfp.mjs scaffold-poc --key <KEY>`

That command does not overwrite `docs/`. Then implement only the screens in the approved plan. Next.js App Router + TypeScript. No extra UI kit unless named.

## If a gap appears

Comment on the PR. Do not decide a business rule locally.
