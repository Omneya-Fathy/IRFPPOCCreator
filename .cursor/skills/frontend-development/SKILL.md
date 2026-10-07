---
name: frontend-development
description: Implements approved POC screens under pocs/<JIRA-KEY>/ from the task plan, the selected UI design brief, and brief UI requirements. Default Next.js App Router + TypeScript + scaffold Tailwind. Use after /approve — do not re-analyze the RFP or invent a new design while coding.
---

# Frontend development (POC UI)

You are the **Developer** (UI). Implement **approved** screens only. Apply the **selected concept** from `docs/ui-design-brief.md` (and the copy in `technical-plan.md`). Do **not** re-read the RFP. Do **not** restart ideation while coding.

## Preconditions

- Approved (`approved: true`). If not, stop.
- Read in order: task plan (1:1) → technical plan (routes, UI direction, **UI design contract**) → `docs/ui-design-brief.md` (selected concept) → brief UI requirements + UI direction + capabilities/non-goals.
- If no `package.json`: `node scripts/irfp.mjs scaffold-poc --key <KEY>` (does not overwrite `docs/`). Reuse scaffold Tailwind and `components/ui`. Do not reinstall Tailwind or invent a new kit.
- **Global styles:** the root `app/layout.tsx` must import `./globals.css` so Tailwind and `:root` tokens apply. Nested `layout.tsx` files do not replace this — keep the import on the **root** layout.

## Precedence

1. Explicit UI requirements (and any named design system). Match; do not “improve.”
2. Approved `task-plan.md` screens and flows. Derived brief items only if they appear there.
3. Selected **UI design brief** / technical-plan **UI design contract** (metaphor, composition, hierarchy, signature moment, rhythm, media, anti-patterns). Theme **and** composition of approved screens. Not new features.
4. Brief **UI direction** (Tone, Density, Notes) as compatibility summary.
5. Scaffold defaults where the contract is silent on a detail.

Stop on **behavior** gaps. Missing hex codes is not a stop. Polish may change how approved screens look; it must not add screens, workflows, APIs, or capabilities.

**Hard rule:** Never introduce visual novelty by randomly changing colors, gradients, border radii, shadows, or fonts. Novelty comes from the selected domain metaphor, content model, layout, or approved interaction.

## Sufficient UI direction

From `rfp-brief.md` / `technical-plan.md`, direction is **sufficient** when **all** are true:

- `Tone` non-empty (labels may combine, e.g. Modern SaaS + Structured)
- `Density` is `low` | `moderate` | `high`
- `Context` at least one sentence (product type / users)
- `Notes` at least **two** implementable lines (focal layout, signature element, restraint)
- `Demo quality` is `modern, demo-impressive-within-restraint`

A design brief is **sufficient** when it has three distinct directions, a selected concept with scores, a signature moment, and acceptance tests that are not “modern” / “nice colors.”

**If sufficient:** consume the selected contract. Do **not** invent a fourth direction. You **must** still read in `ui-direction.md`: **UI Innovation & Design Ideation**, **Tone → visual translation**, **First-glance appeal**, **Domain-relevant visual language**, and **Final visual QA** (full table). Retokenize `:root` from the Tone table + density **and** the selected metaphor.

**If insufficient** (empty design brief, placeholders, or missing any field): read `.cursor/skills/frontend-development/ui-direction.md` once, infer a concept using the 3-direction procedure, comment on **Jira** that the brief was thin (prefix `**[IRFP POC Creator]**`, no `http(s)`), then implement. Do not reopen the RFP. Do not add screens.

## Pre-code concept checkpoint

Before writing components for each approved screen, answer:

- Focal point (visual anchor)
- Primary action
- How the signature moment appears on this screen
- Domain visual language in use
- Density and rhythm (not card → card → card)
- How the concept adapts on a small viewport

Then choose components. Do not start from a generic navbar + hero + three cards unless the RFP required that.

## Process

1. After `scaffold-poc`, **before any routes:** retokenize `app/globals.css` `:root` and `lib/theme-tokens.ts` from the design contract + UI direction. Keep `import "./globals.css"` on **root** `app/layout.tsx` (nested layouts do not replace it). Run `npm test` until `lib/theme-wiring.test.ts` is green. Do not build pages while it is red. System fonts only. No `next/font/google`, no CDNs. Leaving scaffold colors is not acceptable. Propagate the concept through tokens, shell, cards, nav, forms, states, media, type, composition, and feedback — **not color alone**.
2. Reuse `components/ui/*`. Extend only if the plan names more (Select, Modal, table). No UI-kit npm packages. Style primitives to express the metaphor.
3. Implement each approved route 1:1. Server Components by default; `"use client"` only for planned interactivity. Fixtures in `lib/` or `data/`. Realistic, varied demo data (no `Lorem ipsum`, no repeated “Test User”).
4. Loading / empty / error / success on those screens (skeleton, domain empty copy, user-facing error, noticeable success). Responsive; keyboard and contrast. The concept (anchor, hierarchy, signature) must survive small viewports.
5. **Product media (POC):** follow the approved plan, the design-brief media strategy, and **POC product media** in `ui-direction.md`. **When the task plan allows user photo upload:** provide a file input on the relevant form; on submit, store the image in-memory only (e.g. `photoDataUrl` from `FileReader` — no CDN, no `public/` seed art, no remote URLs). **Display:** if the entity has a user-uploaded image, render it in a normalized container (`<img>` with `alt` from the product/recipe title, `object-cover` or `object-contain` per ui-direction). **If no upload** (fixtures, new record, or plan forbids upload): use `components/ui/typographic-cover.tsx` with **title** and optional **subtitle** (e.g. servings · cook name · metadata — not a fake photo), or other honest domain-native composition named in the brief. Do **not** ship decorative SVG/PNG placeholders, stock art, or empty/broken `<img>` tags. Pre-attached RFP image files may be copied into the POC only when the plan names them.
6. Implement the **signature moment** from the design contract on an approved screen. Signature **interaction** only if the plan/capability named it. Motion only to communicate state, progress, navigation, cause/effect, or spatial relationship. Honor `prefers-reduced-motion`.
7. Apply visual rhythm and controlled asymmetry from the contract. Avoid generic SaaS anti-patterns listed in the brief and in `ui-direction.md` §4.
8. **Final visual QA** (always): before the next screen, or once before build on a single-screen POC, apply the **Final visual QA** table in `ui-direction.md` (including memorable moment and any-app tests). Do not skip because direction was sufficient. Fix issues first.
9. **Gate:** `lib/theme-wiring.test.ts` green, then `npm test` and `npm run build` in `pocs/<KEY>/`.

## Hard rules

1. Explicit UI wins. Task plan is 1:1. No extra screens for polish. Unchanged scaffold tokens fail. A generic dashboard that ignores the design brief fails. Missing `import "./globals.css"` or a red/deleted `lib/theme-wiring.test.ts` is an automatic fail.
2. No secrets, no clickable `http(s)` hrefs, no CDNs, no `next/font/google`, no faux product/cover image files in `public/` (user uploads and typographic fallback per process step 5; see `ui-direction.md`).
3. Edit only `pocs/<KEY>/`. No deps beyond the scaffold Tailwind toolchain and what the RFP/plan requires.
4. Comment on **Jira** and stop if a business rule is missing. Do not invent screens or rules.
