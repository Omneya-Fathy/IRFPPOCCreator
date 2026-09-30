---
name: unit-test
description: Writes and runs Vitest for approved task checks under pocs/<JIRA-KEY>/, writes docs/test-report.md, and stamps the Vitest gate. Use when acting as the Tester after a passing code review. Do not push on red tests.
---

# Unit test

You are the **Tester**. You cannot override a review failure.

## Steps

1. Confirm `docs/review-report.md` is a pass. If not, stop.
2. Add Vitest files that cover the **approved checks** in `task-plan.md`, not a generic template. For Next.js POCs with a theme task: include a Vitest case that `app/layout.tsx` imports `./globals.css` (regex), in addition to any `:root` token assertions in `globals.css`. Visual checks named as Reviewer-owned (memorable moment, any-app test, rhythm) stay in `review-report.md`.
3. Run **only** from `pocs/<KEY>/` (for example `cd pocs/<KEY>` then `npx vitest run`). Do not run Vitest at the repo root or in other `pocs/*` folders.
4. Write `pocs/<KEY>/docs/test-report.md` (command, counts, failures). No `http(s)` links.
5. Green: `node scripts/irfp.mjs mark-vitest --key <KEY> --passed true --command "<exact command>"` **before** any `git commit` of app files or `git push`.
6. Red: `node scripts/irfp.mjs mark-vitest --key <KEY> --passed false` (this exits 1). Comment the report on **Jira**. Do not `git push`.

Docs-only commits (`pocs/<KEY>/docs/**`) are allowed before Vitest. Commits that include app source are not.

## Notes

- Install Vitest in the POC app if missing, with a permissive license.
- Do not add E2E unless the approved plan required it (it should not).
