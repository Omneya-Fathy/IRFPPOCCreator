---
name: frontend-development
description: Implements approved POC screens under pocs/<JIRA-KEY>/ from the task plan plus brief UI requirements and UI direction. Default Next.js App Router + TypeScript + scaffold Tailwind. Use after /approve — do not re-analyze the RFP.
---

# Frontend development (POC UI)

You are the **Developer** (UI). Implement **approved** screens only. Theme from brief **UI direction**. Do **not** re-read the RFP. Consume `docs/task-plan.md`, `docs/technical-plan.md`, and `docs/rfp-brief.md`.

## Preconditions

- Approved (`approved: true`). If not, stop.
- Read in order: task plan (1:1) → technical plan (routes, copied UI direction) → brief UI requirements + UI direction + capabilities/non-goals.
- If no `package.json`: `node scripts/irfp.mjs scaffold-poc --key <KEY>` (does not overwrite `docs/`). Reuse scaffold Tailwind and `components/ui`. Do not reinstall Tailwind or invent a new kit.

## Precedence

1. Explicit UI requirements (and any named design system). Match; do not “improve.”
2. Approved `task-plan.md` screens and flows. Derived brief items only if they appear there.
3. UI direction as **theme only** (tokens, density, surfaces, nav). Not new features.
4. Scaffold defaults where direction is silent on a detail.

Stop on **behavior** gaps. Missing hex codes is not a stop. Polish may change how approved screens look; it must not add screens, workflows, APIs, or capabilities.

## Sufficient UI direction

From `rfp-brief.md` or the copy in `technical-plan.md`, direction is **sufficient** when **all** are true:

- `Tone` non-empty (labels may combine, e.g. Modern SaaS + Structured)
- `Density` is `low` | `moderate` | `high`
- `Context` at least one sentence (product type / users)
- `Notes` at least **two** implementable lines (focal layout, signature element, restraint)
- `Demo quality` is `modern, demo-impressive-within-restraint`

**If sufficient:** do **not** read all of `ui-direction.md` for inference. You **must** still read: **Tone → visual translation**, **First-glance appeal**, **Domain-relevant visual language**, and **Final visual QA** (full table). Retokenize `:root` from the Tone table + density.

**If insufficient** (empty, placeholders, or missing any field): read `.cursor/skills/frontend-development/ui-direction.md` once, infer tone, comment on the PR that the brief was thin, then implement. Do not reopen the RFP.

## Process

1. Retokenize scaffold `app/globals.css` `:root` (and layout shell) from UI direction. System fonts only. No `next/font/google`, no CDNs. When the plan maps theme onto tokens, leaving default scaffold colors/layout is **not acceptable**.
2. Reuse `components/ui/*`. Extend only if the plan names more (Select, Modal, table). No UI-kit npm packages.
3. Implement each approved route 1:1. Server Components by default; `"use client"` only for planned interactivity. Fixtures in `lib/` or `data/`.
4. Loading / empty / error / success on those screens (skeleton, domain empty copy, user-facing error, noticeable success). Responsive; keyboard and contrast.
5. **Product media (POC):** satisfy “cover image / thumbnail / product photo” requirements with **intentional non-photo presentation** unless the RFP or plan supplies real asset files. Default: reuse scaffold `components/ui/typographic-cover.tsx` (title + optional subtitle on theme tokens, fixed aspect ratio, `role="img"` + `aria-label`). Do **not** add decorative SVG/PNG “fake cover art,” stock-style illustrations, AI-looking placeholders, or empty/broken `<img>` tags. Do **not** use `next/image` with invented local art files. Raster `<img>` / `next/image` only when the brief or plan names **specific files you were given** (e.g. exported covers in the RFP attachment). See **POC product media** in `ui-direction.md`.
6. **Final visual QA** (always): before the next screen, or once before build on a single-screen POC, apply the **Final visual QA** table in `ui-direction.md`. Do not skip because direction was sufficient. Fix issues first.
7. `npm test` and `npm run build` in `pocs/<KEY>/`.

## Hard rules

1. Explicit UI wins. Task plan is 1:1. No extra screens for polish. Unchanged scaffold tokens/layout fail when the plan requires theme mapping.
2. No secrets, no clickable `http(s)` hrefs, no CDNs, no `next/font/google`, no faux product/cover image files (typographic or real supplied assets only — see step 5).
3. Edit only `pocs/<KEY>/`. No deps beyond the scaffold Tailwind toolchain and what the RFP/plan requires.
4. Comment on the PR and stop if a business rule is missing. Do not invent screens or rules.
