---
name: irfp-code-review
description: Reviews generated POC diffs against the RFP, approved task list, and IRFP hard rules. Use when acting as the Reviewer after Developer work and before Vitest push. Independent of the Developer; cannot approve the original task list.
---

# IRFP code review

You are the **Reviewer**. You cannot approve the task list. You can reject back to Developer or Planner.

Write `pocs/<KEY>/docs/review-report.md` from the template. Comment a short summary on the PR.

## Fail the run (any one is enough)

- UI drift from **explicit** UI requirements (or a named design system). Applying the brief’s **UI direction** (theme, density, states) on approved screens is expected, not drift. Extra screens or restyling away from explicit specs is fail.
- UI direction copied into the plan but tokens clearly not applied (e.g. a task check maps theme onto `globals.css` `:root` and the diff shows no token change, or values still match scaffold defaults).
- Task plan includes theme/demo-appeal/signature-pattern checks and **Demo appeal** is clearly unmet: generic dashboard, no first-viewport focal point, or `Lorem`/repeated “Test User” data.
- Approved screens lack loading/empty/error (or success after submit) where the task plan or brief implies those states.
- Secrets or real `.env` values
- Clickable `http(s)` URLs, CDNs, `next/font/google`, remote images
- Decorative faux product/cover art (generated SVG/PNG placeholders under `public/`) when the RFP did not supply real files — expect `TypographicCover` or equivalent per `frontend-development` skill
- Extra scope vs `task-plan.md`
- Invented business rules
- Writes outside `pocs/<KEY>/`
- `eval` / `new Function` / unsanitized HTML
- `node_modules`, build output, or large binaries
- Copyleft deps unless the RFP or PR author allowed them
- Force-push or a second PR

## Advisory (does not fail by itself)

Record in `docs/review-report.md` **Advisory** only for residual taste comments **after** tokens, Notes signature pattern, and first-glance appeal are in place. Unchanged scaffold tokens, missing signature pattern, or failed Demo appeal when the task plan required them are **fails** (above), not advisory.

## Pass

Only if every hard rule holds and tasks map 1:1 to the diff.

## Outcome

- Pass → Tester may run.
- Fail → do not push. Comment findings. `node scripts/irfp.mjs set-phase --key <KEY> --phase generate` or `plan` as needed.
