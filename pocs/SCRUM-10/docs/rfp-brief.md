# RFP brief

- Jira key: SCRUM-10
- Attachments used: Bookstore-RFP.html
- Extracted at: 2026-09-29

## Description

Willow & Page, a Portland bookseller with Hawthorne and Cedar shops, seeks a dedicated e-commerce website for physical books—not a marketplace or replacement for in-store terminals. The site must expose a public catalogue with search and browse, reflect combined on-hand inventory across both locations while restricting Portland mail-order purchasability to Hawthorne stock only, support guest checkout with card payment and confirmation email, and give staff self-service tools for pricing, per-location quantity, featured lists, and guest order lookup. Mail order ships from Hawthorne within Portland city limits on an existing three-day packing rhythm; target go-live is 15 November 2026.

## Core capabilities

- **Public catalogue** — Browse by genre and author; search by title or ISBN.
- **Product detail** — Cover image, title, author, ISBN, price, and a public in-stock indicator derived from combined Hawthorne and Cedar on-hand when staff enter quantity per location.
- **Dual-location inventory rules** — Staff enter on-hand quantity separately for Hawthorne and Cedar; public display uses combined totals; Portland mail-order checkout availability uses **Hawthorne on-hand only** (Cedar-only stock is not purchasable for shipment).
- **In-store-only buyer messaging** — When combined on-hand is positive but Hawthorne on-hand is zero, show that the title is **available in store only** and it is not purchasable for Portland mail-order shipment.
- **Shopping cart and checkout** — Card payment; **guest checkout** without mandatory buyer account creation.
- **Order confirmation** — Email to the buyer after purchase.
- **Guest order lookup (staff)** — Locate guest orders using order number and buyer email when callers contact the shops.
- **Staff-curated featured lists** — Staff picks; not an automated recommendation engine.
- **Staff admin without developers** — Update price and per-location on-hand quantity (Hawthorne and Cedar separately), feeding combined display and Hawthorne-only mail-order rules.
- **Portland mail-order fulfilment** — Ship only to addresses within Portland city limits from Hawthorne basement on the existing three-day packing schedule; Cedar does not ship in this engagement.
- **Returns and refunds** — Operate within a **fourteen-day limit**; product condition, refund method, and return-shipping responsibility inside that window are **not fixed** in the RFP.
- **Checkout shipping fees** — Portland mail-order shipping fees at checkout are **for implementers to propose** (not fixed in the RFP).
- **Target go-live** — 15 November 2026.

## UI requirements

### Explicit

- Product pages must present: cover image, title, author, ISBN, price, and in-stock state from combined location quantities.
- Buyer-facing copy/messaging: **available in store only** when combined stock exists but Hawthorne on-hand is zero (not purchasable for Portland mail-order).
- Catalogue affordances named: browse by genre and author; search by title or ISBN.
- Shopping cart and checkout with card payment; guest checkout without mandatory accounts.
- Order confirmation email to the buyer.
- Staff-curated featured lists (staff picks) on the public site.
- Staff tools to change price and per-location on-hand quantity without developer involvement.
- Staff order lookup for guest purchases using order number and buyer email.
- Returns and refunds presentation should align with a fourteen-day limit (operational details inside that window left open).
- No wireframes, color palette, typography system, or named design system stated.

### Derived (from capabilities)

- **Catalogue landing / browse hub** — Entry to genre and author browse paths. *(Maps to: public catalogue.)*
- **Genre browse and author browse views** — List or grid of titles within a selected genre or author. *(Maps to: browse by genre and author.)*
- **Search results** — Results for title or ISBN queries. *(Maps to: search by title or ISBN.)*
- **Product detail page** — Full field set plus combined in-stock indicator and mail-order vs in-store-only purchasability states. *(Maps to: product detail; dual-location inventory rules; in-store-only messaging.)*
- **Shopping cart** — Line items, quantities, and path to checkout respecting Hawthorne-only mail-order availability. *(Maps to: shopping cart.)*
- **Guest checkout flow** — Shipping within Portland city limits, card payment, no required account creation; shipping fee line item once model is defined. *(Maps to: checkout; Portland mail-order fulfilment; checkout shipping fees.)*
- **Post-checkout confirmation** — Buyer-facing confirmation in addition to email. *(Maps to: order confirmation.)*
- **Featured / staff picks section** — Surfaces staff-curated lists on the storefront. *(Maps to: staff-curated featured lists.)*
- **Staff order lookup screen** — Search by order number and email for guest orders. *(Maps to: guest order lookup.)*
- **Staff inventory and pricing admin** — Per-title price and Hawthorne/Cedar quantity entry driving public display and mail-order rules. *(Maps to: staff admin without developers.)*
- **Returns information surface** — Buyer- or staff-facing copy/workflow for returns within the fourteen-day frame once rules are confirmed. *(Maps to: returns and refunds.)*

## UI direction

- Source: inferred
- Tone: Modern SaaS, Premium
- Context: Consumer-facing indie bookstore e-commerce for Portland readers and remote mail-order buyers; staff use separate admin flows for inventory, pricing, and order lookup.
- Density: moderate
- Demo quality: modern, demo-impressive-within-restraint
- Notes: Catalog-first layout with a warm header and a staff-picks band as the first-viewport focal point, leading into genre tiles or a compact title grid. Signature: book-cover-forward product cards with a clear combined-stock badge and a distinct **available in store only** treatment when Hawthorne mail-order quantity is zero. Restraint: use placeholder cover art only, no stock lifestyle photography, no loyalty widgets or marketplace chrome beyond the stated capabilities.

## Framework

Silent — default Next.js App Router + TypeScript.

## Non-goals

- Ebooks and audiobooks.
- Gift wrap.
- Loyalty or punch-card programme.
- Third-party sellers or marketplace listings.
- Replacing in-store card terminals or till.
- Book-club or members’ price programme (not defined).
- Automated product recommendation engine.
- Cedar as a ship-from location.
- Budget, rate card, evaluation scorecard, or commercial model (not in RFP).

## Blocking gaps

- **Portland mail-order shipping fees at checkout** — Fee model and presentation are explicitly TBD; checkout cannot be finalized without a proposed rule or PR-author decision.
- **Returns and refunds inside the fourteen-day window** — Product condition, refund method, and return-shipping responsibility are not fixed; buyer/staff returns UX and operations need alignment with Willow & Page.

## Sensitive data

The RFP describes fictional business context (Willow & Page, Portland shops) only. No real customer, payment, or employee records appear. Use fake catalogue, order, and contact data in the POC.
