# Technical plan

- Jira key: SCRUM-13
- Stack (RFP named / Next.js default / PR-author override): RFP silent — **Next.js App Router + TypeScript**, demo UI, static fixtures + in-memory state (no real payment gateway or email provider).

## Resolved business rules (Q1 → A1–A3)

| ID | Decision |
| --- | --- |
| **A1** | **Guest checkout** — no account creation required to pay by card in the POC. |
| **A2** | Target **go-live 15 November 2026** — captured for planning; does not add POC features beyond demo scope. |
| **A3** | **US domestic shipping only** at checkout. Collect US address fields; reject non-US country/region and clearly invalid ZIP patterns in demo validation. Helper copy may state US shipping only. |

## Screens and routes

From explicit + derived UI requirements in `rfp-brief.md`. No extra screens.

| Route | Purpose |
| --- | --- |
| `/` | Storefront home: **staff-picks talker rail** + genre-led catalogue entry (Direction A composition). |
| `/browse/genre` | Genre navigation / listing entry. |
| `/browse/genre/[slug]` | Catalogue grid filtered by genre (typographic covers, stock badges). |
| `/browse/author` | Author navigation / listing entry. |
| `/browse/author/[slug]` | Catalogue grid filtered by author. |
| `/search` | Search results for title or ISBN (`?q=`). |
| `/books/[id]` | Product page: typographic cover anchor, title, author, ISBN, price, mail-eligible in-stock badge. |
| `/cart` | Cart review before checkout. |
| `/checkout` | Guest checkout (**A1**): US delivery address (**A3**) + fake card fields. |
| `/checkout/confirmation` | Post-checkout confirmation + demo order-email affordance; placeholder Hawthorne fulfilment copy (no weekday names). |
| `/staff` | Staff operations shell — no auth gate (POC default). |
| `/staff/inventory` | Edit price and on-hand quantity (Hawthorne + Cedar fields for staff; buyer UI uses Hawthorne mail-eligible rule). |
| `/staff/picks` | Curate featured staff-pick lists and curator notes shown in talker rail on home. |

Listing views (`/browse/*`, `/search`) reuse product cards with the same stock badge and typographic covers.

## UI direction

Copy from `rfp-brief.md` (Developer uses this for theme only; implement the selected design brief concept).

- Source: inferred
- Tone: Modern SaaS, Editorial (Premium consumer bookstore)
- Context: Consumer-facing indie bookstore storefront for Portland shoppers buying physical books online; staff curate picks and maintain stock/pricing through simple admin affordances—warm trust without marketplace clutter.
- Density: moderate
- Demo quality: modern, demo-impressive-within-restraint
- Notes: Catalogue-first layout with an asymmetric **staff-picks** band (shelf-talker rhythm) above or beside a genre-led book grid; product detail uses a large typographic cover tile as the viewport anchor. Signature: expandable **shelf-talker** cards on staff picks—short curator note revealed on interaction, echoing in-store handwritten talkers. Restraint: typographic covers only (no faux jacket photography), no loyalty or marketplace chrome, no generic centered marketing hero.
- Design brief: `docs/ui-design-brief.md` (required for new runs)

First implementation step: map Direction A tokens onto existing scaffold in `app/globals.css` `:root` and `lib/theme-tokens.ts`; keep root `import "./globals.css"`; do not reinstall Tailwind.

## UI design contract

Selected concept from `docs/ui-design-brief.md` — **Direction A — Shelf Talker Counter**.

