# Technical plan

- Jira key: SCRUM-6
- Stack (RFP named / Next.js default / PR-author override): RFP silent — **Next.js App Router + TypeScript**, demo UI, static fixtures + in-memory state (no real payment gateway or email provider).

## Resolved business rules (A1–A4)

| ID | Decision |
| --- | --- |
| **A1** | Checkout accepts **US domestic** delivery addresses only. Collect standard US fields (name, street, city, state, ZIP). Reject non-US country/region and clearly invalid ZIP patterns in demo validation. Helper copy may state US shipping only. |
| **A2** | Buyer-facing views show **one combined** in-stock / out-of-stock badge. `inStock` = `(hawthorneOnHand > 0 \|\| cedarOnHand > 0)`. No per-location breakdown or numeric counts on storefront product or listing cards. Staff inventory UI still edits per-location quantities. |
| **A3** | **No authentication** on staff routes—local POC demo only; `/staff/*` is reachable without login or shared password. |
| **A4** | **Placeholder** fulfilment messaging only: generic copy that mail orders ship from Hawthorne on a weekly schedule (e.g. three packing days per week per RFP) **without naming weekdays**. Optional generic expectation (e.g. “typical processing time”) is allowed; no invented calendar. |

## Screens and routes

From explicit + derived UI requirements in `rfp-brief.md`. No extra screens.

| Route | Purpose |
| --- | --- |
| `/` | Storefront home surfacing staff-curated featured lists (staff picks). |
| `/browse/genre` | Genre navigation / listing entry. |
| `/browse/genre/[slug]` | Catalogue listing filtered by genre. |
| `/browse/author` | Author navigation / listing entry. |
| `/browse/author/[slug]` | Catalogue listing filtered by author. |
| `/search` | Search results for title or ISBN query (`?q=`). |
| `/books/[id]` | Product page: cover, title, author, ISBN, price, combined in-stock badge (**A2**). |
| `/cart` | Cart review before checkout. |
| `/checkout` | Guest checkout: US domestic delivery address (**A1**) + fake card payment fields; no required account. |
| `/checkout/confirmation` | Post-checkout on-site confirmation with placeholder fulfilment copy (**A4**). |
| `/staff` | Staff operations shell—no auth gate (**A3**). |
| `/staff/inventory` | Edit price and on-hand quantity per location (manual only; no till integration). |
| `/staff/picks` | Curate featured staff-pick lists shown on home. |
| `/staff/orders` | Locate paid orders (search/filter by order id or buyer email in fake data). |

Listing views (`/browse/*`, `/search`) reuse product cards with the same combined stock badge as the product page (**A2**).

## UI direction

Copy from `rfp-brief.md` (Developer uses this for theme only; do not restyle beyond tokens/layout).

- Source: inferred
- Aura: Approachable, Premium
- Context: Independent bookstore e-commerce for readers shopping online; consumer-facing storefront with a separate staff back-office feel; warm retail brand without marketplace clutter.
- Density: moderate
- Notes: Consumer catalog uses readable product cards with cover-forward layout; clear in-stock badge; simple top nav (browse, search, cart); checkout as a focused linear flow without account gate; staff tools use a restrained admin shell distinct from the shop aesthetic; no loyalty gamification or recommendation widgets.

First implementation step: map aura + density onto existing scaffold tokens in `app/globals.css` `:root` and the layout shell; do not reinstall Tailwind.

## Local data

- **Catalogue fixtures** (`lib/` or `data/`): fictional books with title, author, ISBN, genre, price, cover asset path, `hawthorneOnHand`, `cedarOnHand` (staff edits mutate in-memory copy for demo).
- **Stock helper**: `isInStock(book)` implements **A2** for all buyer-facing UI.
- **Featured lists**: named staff-pick lists referencing book ids; editable in staff UI.
- **Cart**: in-memory cart (session-scoped client state or server module store—minimal, no persistence required unless demo flow needs refresh survival).
- **Orders**: in-memory list appended on successful checkout; includes US delivery address, line items, fake payment status, timestamps, placeholder fulfilment note (**A4**); staff order lookup reads this store.
- **Email**: demo affordance only (e.g. record “confirmation email queued” on order or show copy on confirmation page)—no SMTP, no real addresses from external sources.
- **Payment**: fake card form validation (required fields, no real processor).
- **Address validation**: US-only rules per **A1** at checkout API or shared validator.

## Server/API

Minimal Route Handlers only where the demo needs them (optional pattern):

- `POST /api/cart` — add/update line items (if not purely client-side).
- `POST /api/checkout` — validate US domestic address per **A1**, create order with fulfilment placeholder copy per **A4**, return confirmation payload.
- `PATCH /api/staff/inventory/[id]` — staff price/qty updates (no auth per **A3**).
- `GET /api/staff/orders` — lookup paid orders for staff view.

Prefer fixtures + in-memory module store in `lib/store.ts` (scaffold pattern) unless a handler is needed for Vitest or staff mutations.

## Vitest checks (must match task plan)

- Theme tokens reflect Approachable + Premium aura and moderate density (primary, muted, card surfaces).
- Home renders at least one staff-pick list from fixtures.
- Genre and author browse routes filter catalogue fixtures correctly.
- Search returns matches by title and by ISBN.
- Product page and listing cards show combined in-stock badge per **A2** (`isInStock` helper).
- Cart add/remove and totals behave correctly.
- Checkout rejects non–US-domestic / invalid address per **A1** and succeeds for valid US address; creates order without requiring account.
- Confirmation page (and/or order record) shows placeholder fulfilment messaging per **A4** (no named weekdays).
- Staff inventory update changes price/qty visible on storefront product/listing (combined badge updates when both locations hit zero).
- Staff picks update changes home featured lists.
- Staff order lookup finds a paid order by id or buyer email (fake data).
- Staff routes are reachable without login per **A3**.
- No clickable `http(s)` links in UI; no secret patterns in POC files.
