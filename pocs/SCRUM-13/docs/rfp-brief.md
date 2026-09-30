# RFP brief

- Jira key: SCRUM-13
- Attachments used: Notes.md, Transcript.md
- Extracted at: 2026-09-30

## Description

Willow & Page is an independent bookseller with two Portland shops (Hawthorne and Cedar). This engagement is a **public e-commerce website for physical books only**—owned catalogue, not a marketplace—so customers can browse, search, cart, and pay by card online instead of ordering through Instagram DMs and phone calls. Hawthorne fulfils mail orders from the basement three days a week; Cedar remains walk-in only for this build. Staff must curate featured “staff picks” lists and update price and on-hand quantity without developer help. Success means a proper web storefront while in-store tills and card terminals stay unchanged.

## Core capabilities

- Public catalogue: browse by **genre** and **author**; **search** by title or ISBN.
- **Product page** with cover image, title, author, ISBN, price, and in-stock or not.
- **Shopping cart** and **paid checkout** for **card payments**.
- **Order confirmation email** to the buyer.
- **Staff-curated featured lists** (staff picks)—“lists we write,” **not** an automated recommender.
- **Staff tools** to update **price** and **on-hand quantity** without calling a developer.

## UI requirements

### Explicit

- Catalogue: browse by genre and author; search by title or ISBN.
- Product page must show: cover image, title, author, ISBN, price, in-stock or not.
- Shopping cart and checkout that take card payments.
- Site includes a **featured list** staff can curate (staff picks), explicitly **not** a recommendation engine.
- Staff need a UI to change price and quantity (no developer).
- Order confirmation by email to the buyer (channel stated; no wireframes or brand system).

**None stated** for branding, colors, typography, named design system, layout wireframes, or global navigation copy.

### Derived (from capabilities)

- **Catalogue / browse surfaces** — genre and author navigation affordances mapping to the public catalogue capability.
- **Search UI** — query input and results for title or ISBN search.
- **Product detail screen** — layout for cover, bibliographic metadata, price, and stock status (derived from product page capability).
- **In-stock indicators** — visible stock state on product and wherever titles are listed (derived from “in-stock or not” on product page and quantity updates).
- **Shopping cart view** — line items, quantities, and path to checkout (derived from shopping cart capability).
- **Checkout flow** — card payment capture and order submission (derived from paid checkout for card payments).
- **Post-checkout buyer feedback** — confirmation state or screen aligned with order placed / confirmation email (derived from order confirmation email; exact screen not quoted in RFP).
- **Staff picks presentation** — curated list section on the storefront (derived from staff-curated featured lists).
- **Staff inventory / pricing admin** — forms or tables to edit price and on-hand quantity (derived from staff tools capability).

## UI direction

Compatibility summary only. Canonical concept lives in `docs/ui-design-brief.md` (three directions, selected metaphor, signature moment). Sufficient = Tone + Density + Context (one sentence) + Notes (two implementable lines: focal layout, signature element, restraint) + Demo quality + pointer to the design brief.

- Source: inferred
- Tone: Modern SaaS, Editorial (Premium consumer bookstore)
- Context: Consumer-facing indie bookstore storefront for Portland shoppers buying physical books online; staff curate picks and maintain stock/pricing through simple admin affordances—warm trust without marketplace clutter.
- Density: moderate
- Demo quality: modern, demo-impressive-within-restraint
- Notes: Catalogue-first layout with an asymmetric **staff-picks** band (shelf-talker rhythm) above or beside a genre-led book grid; product detail uses a large typographic cover tile as the viewport anchor. Signature: expandable **shelf-talker** cards on staff picks—short curator note revealed on interaction, echoing in-store handwritten talkers. Restraint: typographic covers only (no faux jacket photography), no loyalty or marketplace chrome, no generic centered marketing hero.
- Design brief: `docs/ui-design-brief.md` (required for new runs)

## Framework

Silent — default Next.js App Router + TypeScript.

## Non-goals

- Ebooks and audiobooks (later, not this engagement).
- Gift wrap at checkout.
- Loyalty / punch-card programme.
- Third-party sellers listing on the site (not a marketplace).
- Replacing the in-store card terminal or till.
- Book-club or “members’ price” programme (mentioned in passing; not defined; not in scope unless defined later).
- Automated recommendation engine (staff picks only).
- Cedar as a second ship-from location (later).
- Inferring shipping destinations or a shipping map (RFP did not name destinations).

## Blocking gaps

- **Checkout identity:** Ben wants every buyer to **create an account** before paying; Priya would not lock that in. Notes explicitly state **guest vs account is not chosen**. Checkout UI and order lookup behavior cannot be finalized without a human decision.
- **Shipping scope:** Fulfilment is from Hawthorne on a three-day-a-week pack schedule, but **destinations were never named** (local, national, or international). Checkout cannot specify shipping options or copy without clarification; do not infer a shipping map.

## Sensitive data

No real customer records or payment data appear in the RFP attachments. Use plausible fake names, titles, ISBNs, and order details in the POC—no real Portland customer or card data.
