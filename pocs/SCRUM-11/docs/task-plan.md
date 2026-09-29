# Task plan

Comment this same checklist on the PR as `TASK PLAN`. Wait for the PR author to comment `/approve` or run `/irfp-approve` **after Q1–Q3 are answered and logged**.

- Jira key: SCRUM-11
- Status: waiting-for-approve

**Blocked on PR author:** A1 (shipping fee — Q1), A2 (returns scope — Q2), A3 (staff access — Q3). Revise tasks 13–14 and any returns task once answers land.

## TASK PLAN

1. [ ] Map brief UI direction onto scaffold tokens (`app/globals.css` `:root`) and storefront layout shell (Modern SaaS + Premium, moderate density)—check: Vitest asserts primary/muted/card CSS variables **differ from scaffold defaults** and match expected token map; no Tailwind reinstall.
2. [ ] Scaffold POC app from `templates/poc-next` if missing (`scaffold-poc`)—check: `npm run build` succeeds in `pocs/SCRUM-11/`.
3. [ ] Add fictional book catalogue fixtures (genres, authors, ISBNs, prices, per-location on-hand)—check: fixture loader returns expected count and required fields; covers use **TypographicCover**, not image assets under `public/`.
4. [ ] Implement availability helpers (`combinedOnHand`, `isInStock`, `isMailOrderEligible`, `isInStoreOnly`) per RFP Hawthorne/Cedar rules—check: Vitest matrix for out-of-stock, mail-order eligible, and in-store-only fixture books.
5. [ ] Implement storefront shell: top nav (browse, search, cart), cover-forward product cards with compact availability badges—check: home route renders nav and card structure matching Notes signature pattern (staff-picks band focal + catalogue).
6. [ ] Home page `/`: staff-picks band in first viewport, then catalogue entry—check: at least one pick list and linked book appear; picks band precedes main grid in DOM order.
7. [ ] Genre browse: index + `[slug]` listing pages—check: genre filter returns only matching books; badges reflect availability helpers.
8. [ ] Author browse: index + `[slug]` listing pages—check: author filter returns only matching books; badges reflect availability helpers.
9. [ ] Search results page (`/search?q=`) for title and ISBN—check: Vitest covers title and ISBN match; badges on results.
10. [ ] Product page `/books/[id]`: TypographicCover, metadata, price, badges (mail-order eligible / in-store only / not available)—check: in-store-only title shows correct copy and cannot be added to cart for mail order.
11. [ ] Shopping cart `/cart`: add/update/remove **mail-order-eligible** titles only—check: in-store-only and out-of-stock cannot be purchased; line totals correct.
12. [ ] Portland address validator (shared module)—check: Vitest rejects addresses outside Portland city limits; accepts valid Portland fixture address.
13. [ ] Guest checkout `/checkout`: Portland delivery + fake card fields, guest-only—check: invalid destination rejected; valid Portland flow creates order; cart must be mail-order eligible only.
14. [ ] Checkout shipping fee line per **A1** (Q1 answer)—check: Vitest asserts fee/total behavior matches chosen model (or placeholder copy if A1 selects placeholder).
15. [ ] Post-checkout `/checkout/confirmation` plus demo order-confirmation email affordance—check: confirmation shows order id and generic three-days-per-week fulfilment placeholder **without weekday names**.
16. [ ] Returns/refunds scope per **A2** (Q2 answer)—check: if (a) static policy text, policy visible where specified; if (b) demo return form, minimal submit affordance; if (c) omit, no returns routes in app.
17. [ ] In-memory order store and staff guest order lookup `/staff/orders`—check: paid order retrievable only when **both** order number and buyer email match.
18. [ ] Staff shell `/staff` and sub-routes per **A3** (Q3 answer)—check: access model matches answer (e.g. unauthenticated `/staff/inventory` loads when A3 is no gate).
19. [ ] Staff inventory `/staff/inventory`: edit price and Hawthorne/Cedar on-hand (manual only)—check: storefront badges and mail-order eligibility update after edits; checkout does not auto-decrement stock.
20. [ ] Staff picks `/staff/picks`: curate lists shown in home staff-picks band—check: home band updates after pick list change.
21. [ ] Vitest suite for all checks above; `npm test` green—check: `mark-vitest` eligible after review pass; **Demo appeal** and **Hierarchy** noted in `review-report.md` if not unit-testable.

## Out of scope

Do not implement anything not listed above or marked non-goals in `rfp-brief.md` (ebooks, gift wrap, loyalty, marketplace, till integration, automated recommendations, Cedar as ship-from, book-club pricing, real payment processor, real email SMTP, lifestyle product photography, loyalty/recommendation carousels beyond staff picks).
