# Task plan

Comment this same checklist on the Jira issue as `TASK PLAN`. Wait for a human to comment `/approve` or run `/irfp-approve` **after Q1–Q5 are answered**.

- Jira key: SCRUM-10
- Status: waiting-for-approve

**Blocked on PR-author answers:** Q1 (shipping fee → **A1**), Q2 (returns → **A2**), Q3 (staff access → **A3**), Q4 (fulfilment copy → **A4**), Q5 (order lookup → **A5**).

## TASK PLAN

1. [ ] Map brief UI direction onto scaffold tokens (`app/globals.css` `:root`) and storefront layout shell (Modern SaaS + Premium, moderate density)—check: Vitest asserts primary/muted/card CSS variables **differ from scaffold defaults** and match expected token map; no Tailwind reinstall.
2. [ ] Scaffold POC app from `templates/poc-next` if missing (`scaffold-poc`)—check: `npm run build` succeeds in `pocs/SCRUM-10/`.
3. [ ] Add fictional catalogue fixtures (genres, authors, ISBNs, prices, Hawthorne/Cedar on-hand)—check: fixture loader returns expected count and required fields; covers use **TypographicCover** metadata only (no cover image assets under `public/`).
4. [ ] Implement stock helpers: combined in-stock, `mailOrderPurchasable` (Hawthorne > 0), `inStoreOnly` (combined > 0 && Hawthorne = 0)—check: Vitest cases for out-of-stock, combined-only-Cedar, Hawthorne-available, and in-store-only edge case.
5. [ ] Storefront shell: warm header, top nav (browse, search, cart), cover-forward cards with TypographicCover and combined-stock badge—check: shared card component used on home and listings.
6. [ ] Home `/`: staff-picks band as **first-viewport focal**, then genre tiles or compact title grid (signature pattern from brief Notes)—check: Vitest or route test asserts staff-picks section precedes main catalogue grid; at least one pick list renders.
7. [ ] Genre browse: index + `[slug]` listing pages—check: genre filter returns only matching books; badges and in-store-only treatment on cards.
8. [ ] Author browse: index + `[slug]` listing pages—check: author filter returns only matching books; badges and in-store-only treatment on cards.
9. [ ] Search results `/search?q=` for title and ISBN—check: Vitest covers title match and ISBN match; stock badges on results.
10. [ ] Product page `/books/[id]`: TypographicCover, metadata, price, combined badge, distinct **available in store only** treatment, mail-order add-to-cart disabled when Hawthorne = 0—check: Vitest for in-store-only and mail-order-eligible titles.
11. [ ] Shopping cart `/cart`: add/update/remove; block or remove lines not mail-order-eligible—check: Cedar-only title cannot proceed to checkout for shipment; Hawthorne-eligible lines totals correct.
12. [ ] Portland city limits address validator (shared module)—check: Vitest rejects non-Portland fixture addresses; accepts valid Portland demo address.
13. [ ] Guest checkout `/checkout`: Portland delivery + fake card, no account; shipping fee line per **A1**—check: fee matches **A1** rule; invalid destination rejected; valid flow creates order.
14. [ ] Post-checkout `/checkout/confirmation` plus demo order-confirmation email affordance; fulfilment messaging per **A4**—check: confirmation shows order id and **A4** copy (no contradicting weekday names unless **A4** names them).
15. [ ] Returns information surface (buyer-facing route or section) per **A2** fourteen-day framing—check: Vitest or content test asserts **A2** decisions reflected in copy/workflow stub.
16. [ ] In-memory order store and staff order lookup `/staff/orders` per **A5**—check: lookup succeeds/fails according to **A5** matching rule on fake orders.
17. [ ] Staff shell `/staff` and sub-routes with access model per **A3**—check: Vitest or route test confirms behavior matches **A3** (e.g. unauthenticated load if no gate).
18. [ ] Staff inventory `/staff/inventory`: edit price and Hawthorne/Cedar on-hand (manual only)—check: storefront combined badge, in-store-only, and mail-order eligibility update after edits; checkout does not auto-decrement stock.
19. [ ] Staff picks `/staff/picks`: curate lists shown in home staff-picks band—check: home updates after pick list change.
20. [ ] Vitest suite for all checks above; `npm test` green—check: `mark-vitest` eligible after review pass; document **Demo appeal** and **Hierarchy** in `review-report.md` if not unit-testable.

## Out of scope

Do not implement anything not listed above or marked non-goals in `rfp-brief.md` (ebooks, gift wrap, loyalty, marketplace, till replacement, automated recommendations, Cedar as ship-from, real payment/email, lifestyle photography, loyalty widgets, international or non-Portland shipping unless PR author overrides in Jira).
