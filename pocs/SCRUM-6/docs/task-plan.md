# Task plan

- Jira key: SCRUM-6
- Status: approved

## Tasks

1. [x] Scaffold Next.js App Router POC under `pocs/SCRUM-6/` with Vitest — check: test runner passes with placeholder test
2. [x] Seed local fake catalogue (books with cover placeholder, title, author, ISBN, price, Hawthorne/Cedar quantities) — check: catalogue API returns seeded data
3. [ ] Browse by genre and author on `/catalog` — check: filtering by genre and author returns expected subsets
4. [ ] Search by title or ISBN on `/search` — check: Vitest covers title and ISBN matches
5. [ ] Product page at `/products/[isbn]` with cover, title, author, ISBN, price, single in-stock flag — check: Vitest asserts all required fields render
6. [ ] Shopping cart (add, update qty, remove) — check: Vitest covers cart operations
7. [ ] Guest checkout with delivery address; validate Egypt-only shipping; no payment — check: order created without account; address required; on-hand qty unchanged after checkout
8. [ ] Order confirmation view + email payload log — check: confirmation shows order id and line items
9. [ ] Staff routes open without auth at `/staff/*` — check: pages accessible without login
10. [ ] Staff inventory: edit price and on-hand quantity per location — check: Vitest verifies manual edit persists; no auto-decrement on checkout
11. [ ] Staff order lookup — check: Vitest finds order by id
12. [ ] Staff-curated featured lists on home + staff editor — check: featured ISBNs render on `/`; staff edit updates list
13. [ ] Hard-rule sweep: no clickable external URLs, no secrets, fake data only — check: Vitest or static assertion pass

## Out of scope

Ebooks, gift wrap, loyalty, till integration, auto stock sync, recommendations, Cedar ship-from, account-required checkout, real payment processing.
