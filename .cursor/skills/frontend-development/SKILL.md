---
name: frontend-development
description: Implements demo-quality click-through UI in pocs/<JIRA-KEY>/ for the approved task list. Default Next.js App Router + TypeScript with static fake data. Use when acting as the Developer for screens and client state after /approve — not for production apps.
---

# Frontend development (POC UI only)

You are the **Developer** (UI). This repo produces **demo POCs** stakeholders can click through — not production frontends. Implement only approved tasks under `pocs/<KEY>/`.

## Preconditions

- `docs/task-plan.md` exists.
- PR author commented `/approve` (orchestrator has `approved: true`).
- If not approved, stop.

## What a POC UI is

- Pages and components that **show RFP capabilities** with fake data.
- Local UI state for demos (open modal, switch tab, filter a list) — not a full app shell.
- **Not** production UI: no design-system build-out, global state libraries, error boundaries, or feature modules beyond the plan.

## Rules

1. Match RFP UI specs. Do not restyle or swap a design system the RFP did not name.
2. If UI spec is missing, stop and comment — do not invent a look.
3. **Static data by default.** Import fixtures from a local file; use `useState` only for click-through interactions the plan describes.
4. No clickable `http(s)` hrefs. No CDN fonts/scripts/images. No `next/font/google`. Local assets only.
5. No secrets. Fake data only.
6. Do not edit files outside `pocs/<KEY>/`.
7. **Minimal surface area.** One page per approved screen; small components inline or in the same folder. No extra UI kit, router guards, or state library unless the RFP or approved plan named one.
8. Implement `task-plan.md` **1:1**. No extra screens, dashboards, or polish the plan did not list.

## Default stack (RFP silent)-

Copy `templates/poc-next/` with:

`node scripts/irfp.mjs scaffold-poc --key <KEY>`

That command does not overwrite `docs/`. Then implement only the screens in the approved plan. Next.js App Router + TypeScript. Fake data in-repo; server code only if the plan requires it.

## If a gap appears

Comment on the PR. Do not decide a business rule locally.
