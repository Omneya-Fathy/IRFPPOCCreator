# Review report

- Jira key: SCRUM-6
- Verdict: pass

## Hard rules

| Rule | Pass? | Notes |
| --- | --- | --- |
| UI specs (explicit) | Yes | Product page (cover, title, author, ISBN, price, combined stock); genre/author browse; search; cart; guest checkout with card + US address; staff picks on home; staff inventory, picks, and order lookup. |
| UI direction applied (no extra screens) | Yes | Warm `:root` tokens (Approachable + Premium); cover-forward cards; combined stock badge; storefront vs restrained staff shell (`StoreNav` / `StaffNav`). Routes match `technical-plan.md` plus scaffold `GET /api/health` from task 2. No loyalty/recommendations/marketplace UI. |
| No secrets | Yes | `.env.example` placeholders only; no secret patterns in app source. |
| No invented rules | Yes | Checkout, stock, staff access, and fulfilment copy follow locked A1–A4; no international shipping, auto stock sync, or named weekdays. |
| No sensitive data | Yes | Fictional catalogue, addresses, and demo payment fields only. |
| Framework | Yes | Next.js App Router + TypeScript; system fonts in `globals.css`; no remote font CDNs. |
| No http(s) hrefs / CDNs | Yes | No clickable external URLs in UI or `docs/*.md`; local `/covers/*.svg` only. (`next-env.d.ts` has a non-rendered Next.js doc comment only.) |
| Write path `pocs/<KEY>/` only | Yes | POC confined to `pocs/SCRUM-6/`. |
| Approved tasks only | Yes | Implements TASK PLAN items 1–18; no non-goals (accounts required, till, recommendations, per-shop buyer counts, etc.). |
| No dangerous patterns | Yes | No `eval`, `new Function`, or `dangerouslySetInnerHTML`. |
| No large binaries | Yes | Small local SVG cover assets only. |
| License-safe deps | Yes | Standard Next/React/Tailwind/Vitest stack; no copyleft additions noted in `package.json`. |

## Diff vs task plan

| # | Task (summary) | Result |
| --- | --- | --- |
| 1 | Theme tokens + shell | `:root` matches `THEME_TOKENS`; `lib/theme.test.ts` green. |
| 2 | Scaffold + build | `npm run build` succeeded (review run). |
| 3 | Catalogue fixtures | `lib/catalog-fixtures.test.ts` + `store.test.ts` field checks. |
| 4 | `isInStock` (A2) | `lib/inventory.test.ts` covers all A2 cases. |
| 5 | Storefront nav + cards | `store-nav.tsx` + `BookCard`; `storefront-shell.test.ts`. |
| 6 | Home staff picks | `page.tsx` uses `getStaffPicks` + `BookCard`. |
| 7 | Genre browse | Index + `[slug]` with filter and `StockBadge`. |
| 8 | Author browse | Index + `[slug]` with filter and `StockBadge`. |
| 9 | Search | `/search?q=`; `lib/search.test.ts` title + ISBN. |
| 10 | Product page | `/books/[id]` metadata + combined badge only (no per-shop counts on buyer UI). |
| 11 | Cart | `/cart` add/update/remove; `lib/cart.test.ts`. |
| 12 | US address (A1) | `lib/us-address.ts` + `lib/us-address.test.ts`. |
| 13 | Guest checkout | `/checkout` + `POST /api/checkout`; rejects non-US in tests. |
| 14 | Confirmation + email affordance | `/checkout/confirmation` with order id, A4 copy, queued-email alert. |
| 15 | Staff order lookup | `/staff/orders` + `GET /api/staff/orders`; `findOrders` tests. |
| 16 | Staff shell (A3) | No auth in `staff/layout.tsx`; `lib/staff-access.test.ts`. |
| 17 | Staff inventory | Per-location edits; combined badge updates in `store.test.ts`; checkout path does not mutate on-hand (verified in `processCheckout` / API route). |
| 18 | Staff picks | `/staff/picks` + `PUT /api/staff/picks`; home reads live pick lists. |
| 19 | Vitest suite | `npm test`: 10 files, 25 tests passed (review run). |

## Advisory

Generic scaffold / weak domain fit (if applicable): **No.** Domain-themed copy, fictional Portland shop catalogue, staff/back-office split, and retokenized warm palette—not an unchanged template shell.

Other notes (non-blocking):

- Task 17’s “checkout does not auto-decrement stock” is enforced in code but has no dedicated Vitest assertion (Tester may add if desired).
- Staff picks UI edits comma-separated book ids (demo-appropriate, not buyer-facing).

## Outcome

**Pass → Tester** may run Vitest reporting, `mark-vitest`, and push gates.

PR comment: not posted (`gh` unavailable in review environment). Suggested PR comment:

> **Review: pass (SCRUM-6)** — POC matches RFP explicit UI, A1–A4, and TASK PLAN 1–18. Hard rules clean (no secrets/external links). `npm test` 25/25, `npm run build` OK. See `pocs/SCRUM-6/docs/review-report.md`.

Blockers: none.
