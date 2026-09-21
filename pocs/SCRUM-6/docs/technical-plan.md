# Technical plan

- Jira key: SCRUM-6
- Stack (RFP named / Next.js default / PR-author override): Next.js App Router + TypeScript (RFP silent — default)

## Screens and routes

From explicit + derived UI requirements in `rfp-brief.md`. Staff paid-order lookup is **out of scope** per operator answer A3.

| Route | Screen | Notes |
| --- | --- | --- |
| `/` | Storefront home | Surfaces staff-curated featured lists; entry to browse and search |
| `/genre/[slug]` | Genre browse listing | Titles within a selected genre; combined in-stock on cards |
| `/author/[slug]` | Author browse listing | Titles for a selected author; combined in-stock on cards |
| `/search` | Search results | Query by title or ISBN (`?q=`) |
| `/book/[id]` | Product page | Cover, title, author, ISBN, price, combined in-stock |
| `/cart` | Cart review | Line items before checkout |
| `/checkout` | Guest checkout | Delivery address (international allowed per A1), fake card fields |
| `/checkout/confirmation` | Post-checkout acknowledgment | Order summary; confirmation email content shown as preview (no real send) |
| `/staff` | Staff landing | No authentication (A2); links to staff tools |
| `/staff/products` | Staff product maintenance | Edit price and per-location on-hand quantity (Hawthorne, Cedar) |
| `/staff/featured` | Staff featured-list curation | Manage staff picks surfaced on home |

**Excluded:** `/staff/orders` or any paid-order lookup UI (A3).

## UI direction

- Source: inferred
- Aura: Approachable, Structured
- Context: independent bookstore e-commerce for readers; small retail staff and guest shoppers; consumer-facing but operationally grounded
- Density: moderate
- Notes: warm, bookshop-appropriate storefront with clear catalogue grids and readable product detail; simple app shell for staff maintenance and order lookup; prominent in-stock signaling; restrained styling without marketplace or big-box retail chrome; no consumer marketing splash beyond featured staff picks

## Local data

Static/in-memory fixtures under `data/` or `lib/`:

- **Books** — id, title, author, ISBN, genre, cover image path, price, `quantityHawthorne`, `quantityCedar`
- **Genres** and **authors** — slugs for browse routes
- **Featured picks** — ordered list of book ids (staff-editable in POC via in-memory state)
- **Cart** — client-side or in-memory cart state (session-local)
- **Orders** — append-only in-memory list created at checkout (for confirmation screen/email preview only; not searchable)

**Combined stock (A4):** Shoppers see one `inStock` boolean per title: `true` when `quantityHawthorne + quantityCedar > 0`, else `false`. Staff maintenance UI edits per-location quantities; listing and product surfaces do not expose per-location breakdown to shoppers.

**Inventory rules:** Quantity changes only when staff edit it. Checkout does not decrement stock.

**Shipping (A1):** Checkout address form includes country and accepts international destinations (no geo restriction in validation).

**Staff access (A2):** `/staff/*` routes render without login. No auth middleware or credential UI.

## Server/API

No server routes required unless the Developer needs a thin stub. Prefer static imports and in-memory modules. Fake card payment and email are simulated in the client or a single checkout helper — no live payment or SMTP.

## Vitest checks (must match task plan)

1. Theme/bootstrap — Tailwind config and CSS variables exist; aura tokens applied
2. Fixtures — sample books, genres, authors load; combined stock helper returns correct boolean
3. Home — featured picks resolve to book records
4. Genre browse — filters books by genre slug
5. Author browse — filters books by author slug
6. Search — matches title and ISBN (case-insensitive title)
7. Product page — exposes cover, title, author, ISBN, price, combined in-stock
8. Cart — add, update quantity, remove line items
9. Checkout — accepts international address fields; creates order record with delivery address
10. Confirmation — acknowledgment includes order id and email preview content
11. Staff products — price and per-location quantity edits persist in memory
12. Staff featured — add/remove/reorder featured picks
13. Staff access — staff routes reachable without auth gate (no login redirect)
