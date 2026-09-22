# Test report

- Jira key: SCRUM-6
- Command: `npm test` (from `pocs/SCRUM-6/`)
- Result: pass
- Counts: 10 test files, 25 tests passed, 0 failed

## Coverage vs TASK PLAN checks

| Area | Test file(s) |
| --- | --- |
| Theme tokens (task 1) | `lib/theme.test.ts` |
| Catalogue fixtures (task 3) | `lib/catalog-fixtures.test.ts`, `lib/store.test.ts` |
| `isInStock` A2 (task 4) | `lib/inventory.test.ts` |
| Storefront shell (tasks 5–6) | `lib/storefront-shell.test.ts`, `lib/store.test.ts` (staff picks) |
| Genre/author browse (tasks 7–8) | `lib/store.test.ts` |
| Search (task 9) | `lib/search.test.ts` |
| Cart (task 11) | `lib/cart.test.ts` |
| US address A1 (task 12) | `lib/us-address.test.ts` |
| Guest checkout + A4 (tasks 13–14) | `lib/checkout.test.ts` |
| Staff access A3 (task 16) | `lib/staff-access.test.ts` |
| Inventory + orders (tasks 15, 17–18) | `lib/store.test.ts` |

Build gate (task 2) is exercised at review time (`npm run build`); not re-run in this Tester pass.

## Failures

None.

## Gate

`node scripts/irfp.mjs mark-vitest --key SCRUM-6 --passed true --command "npm test"`
