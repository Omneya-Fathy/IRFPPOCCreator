# Task plan

Comment this same checklist on the PR as `TASK PLAN`. Wait for the PR author to comment `/approve`.

- Jira key: SCRUM-6
- Status: waiting-for-approve

## Tasks

1. [ ] **Scaffold POC and Tailwind theme** — Run `scaffold-poc`; add Tailwind with theme tokens from UI direction (Approachable, Structured, moderate density, warm bookshop palette). — check: `globals.css` defines theme variables and `tailwind.config` maps them; app builds without error.

2. [ ] **Catalogue fixtures and combined-stock helper** — Fake books (with Hawthorne/Cedar quantities), genres, authors, and initial featured picks; `combinedInStock(book)` returns true when sum of location quantities > 0. — check: fixtures load with at least 3 books; `combinedInStock` is true when either location has stock and false when both are zero.

3. [ ] **Storefront home with staff picks** — Home page surfaces staff-curated featured lists with links into product pages; navigation to genre browse, author browse, and search. — check: featured pick ids resolve to book titles; home renders at least one featured book.

4. [ ] **Browse by genre and by author** — `/genre/[slug]` and `/author/[slug]` listing pages with combined in-stock indicators and links to product pages. — check: genre slug filters correct books; author slug filters correct books; listings expose combined in-stock only (no per-location columns).

5. [ ] **Search by title or ISBN** — `/search?q=` results page matching title (case-insensitive) or exact ISBN. — check: title query returns matching book; ISBN query returns matching book; no match returns empty set.

6. [ ] **Product page** — `/book/[id]` shows cover image, title, author, ISBN, price, and combined in-stock status; add-to-cart action. — check: product fields present for a known id; combined in-stock reflects fixture quantities; invalid id handled gracefully.

7. [ ] **Shopping cart** — `/cart` review with add, update quantity, and remove; persists for the session. — check: adding a book increases line count; quantity update reflected; remove clears line.

8. [ ] **Guest checkout (international)** — `/checkout` collects delivery address (including country — international allowed per A1) and fake card fields; guest may complete without account. — check: checkout accepts a non-US country; submitting valid form creates an order; inventory quantities unchanged after checkout.

9. [ ] **Order confirmation** — `/checkout/confirmation` post-checkout acknowledgment with order summary and confirmation email content preview (no real email send). — check: confirmation shows order id and buyer email content; references placed line items.

10. [ ] **Staff product maintenance (no auth)** — `/staff/products` lists books; staff can edit price and Hawthorne/Cedar on-hand quantity without developer involvement. — check: price edit updates fixture; per-location quantity edit updates fixture; shopper combined in-stock updates after edit; route has no login gate.

11. [ ] **Staff featured-list curation (no auth)** — `/staff/featured` to add, remove, and reorder staff picks shown on home. — check: adding a book to featured list surfaces it on home; removing hides it; route has no login gate.

12. [ ] **Staff landing shell** — `/staff` index linking to product maintenance and featured curation (not order lookup). — check: staff index links to `/staff/products` and `/staff/featured`; no link to order search.

## Out of scope

- Staff paid-order lookup or order search UI (operator A3 — excluded from POC)
- Real authentication or login for staff routes (operator A2 — demo routes only)
- Real payment processing or SMTP email
- Per-location in-stock display for shoppers (operator A4 — combined state only)
- Automatic inventory decrement on checkout or till integration
- Ebooks, gift wrap, loyalty, marketplace, Cedar mail fulfilment, and other items in `rfp-brief.md` non-goals

Do not implement anything not listed above.
