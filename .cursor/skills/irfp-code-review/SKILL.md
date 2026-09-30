---
name: irfp-code-review
description: Reviews generated POC diffs against the RFP, approved task list, and IRFP hard rules. Use when acting as the Reviewer after Developer work and before Vitest push. Independent of the Developer; cannot approve the original task list.
---

# IRFP code review

You are the **Reviewer**. You cannot approve the task list. You can reject back to Developer or Planner.

Write `pocs/<KEY>/docs/review-report.md` from the template. Comment a short summary on **Jira** (prefix `**[IRFP POC Creator]**`, no `http(s)`).

## Fail the run (any one is enough)

- UI drift from **explicit** UI requirements (or a named design system). Applying the brief’s **UI direction** and **UI design brief** (theme, density, composition, signature moment) on approved screens is expected, not drift. Extra screens or restyling away from explicit specs is fail.
- Root `app/layout.tsx` missing `import "./globals.css";` (or equivalent path to the POC global stylesheet) for Next.js App Router POCs — tokens in `globals.css` alone are insufficient.
- UI direction or design contract copied into the plan but tokens clearly not applied (e.g. a task check maps theme onto `globals.css` `:root` and the diff shows no token change, or values still match scaffold defaults).
- Approved **UI design contract** materially absent: concept only in colors; no first-viewport visual anchor; no signature moment from the brief; repetitive card → card → card when the contract required rhythm; or the UI would pass as any generic SaaS app with the name/logo removed.
- Task plan includes theme/demo-appeal/signature-pattern checks and **Demo appeal** is clearly unmet: generic dashboard, no first-viewport focal point, or `Lorem`/repeated “Test User” data.
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

Record in `docs/review-report.md` **Advisory** only for residual taste comments **after** tokens, Notes signature pattern, design-brief signature moment, first-glance appeal, rhythm, and any-app identity are in place. Unchanged scaffold tokens, missing signature pattern/moment, failed Demo appeal, or a generic any-app UI when the task plan required them are **fails** (above), not advisory.

When reviewing, look for evidence of:

- Selected concept propagated beyond tokens (shell, cards, nav, forms, states, media, type)
- Recognizable product/domain identity with logo/name imagined removed
- Visual anchor and PRIMARY → SECONDARY hierarchy in the first viewport
- Coherent rhythm and intentional asymmetry (not a template grid)
- Memorable signature visual or approved interaction
- Realistic populated content and believable states
- Purposeful motion; concept survives small viewports
- Media honesty and intentional media composition
- Accessibility/usability retained
- No generic SaaS anti-patterns listed in the design brief

## Pass

Only if every hard rule holds and tasks map 1:1 to the diff.

## Outcome

- Pass → Tester may run.
- Fail → do not push. Comment findings. `node scripts/irfp.mjs set-phase --key <KEY> --phase generate` or `plan` as needed.
