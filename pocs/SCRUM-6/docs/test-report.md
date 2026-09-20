# Test report

- Jira key: SCRUM-6
- Command: `npm test` (vitest run)
- Result: pass
- Counts: 3 test files, 18 tests passed, 0 failed

## Task plan coverage

| Task | Check | Test evidence | Status |
| --- | --- | --- | --- |
| 1. Scaffold Next.js + Vitest | Test runner passes | All 3 files execute under Vitest 3.2.7 | Pass |
| 2. Seed fake catalogue | Catalogue API returns seeded data | `lib/store.test.ts` — "returns seeded data" | Pass |
| 3. Browse by genre and author | Filtering returns expected subsets | `lib/store.test.ts` — "filters by genre", "filters by author" | Pass |
| 4. Search by title or ISBN | Title and ISBN matches | `lib/store.test.ts` — "matches by title", "matches by ISBN" | Pass |
| 5. Product page fields | Cover, title, author, ISBN, price, in-stock flag | `components/ProductDetails.test.tsx` — both tests | Pass |
| 6. Shopping cart | Add, update qty, remove | `lib/store.test.ts` — "adds, updates, and removes items" | Pass |
| 7. Guest checkout | Order without account; address required; Egypt-only; qty unchanged | `lib/store.test.ts` — checkout describe (3 tests) | Pass |
| 8. Order confirmation + email log | Order id, line items, email payload | `lib/store.test.ts` — "creates an order without an account and logs email payload" | Pass |
| 9. Staff routes without auth | Pages accessible without login | No Vitest; verified in code review (no auth middleware on `/staff/*`) | Pass (review) |
| 10. Staff inventory | Manual edit persists; no auto-decrement | `lib/store.test.ts` — staff inventory describe (2 tests) | Pass |
| 11. Staff order lookup | Find order by id | `lib/store.test.ts` — "finds an order by id" | Pass |
| 12. Featured lists | Home featured ISBNs; staff edit updates list | `lib/store.test.ts` — featured list describe (2 tests) | Pass |
| 13. Hard-rule sweep | No external hrefs in UI source | `lib/hard-rules.test.ts` — "does not include clickable external http or https links in UI source" | Pass |

## Failures

None.

## Gate

`node scripts/irfp.mjs mark-vitest --key SCRUM-6 --passed true --command "npm test"`
