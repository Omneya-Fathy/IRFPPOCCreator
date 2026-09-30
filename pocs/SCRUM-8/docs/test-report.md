# Test report

- Jira key: SCRUM-8
- Command: `cd pocs/SCRUM-8 && npm test` (runs `vitest run`)
- Result: pass
- Counts: 6 test files, 16 tests passed, 0 failed

## Coverage vs task plan

| Area | Tests |
| --- | --- |
| Harvest Table tokens + layout import | `lib/theme.test.ts` |
| Fixtures (no Lorem / Test User) | `lib/fixtures.test.ts` |
| Store: default actor, persona, search, follow, publish notification, photoDataUrl, author gate | `lib/store.test.ts` |
| App shell on `/` | `lib/app-shell.test.ts` |
| Cook-from step rail + markers | `lib/recipe-page.test.ts` |
| TypographicCover without photo | `lib/typographic-cover.test.tsx` |

Visual / Reviewer-owned checks (demo appeal, memorable moment, rhythm, responsive cook-from) are documented in `review-report.md`.

## Failures

None.

## Gate

`node scripts/irfp.mjs mark-vitest --key SCRUM-8 --passed true --command "cd pocs/SCRUM-8 && npm test"`
