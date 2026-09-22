# Task plan

Comment this same checklist on the PR as `TASK PLAN`. Wait for the PR author to comment `/approve` or run `/irfp-approve`.

- Jira key: SCRUM-6
- Status: ready-for-approve

**Decisions locked:** A1 US domestic shipping; A2 one combined in-stock flag; A3 staff routes unauthenticated; A4 placeholder fulfilment copy (no weekdays).

## TASK PLAN

1. [ ] Map brief UI direction onto scaffold tokens (`app/globals.css` `:root`) and storefront layout shell (Approachable + Premium, moderate density)—check: Vitest asserts primary/muted/card CSS variables match expected token map; no Tailwind reinstall.
2. [ ] Scaffold POC app from `templates/poc-next` if missing (`scaffold-poc`)—check: `npm run build` succeeds in `pocs/SCRUM-6/`.
3. [ ] Add fictional book catalogue fixtures (genres, authors, ISBNs, prices, per-location on-hand, local cover assets)—check: fixture loader returns expected count and required fields.
4. [ ] Implement `isInStock(book)` per **A2** (`hawthorneOnHand > 0 || cedarOnHand > 0`)—check: Vitest cases for both-zero, one-location, both-positive.
5. [ ] Implement storefront shell: top nav (browse, search, cart), cover-forward product cards with combined stock badge—check: home route renders nav and card structure.
6. [ ] Home page: staff-curated featured lists from fixtures—check: at least one pick list and linked book appears on `/`.
7. [ ] Genre browse: index + `[slug]` listing pages—check: genre filter returns only matching books; cards use `isInStock`.
8. [ ] Author browse: index + `[slug]` listing pages—check: author filter returns only matching books; cards use `isInStock`.
9. [ ] Search results page (`/search?q=`) for title and ISBN—check: Vitest covers title match and ISBN match cases; stock badge on results.
10. [ ] Product page `/books/[id]` with cover, metadata, price, single combined in-stock/out-of-stock badge (**A2**)—check: no per-shop counts on buyer UI.
11. [ ] Shopping cart `/cart` (add from product/listing, update qty, remove)—check: line totals and item count correct.
12. [ ] US address validator per **A1** (shared module)—check: Vitest rejects non-US / invalid ZIP; accepts valid US domestic fixture address.
13. [ ] Guest checkout `/checkout`: US delivery address + fake card fields, no account required—check: invalid destination rejected; valid US flow creates order.
14. [ ] Post-checkout `/checkout/confirmation` plus demo order-confirmation email affordance—check: confirmation shows order id and **A4** placeholder fulfilment copy (no weekday names).
15. [ ] In-memory order store and staff order lookup `/staff/orders`—check: paid order retrievable by order id or buyer email.
16. [ ] Staff shell `/staff` and sub-routes with **no auth gate** (**A3**)—check: Vitest or route test confirms `/staff/inventory` loads without credentials.
17. [ ] Staff inventory `/staff/inventory`: edit price and Hawthorne/Cedar on-hand (manual only)—check: storefront combined badge updates after edits; checkout does not auto-decrement stock.
18. [ ] Staff picks `/staff/picks`: curate lists shown on home—check: home updates after pick list change.
19. [ ] Vitest suite for all checks above; `npm test` green—check: `mark-vitest` eligible after review pass.

## Out of scope

Do not implement anything not listed above or marked non-goals in `rfp-brief.md` (ebooks, gift wrap, loyalty, marketplace, till integration, auto stock sync, recommendations, Cedar as ship-from, required accounts, staff login, international shipping, per-shop buyer stock breakdown, named fulfilment weekdays).
