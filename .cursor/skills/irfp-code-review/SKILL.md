---
name: irfp-code-review
description: Reviews generated POC diffs against the RFP, approved task list, and IRFP hard rules. Use when acting as the Reviewer after Developer work and before Vitest push. Independent of the Developer; cannot approve the original task list.
---

# IRFP code review

You are the **Reviewer**. You cannot approve the task list. You can reject back to Developer or Planner.

Write `pocs/<KEY>/docs/review-report.md` from the template. **Fill every Hard rules row** with file evidence (not “Yes” alone). Comment a short summary on **Jira** (prefix `**[IRFP POC Creator]**`, no `http(s)`).

## Required reads (do not skip)

Compare the POC to these, in order:

1. `docs/rfp-brief.md` — **explicit UI** (named system, colors, type, screens) and UI direction.
2. `docs/ui-design-brief.md` — selected metaphor, composition, signature moment, media strategy, anti-patterns, typography if stated.
3. `docs/technical-plan.md` **UI design contract** + `docs/task-plan.md`.
4. **Scaffold baseline:** `templates/poc-next/app/globals.css` and scaffold `components/ui/page-header.tsx` (and `app-shell` if the POC still uses an unstyled header).
5. POC files that actually paint the first viewport: root `app/layout.tsx`, `app/globals.css`, `lib/theme-tokens.ts`, `lib/theme-wiring.test.ts`, shell/nav, `page-header` (or equivalent), home/primary route, signature-moment component, media/cover component, fixtures.

A pass that only cites `:root` hex values and Vitest token tests is incomplete. Tokens without shell/type/rhythm/media evidence **fail** Design concept propagated.

## How to judge visual rows

| If you see this | Verdict |
| --- | --- |
| `:root` changed, `PageHeader` / page titles still default scaffold sans when explicit UI or contract requires display/serif titles | **Fail** — UI specs or Design concept propagated |
| Signature moment exists in DOM but the brief’s accent/weight is missing (e.g. “terracotta rail” implemented as a gray spine with a thin active border) | **Fail** — Signature moment / Memorable moment (present but not the contracted visual) |
| Rhythm is `index % 2` (or similar) with no content rule when the contract asked for featured vs supporting | **Fail** — Rhythm / asymmetry |
| Task plan allows upload (`photoDataUrl`) but **every** first-load fixture is typographic and the feed still looks like empty photo slots / identical tiles, with no compensating editorial cover treatment in the contract | **Fail** — Demo appeal (unless the plan **explicitly** chose typographic-first and described the compensating layout) |
| Palette + sage button on otherwise unchanged navbar + bordered-card grid | **Fail** — Demo appeal / Any-app test (concept only in color) |
| Slightly warmer shadow, 2px radius, or optional spine tint **after** the contract is visibly met | **Advisory** only |

**Demo appeal** is unmet when a stakeholder would call the first viewport a **retokenized scaffold**, even if it is not a purple admin dashboard and even if Vitest is green.

**Modern / demo-impressive-within-restraint** (Readme hard rule 10) means: first viewport looks like **this product**, type roles and signature weight match the contract, media is honest and not placeholder-looking. It does **not** mean extra screens, CDNs, `next/font/google`, or ignoring a named design system.

## Fail the run (any one is enough)

- UI drift from **explicit** UI requirements (or a named design system). Applying the brief’s **UI direction** and **UI design brief** (theme, density, composition, signature moment) on approved screens is expected, not drift. Extra screens or restyling away from explicit specs is fail. **Named type roles** (e.g. serif titles) must appear on **shared** title chrome (`PageHeader`, wordmark), not only on one detail `h1`.
- Root `app/layout.tsx` missing `import "./globals.css"` (or equivalent path to the POC global stylesheet); `globals.css` missing `@tailwind` layers; or missing/failing `lib/theme-wiring.test.ts` (still-scaffold tokens). Tokens in `globals.css` alone are insufficient.
- UI direction or design contract copied into the plan but tokens clearly not applied (e.g. a task check maps theme onto `globals.css` `:root` and the diff shows no token change, or values still match scaffold defaults).
- Approved **UI design contract** materially absent: concept only in colors; scaffold shell/header/cards unchanged aside from CSS variables; no first-viewport visual anchor; no signature moment from the brief **or** the moment is present but visually neutralized; repetitive card → card → card **or** fake rhythm (`index % 2` with no semantic featured rule) when the contract required rhythm; or the UI would pass as any generic SaaS app with the name/logo removed.
- Task plan includes theme/demo-appeal/signature-pattern checks and **Demo appeal** is clearly unmet: generic dashboard, no first-viewport focal point, `Lorem`/repeated “Test User” data, **or** retokenized scaffold chrome that does not read as a first-glance product demo.
- Cosmetic-only “innovation”: arbitrary gradients, glassmorphism, generic purple/blue AI chrome, or random radius/shadow/font changes with no domain metaphor.
- Approved screens lack loading/empty/error (or success after submit) where the task plan or brief implies those states.
- Secrets or real `.env` values
- Clickable `http(s)` URLs, CDNs, `next/font/google`, remote images
- Decorative faux product/cover art (generated SVG/PNG placeholders under `public/`) when the RFP did not supply real files — expect `TypographicCover` or user-uploaded images per plan, not stock art
- Task plan allows user photo upload but forms lack file input, or display always shows typographic cover when `photoDataUrl` is set (or the reverse when plan is typographic-only)
- Extra scope vs `task-plan.md`
- Invented business rules
- Writes outside `pocs/<KEY>/`
- `eval` / `new Function` / unsanitized HTML
- `node_modules`, build output, or large binaries
- Copyleft deps unless the RFP or a human on the issue allowed them
- Force-push or a second PR

## Advisory (does not fail by itself)

Record in `docs/review-report.md` **Advisory** only for residual taste comments **after** tokens, **shared** type roles, Notes signature pattern, design-brief signature moment **at the contracted visual weight**, first-glance appeal, **semantic** rhythm, first-load media strategy, and any-app identity are in place.

Do **not** park these as advisory (they are fails above): unchanged scaffold tokens; missing or visually weak signature; `index % 2` posing as rhythm; generic any-app UI; Demo appeal unmet; explicit serif/display type missing from shared headers.

When reviewing, look for evidence of:

- Selected concept propagated beyond tokens (shell, cards, nav, forms, states, media, type)
- Shared primitives restyled (`PageHeader`, `Button`, `Card`, covers) — not only page-local classes
- Recognizable product/domain identity with logo/name imagined removed
- Visual anchor and PRIMARY → SECONDARY hierarchy in the first viewport
- Coherent rhythm and intentional asymmetry (not a template grid; not index-parity)
- Memorable signature visual or approved interaction **as specified** (accent, placement, dominance)
- Realistic populated content and believable states
- First-load media matches the plan (seeded uploads vs typographic-first **named** in the contract)
- Purposeful motion; concept survives small viewports
- Media honesty and intentional media composition
- Accessibility/usability retained
- No generic SaaS anti-patterns listed in the design brief

## Pass

Only if every hard rule holds, every Hard rules table row is filled with evidence, and tasks map 1:1 to the diff.

## Outcome

- Pass → Tester may run.
- Fail → do not push. Comment findings. `node scripts/irfp.mjs set-phase --key <KEY> --phase generate` or `plan` as needed.
