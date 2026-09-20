# Technical plan

- Jira key: SCRUM-6
- Stack: Next.js App Router + TypeScript (RFP silent default)

## Screens and routes

| Route | Purpose |
| --- | --- |
| `/` | Home with featured book list |
| `/catalog` | Browse by genre and author filters |
| `/search` | Search by title or ISBN |
| `/products/[isbn]` | Product detail (cover, title, author, ISBN, price, single in-stock flag) |
| `/cart` | Shopping cart |
| `/checkout` | Guest checkout — delivery address, Egypt-only validation, no payment |
| `/orders/[id]` | Order confirmation + email payload log |
| `/staff/inventory` | Edit price and per-location on-hand qty (no auth) |
| `/staff/orders` | Order lookup by id |
| `/staff/featured` | Edit featured ISBN list |

Shared nav linking catalogue, search, cart, staff tools.

## Local data

- In-memory store module (`lib/store.ts`) seeded with fake books (cover placeholder, title, author, ISBN, genre, price, Hawthorne/Cedar quantities)
- Orders array (created at checkout)
- Featured ISBN list
- Email log array for confirmation payloads

Single in-stock flag derived: in stock if sum of location quantities > 0.

## Server/API

- Route Handlers for catalogue, search, cart operations, checkout, staff inventory/orders/featured
- Checkout validates Egypt-only shipping; creates order without payment; does not decrement stock
- Staff inventory edits persist in memory

## Vitest checks (must match task plan)

- Placeholder/scaffold test passes
- Catalogue API returns seeded data
- Genre and author filtering
- Title and ISBN search
- Product page fields including single in-stock flag
- Cart add/update/remove
- Checkout creates order, requires address, Egypt validation, stock unchanged
- Order confirmation shows id and line items; email payload logged
- Staff inventory edit persists; no auto-decrement on checkout
- Staff order lookup by id
- Featured list renders on home; staff edit updates list
- No clickable external URLs in UI