- Selected direction (name): **A — Shelf Talker Counter**
- Design metaphor: Independent bookstore counter with handwritten shelf talkers—picks table, then labeled genre aisles.
- Emotional target: Reassured warmth: “Real shop, real stock, real people picked this book.”
- Visual personality (3–5 traits): Paper-warm surfaces and ink-forward type; genre section signage (chips/labels); stock-forward badges; curator voice in italic/quoted blocks on picks; calm commerce chrome until cart/checkout.
- First-viewport visual anchor: **Horizontal staff-picks talker rail** over genre-led typographic cover grid on home/browse; product page **large typographic cover tile** as first-viewport anchor.
- Hierarchy (PRIMARY → SECONDARY → SUPPORTING → UTILITY): PRIMARY — cover tile + title; talker headline on picks rail. SECONDARY — author, price, in-stock state; genre headers. SUPPORTING — ISBN, curator note body, cart lines. UTILITY — nav, search, admin labels.
- Signature moment: Shopper **expands a shelf-talker staff pick** and reads a short human recommendation in curator voice before add-to-cart.
- Visual rhythm / controlled asymmetry: Wide talker band → denser cover grid → compact cart → focused checkout; one slightly larger talker or taped-edge offset in the rail; product cover column wider than metadata.
- Media strategy: **TypographicCover** only (~3:4); no RFP image files, no stock photos, no committed jacket assets under `public/`.
- Content density and fixture notes: Moderate storefront — multiple genres, 3–5 staff picks with distinct curator notes, mixed in-stock states; realistic indie titles/authors/ISBNs (no Lorem, no repeated “Test User”).
- Responsive adaptation: Talker rail horizontal scroll with snap; grid 2→1 columns; product stacks cover above metadata keeping cover anchor; expand interaction works with tap and keyboard; admin tables stack labeled fields on narrow screens.
- Anti-patterns to avoid: Generic centered hero + three feature cards; purple/blue AI gradients; glassmorphism; fake cover photos; recommendation widgets; marketplace rows; loyalty UI; algorithm carousels; identical grid with no talker band.
- Memorable-moment answer: User recalls **reading an expandable staff shelf-talker** on a pick—not “red buttons” or “clean layout.”
- Any-app test (why this is not generic SaaS): Shelf-talker curation, typographic cover tiles, and genre-aisle composition read as **indie bookstore**, not generic CRUD or marketplace templates.

## Local data

- **Catalogue fixtures**: fictional books with title, author, ISBN, genre, price, `hawthorneOnHand`, `cedarOnHand` (staff edits mutate in-memory copy).
- **Stock helper**: `isMailEligible(book)` → `hawthorneOnHand > 0` for all buyer-facing badges (POC default in ambiguity log).
- **Staff picks**: list entries with book id + curator blurb for talker cards; editable in `/staff/picks`.
- **Cart**: in-memory cart (client or module store).
- **Orders**: in-memory on successful checkout; US address per **A3**, line items, fake payment status, guest buyer email field; confirmation shows placeholder fulfilment note.
- **Email**: demo only (“confirmation email queued” or on-page copy)—no SMTP.
- **Payment**: fake card validation (required fields, no processor).
- **Address validation**: US-only per **A3**.

## Server/API

Minimal Route Handlers only if needed:

- `POST /api/checkout` — validate US address (**A3**), create guest order (**A1**), return confirmation payload.
- `PATCH /api/staff/inventory/[id]` — staff price/qty updates (no auth).
- Optional cart/picks handlers if Vitest or mutations require them.

Prefer `lib/store.ts` + fixtures pattern from scaffold.

## Vitest checks (must match task plan)

- `lib/theme-wiring.test.ts`: token map reflects Direction A (cream paper surfaces, deep ink, brick-red primary) and differs from scaffold defaults.
- Home/browse: staff-picks talker rail present; at least one pick expandable with curator note (signature moment).
- Genre/author browse and search filter fixtures; listing cards show mail-eligible stock badge.
- Product page asymmetric layout with typographic cover anchor and required metadata fields.
- Cart line totals and quantity updates.
- Checkout rejects non-US / invalid ZIP (**A3**); guest flow succeeds without account (**A1**).
- Confirmation shows order id and placeholder fulfilment copy (no weekday names).
- Staff inventory edit updates buyer-visible stock badge; staff picks edit updates home talker content.
- Keyboard operability for talker expand/collapse (accessible control pattern).
- No clickable `http(s)` links in UI; `TypographicCover` used instead of photographic covers.
