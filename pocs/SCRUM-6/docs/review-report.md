# Review report

- Jira key: SCRUM-6
- Verdict: **pass**

## Hard rules

| Rule | Pass? | Notes |
| --- | --- | --- |
| UI specs (explicit) | Yes | Product, cart, checkout, browse, search, staff picks, and staff maintenance screens present. Cover uses a color placeholder block instead of an image file — acceptable for fake-data POC. |
| UI direction applied (no extra screens) | Yes | Warm bookshop palette, moderate density, combined in-stock badges. No paid-order lookup (correctly excluded per A3). Staff landing links only to products and featured. |
| No secrets | Yes | `.env.example` has empty placeholders only; no real credentials in source. |
| No invented rules | Yes | International shipping (A1), no auth (A2), combined stock (A4), and excluded order lookup (A3) match `docs/ambiguity-log.md`. |
| No sensitive data | Yes | Fake catalogue, buyer email, and card fields only. |
| Framework | Yes | Next.js App Router + TypeScript. |
| No http(s) hrefs / CDNs | Yes | All links are in-app routes. No `next/font/google` or remote assets. `globals.css` disables external anchor clicks defensively. |
| Write path `pocs/<KEY>/` only | Yes | Changes confined to `pocs/SCRUM-6/`. |
| Approved tasks only | Mostly | Scaffold `/api/health` remains from template; not in task plan but harmless stub. |
| No dangerous patterns | Yes | No `eval`, `new Function`, or `dangerouslySetInnerHTML`. |
| No large binaries | Yes | No `node_modules` or `.next` in git index. |
| License-safe deps | Yes | Next.js, React, Tailwind, Vitest — permissive OSS licenses. |

## Diff vs task plan

| Task | Status | Notes |
| --- | --- | --- |
| 1. Scaffold + Tailwind theme | Pass | `globals.css` theme variables; `tailwind.config.ts` maps tokens; build succeeds. |
| 2. Fixtures + `combinedInStock` | Pass | 5 fake books; helper correct in tests. |
| 3. Storefront home with staff picks | Pass | `FeaturedBooksSection` (client) reads live `getFeaturedBooks()` on mount; header links to genre, author, search. |
| 4. Browse by genre and author | Pass | `GenreBooksSection` / `AuthorBooksSection` (client) load books from store; combined `StockBadge` only. |
| 5. Search by title or ISBN | Pass | `SearchResultsSection` (client) matches title (case-insensitive) and exact ISBN. |
| 6. Product page | Pass | `BookDetailView` (client) shows cover placeholder, title, author, ISBN, price, combined stock, add-to-cart; invalid id handled. |
| 7. Shopping cart | Pass | `/cart` add/update/remove works within client session. |
| 8. Guest checkout (international) | Pass | Country field accepts international values; order created without inventory decrement. |
| 9. Order confirmation | Pass | `CheckoutForm` redirects with `?orderId=`; `OrderConfirmationView` (client) loads order via `getOrder(orderId)` from the same client store — order summary, line items, and email preview render correctly. |
| 10. Staff product maintenance | Pass | Staff edits persist in client store; shopper-facing `BookDetailView` and listing sections read updated price/stock on navigation. |
| 11. Staff featured curation | Pass | Add/remove/reorder updates client store; `FeaturedBooksSection` on home reflects changes after navigation. |
| 12. Staff landing shell | Pass | `/staff` links to `/staff/products` and `/staff/featured` only; no order lookup link. |

### Re-review notes (server/client store split fix)

Previous fail was caused by server-rendered pages reading a separate server module instance of `lib/store.ts` while mutations happened in the client bundle. Developer fix:

- **Checkout → confirmation:** `router.push(\`/checkout/confirmation?orderId=...\`)` plus client `OrderConfirmationView` reading `searchParams` and `getOrder(orderId)`.
- **Staff → storefront:** Shopper data surfaces (`FeaturedBooksSection`, `BookDetailView`, `GenreBooksSection`, `AuthorBooksSection`, `SearchResultsSection`) are client components that read live store data on mount. Static metadata (genre/author names) remains server-side from immutable fixtures — acceptable.

Server-only store reads for genres/authors in `StorefrontHeader` and page headers use static fixture data not mutated by staff — no regression.

## Outcome

**Pass** → Tester may run Vitest and stamp `mark-vitest`.

Vitest: 20/20 passed (`npm test`). Build: succeeded (`npm run build`).

PR comment: `gh` CLI unavailable in review environment; orchestrator should post the summary below on the PR.
