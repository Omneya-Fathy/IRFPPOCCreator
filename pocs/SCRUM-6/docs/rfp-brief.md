# RFP brief

- Jira key: SCRUM-6
- Attachments used: RFP.docx
- Extracted at: 2026-09-22

## Description

Willow & Page Booksellers (two Portland shops: Hawthorne and Cedar) needs a public e-commerce website for **physical books** owned by the shop—not a marketplace. The site should replace Instagram-message ordering with a catalogue buyers can browse away from the counter, product pages showing cover, price, and in-stock status informed by **both** locations, a cart, and **guest checkout** with card payment and delivery address (accounts optional). Staff must edit price and on-hand quantity without a developer, curate featured “staff pick” lists, and locate paid orders. Website stock is **manual only**: it does not auto-update on web payment or in-store till sales, and the till is not integrated. Mail orders are packed from the Hawthorne basement three days per week; Cedar is walk-in only and not a ship-from location.

## Core capabilities

- Public **catalogue** of physical books sold by Willow & Page (not third-party sellers).
- **Browse** by genre and by author.
- **Search** by title or ISBN.
- **Product page** with cover image, title, author, ISBN, price, and whether the title is in stock (using Hawthorne and Cedar).
- **Shopping cart**.
- **Checkout** a guest may complete without creating an account; card payment; delivery address collected.
- **Order confirmation email** to the buyer.
- **Staff-curated featured lists** (staff picks)—not an automated recommendation engine.
- **Staff tools** to update price and on-hand quantity without a developer; website quantity changes only when staff edit it.
- **Staff can locate a paid order**.
- **Fulfilment** context: mail orders packed from Hawthorne basement three days per week; Cedar remains walk-in only.

## UI requirements

### Explicit

- Product page showing cover image, title, author, ISBN, price, and in-stock status (using both Hawthorne and Cedar).
- Browse by genre and author.
- Search by title or ISBN.
- Shopping cart.
- Checkout flow: guest may complete; card payment; delivery address provided.
- Staff-curated featured lists (staff picks).
- Staff-facing capability to change price and on-hand quantity and to locate a paid order (no visual design or screen names specified).

### Derived (from capabilities)

- **Storefront home or landing** surfacing staff-curated featured lists — maps to staff-curated featured lists.
- **Genre browse** listing or navigation — maps to browse by genre.
- **Author browse** listing or navigation — maps to browse by author.
- **Search results** view for title or ISBN queries — maps to search.
- **Catalogue / product listing** pages reachable from browse paths — maps to viewing products.
- **Cart review** step before checkout — maps to shopping cart and checkout.
- **Checkout steps** for delivery address and card payment (guest, no required account) — maps to guest checkout and delivery address.
- **Post-checkout confirmation** affordance on the site (in addition to email) — maps to order confirmation email.
- **In-stock indicator** on product (and likely listing) views reflecting both shops — maps to in-stock using Hawthorne and Cedar.
- **Staff operations area** (separate from public storefront) for editing price/quantity, managing featured lists, and finding paid orders — maps to staff tools and locate paid order.

## UI direction

- Source: inferred
- Aura: Approachable, Premium
- Context: Independent bookstore e-commerce for readers shopping online; consumer-facing storefront with a separate staff back-office feel; warm retail brand without marketplace clutter.
- Density: moderate
- Notes: Consumer catalog uses readable product cards with cover-forward layout; clear in-stock badge; simple top nav (browse, search, cart); checkout as a focused linear flow without account gate; staff tools use a restrained admin shell distinct from the shop aesthetic; no loyalty gamification or recommendation widgets.

## Framework

Silent — default Next.js App Router + TypeScript.

## Non-goals

- Ebooks and audiobooks.
- Gift wrap at checkout.
- Loyalty punch-card programme.
- Third-party sellers or marketplace listings.
- Replacing or linking the in-store till or card terminal.
- Automatic website quantity changes on web payment success or in-store counter sale.
- Book-club or members' price programme.
- Requiring an account before paying (accounts remain optional).
- Automated recommendation engine.
- Shipping mail orders from Cedar (walk-in only).
- Future scope called out in RFP: ebooks/audiobooks, gift wrap, loyalty, Cedar as second ship-from (not this engagement).

## Blocking gaps

- **Shipping destinations** were never named (e.g. local city only, domestic country only, or international)—needed to validate delivery address rules and checkout copy.
- **In-stock presentation across Hawthorne and Cedar**: RFP requires stock “using both” locations but does not state whether buyers see one combined availability flag, per-shop breakdown, or numeric counts—needed to implement product and listing displays consistently.
- **Staff access**: no authentication model, roles, or entry point described for staff price/quantity edits, featured-list curation, and order lookup—needed before staff UI can reflect real access rules.
- **Fulfilment schedule**: “three days a week” from Hawthorne basement is stated but **which days** and any buyer-facing delivery expectations are not defined—may affect order detail staff views and confirmation messaging (confirm with PR author if POC should show placeholders only).

## Sensitive data

The RFP describes fictional shop operations (Portland locations, Instagram channel) but does not include real customer records. Use fake catalogue, orders, and addresses in the POC; do not paste real payment or PII from any source.
