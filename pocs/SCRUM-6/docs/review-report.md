# Review report

- Jira key: SCRUM-6
- Verdict: pass

## Hard rules

| Rule | Pass? | Notes |
| --- | --- | --- |
| UI specs | Yes | PR author approved minimal functional layout. Nav, catalogue grid, product detail, cart, checkout, staff admin, and order confirmation are present. |
| No secrets | Yes | `.env.example` contains empty placeholders only. No `process.env` usage or committed `.env`. |
| No invented rules | Yes | Egypt-only shipping, single in-stock flag, open staff routes, no payment, and email payload logging match PR-author answers and `rfp-brief.md` gap resolutions. |
| No sensitive data | Yes | Seeded catalogue and checkout use fictional titles and `example.com` email. |
| Framework | Yes | Next.js App Router + TypeScript per RFP default. |
| No http(s) hrefs / CDNs | Yes | UI uses internal `Link` routes only. No `next/font/google`, remote images, or external `href` values in `app/` or `components/`. `lib/hard-rules.test.ts` asserts no external hrefs. |
| Write path `pocs/<KEY>/` only | Yes | All application code and docs are under `pocs/SCRUM-6/`. |
| Approved tasks only | Yes | Implementation maps to tasks 1–13. Extra `/api/health` scaffold endpoint is harmless and returns fake-local JSON only. |
| No dangerous patterns | Yes | No `eval`, `new Function`, or `dangerouslySetInnerHTML`. |
| No large binaries | Yes | `.next/` and `node_modules/` are gitignored and not staged. |
| License-safe deps | Yes | `next`, `react`, `vitest`, and related deps are permissive (MIT/Apache-style). |

## Diff vs task plan

| Task | Status | Evidence |
| --- | --- | --- |
| 1. Scaffold Next.js + Vitest | Done | `package.json`, App Router layout, Vitest config; 18 tests pass locally. |
| 2. Seed fake catalogue | Done | `lib/store.ts` seeds books with cover placeholder fields, Hawthorne/Cedar quantities. |
| 3. Browse by genre and author on `/catalog` | Done | `app/catalog/` with genre/author filters; store tests cover filtering. |
| 4. Search by title or ISBN on `/search` | Done | `app/search/` + `/api/search`; store tests cover title and ISBN matches. |
| 5. Product page `/products/[isbn]` | Done | `ProductDetails` renders cover, title, author, ISBN, price, single in-stock flag; component tests assert fields. |
| 6. Shopping cart | Done | `/cart` + `/api/cart` support add, update qty, remove; store tests cover operations. |
| 7. Guest checkout, Egypt-only, no payment, stock unchanged | Done | `/checkout` validates address and Egypt-only country; checkout creates order without payment; stock quantities unchanged after checkout (tested). |
| 8. Order confirmation + email payload log | Done | `/orders/[id]` shows order id, line items, and logged email payload (`getEmailForOrder`). |
| 9. Staff routes open without auth | Done | `/staff/inventory`, `/staff/orders`, `/staff/featured` have no middleware or auth gate. |
| 10. Staff inventory edits | Done | Staff UI and `/api/staff/inventory` persist price and per-location qty; no auto-decrement on checkout (tested). |
| 11. Staff order lookup | Done | `/staff/orders` + API lookup by id; store test finds order by id. |
| 12. Featured lists on home + staff editor | Done | `/` renders featured ISBNs; `/staff/featured` edits list; store tests cover updates. |
| 13. Hard-rule sweep | Done | `lib/hard-rules.test.ts` scans UI source for external hrefs. |

### PR-author decisions verified

- **Egypt only shipping:** `isEgyptShipping()` accepts `Egypt` / `EG`; non-Egypt checkout rejected.
- **Single in-stock display:** `isInStock()` sums Hawthorne + Cedar qty; UI shows “In stock” / “Out of stock” only.
- **Staff open without auth:** Staff pages state demo mode; no login required.
- **No payment:** Checkout copy and flow omit payment fields.
- **Log email payload:** `emailLog` populated at checkout; confirmation page renders payload.
- **Minimal functional layout:** Shared nav, simple CSS, placeholder book covers.

## Outcome

Pass → Tester may run Vitest formally, write `docs/test-report.md`, and stamp the Vitest gate.
