# RFP brief

- Jira key: SCRUM-11
- Attachments used: Bookstore-RFP.docx
- Extracted at: 2026-09-29

## Description

Willow & Page, an independent bookstore with two Portland shops (Hawthorne and Cedar), seeks a dedicated e-commerce website to sell physical books remotely. Today much demand is handled via direct messages and manual stock checks, which can double-promise the last copy. The engagement delivers a public catalogue with search and genre/author browse, product pages with per-location inventory rules, a shopping cart, guest card checkout, order confirmation email, staff guest-order lookup, staff-curated featured lists, and staff self-service updates to price and on-hand quantity per location. Mail order ships only from Hawthorne within Portland city limits on an existing three-day packing schedule; checkout must respect Hawthorne-only purchasability for shipment while displaying combined stock and in-store-only messaging when Cedar holds stock but Hawthorne does not. Target production go-live is 15 November 2026.

## Core capabilities

- Public product catalogue with browse (by genre and author) and search (by title or ISBN).
- Product detail pages showing cover image, title, author, ISBN, price, and a public in-stock indicator derived from combined on-hand quantity at Hawthorne and Cedar when staff enter quantity per location separately.
- Buyer-facing **available in store only** messaging when combined on-hand is positive but Hawthorne on-hand is zero; such titles are not purchasable for Portland mail-order shipment.
- Mail-order checkout availability based on **Hawthorne on-hand only**; Cedar-only stock must not be purchasable for Portland mail-order shipment.
- Shopping cart and card checkout with **guest checkout** (no mandatory buyer accounts).
- Order confirmation email to the buyer.
- Staff order lookup for guest purchases using order number and buyer email when callers contact the shops.
- Staff-curated featured lists (staff picks), not an automated recommendation engine.
- Staff tools to change price and on-hand quantity per location (Hawthorne and Cedar separately) without a developer, feeding combined public display and Hawthorne-only mail-order rules.
- Mail order to destinations within Portland city limits, shipped from Hawthorne on the existing three-day packing rhythm; returns and refunds within a fourteen-day limit (operational details inside that window not fixed in the RFP).
- Basic content management for catalogue and merchandising data (as stated under main features).

## UI requirements

### Explicit

- Product catalogue with browse and search.
- Browse by genre and author; search by title or ISBN.
- Product detail pages with fields: cover image, title, author, ISBN, price, and in-stock or not based on combined on-hand quantity at Hawthorne and Cedar.
- When combined on-hand is positive but Hawthorne on-hand is zero, the buyer experience shows that the title is **available in store only** and is not purchasable for Portland mail-order shipment.
- Shopping cart and checkout with card payment; guest checkout without mandatory account creation.
- Order confirmation to the buyer (email).
- Staff order lookup for guest purchases using order number and buyer email.
- Staff-curated featured lists (staff picks).
- Staff UI to update price and per-location on-hand quantity (Hawthorne and Cedar separately).
- Mail-order fulfilment constraint: Portland city limits only; shipping fees at checkout are for implementers to propose (not fixed in the RFP).
- No branding, colors, typography, wireframes, or named design system stated.

### Derived (from capabilities)

- **Genre browse** and **author browse** views or filters tied to catalogue browse (capability: browse by genre and author).
- **Search results** listing titles matching title or ISBN (capability: search).
- **Cart summary** view showing line items before checkout (capability: shopping cart).
- **Checkout flow** screens for guest buyer, Portland shipping address within city limits, card payment, and a shipping-fee line item once a fee model is chosen (capabilities: guest checkout, mail order within Portland, card checkout).
- **Post-checkout confirmation** state or screen complementing the confirmation email (capability: order confirmation to the buyer).
- **Availability affordances** on catalogue and detail: in-stock indicator from combined quantity; distinct state for mail-order purchasable vs in-store-only vs not available (capabilities: combined display, Hawthorne-only mail order, in-store-only messaging).
- **Staff featured-list management** UI to curate staff picks on the storefront (capability: staff-curated featured lists).
- **Staff catalogue admin** for price and per-location quantity entry at Hawthorne and Cedar (capability: staff tools without developer).
- **Staff guest order lookup** form or view using order number and email (capability: staff order lookup).

## UI direction

- Source: inferred
- Tone: Modern SaaS, Premium
- Context: Consumer-facing independent bookstore storefront for Portland readers, plus staff-facing admin for inventory and merchandising; warm retail brand without enterprise dashboard austerity.
- Density: moderate
- Demo quality: modern, demo-impressive-within-restraint
- Notes: Storefront uses a catalog-first layout with a staff-picks band as the first-viewport focal point, then searchable grid or list of titles. Signature element: cover-forward product cards with compact availability badges (in stock, in-store only, mail-order eligible) driven by the Hawthorne/Cedar rules. Restraint: placeholder cover art only, no stock lifestyle photography, no loyalty widgets or recommendation carousels beyond staff picks.

## Framework

Silent — default Next.js App Router + TypeScript

## Non-goals

- Ebooks and audiobooks.
- Gift wrap at checkout.
- Loyalty or punch-card programme.
- Third-party sellers or marketplace listings.
- Replacing in-store card terminals or till.
- Automated product recommendation engine.
- Cedar as a ship-from location for mail order.
- Book-club or members’ pricing programme (not defined).
- Budget, rate card, evaluation scorecard, or commercial model (not in RFP).

## Blocking gaps

- **Returns and refunds (fourteen-day window):** The RFP states a fourteen-day limit but does not fix product condition requirements, refund method, or return-shipping responsibility inside that window; buyer-facing returns copy and staff handling need PR-author alignment before those flows are specified in the plan.
- **Portland mail-order shipping fees at checkout:** Fee model is explicitly TBD for implementers to propose; checkout totals and fee presentation cannot be quoted from the RFP until Willow & Page confirms or accepts a proposed structure during Q&A.

## Sensitive data

The RFP describes a real business name (Willow & Page), Portland shop names (Hawthorne, Cedar), and operational schedules. It does not include real customer records, order numbers, or payment data. The POC must use fictional titles, ISBNs, buyers, and orders only.
