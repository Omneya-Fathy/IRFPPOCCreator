# RFP brief

- Jira key: SCRUM-19
- Attachments used: RFP_TravelAgency.html
- Extracted at: 2026-10-19 (UTC)

## Description

Horizon Voyages is a UK full-service leisure travel agency (high-street shops plus Manchester call centre) seeking a **responsive, mobile-first public booking website** to replace a brochure-style 2019 site. Phase-one focus is **agency-constructed packaged leisure** (flights plus hotel, hotel-only city breaks, curated specials)—not an open marketplace—with browse, search, merchandising, basket, **hosted card checkout**, and **held-quote** capture for consultant follow-up. Marketing needs a **CMS with two-person approval**, campaign landing areas (featured, honeymoon, wedding), SEO migration (redirects, travel-guide import), trust/regulatory presentation hooks, and operational hand-off so online bookings reach consultants the same day.

## Core capabilities

- Responsive, mobile-first presentation of packaged leisure travel products across device sizes.
- Product listing, browse, and search with filters (dates, budget, board basis, destination themes, departure airport).
- Departure airport selection via **dropdown lists** (Manchester and Birmingham standard; London when product rules allow)—not map-based search in phase one.
- Product detail pages with imagery, descriptions, indicative or “from” pricing, and key attributes (destination, duration, board basis, departure airport where relevant).
- Shopping basket and checkout with **card payment capture via hosted payment fields**.
- **Held-quote capture** for prospects who do not pay online immediately—routed to consultants, distinct from completed card checkout.
- Order confirmation communications (email at minimum).
- Content management for marketing copy, imagery, and merchandising (featured, honeymoon, wedding, and similar sections); imagery limited to buyer-owned and licensed assets.
- Contact page presenting United Kingdom business hours and clear treatment of bank holidays (buyer-supplied content).
- Staff-curated lists and campaigns without algorithmic personalisation.
- Technical search engine optimisation baseline.
- Trust and regulatory presentation hooks (for example ATOL protection and review embeds) using buyer-approved wording and third-party terms.
- Analytics and advertising measurement integration points aligned to an updated privacy policy.
- Operational notification paths so online bookings reach operations the same day.
- Legacy URL redirect mapping (on the order of twelve URLs) and blog/travel-guide content migration (on the order of fifty articles).
- Integration aim: booking reference placed into the reservation desktop environment the same day (mechanism to be designed).
- CMS user documentation and train-the-trainer for marketing and shop publishers.
- Post-go-live success review four weeks after launch.
- Accessibility improvements in principle (conformance level not set in brief).
- Penetration test required before go-live per IT policy (cost split undecided).

## UI requirements

### Explicit

- **Responsive, mobile-first** customer website (not native apps).
- **Departure airport filter** implemented as **dropdown lists** (Manchester, Birmingham, London when offered)—explicitly **not** a map-based airport picker in phase one.
- **Product detail pages** with imagery, descriptions, price or “from” price, and key attributes.
- **Shopping basket and checkout** with **hosted card fields** (hosted payment fields assumed pending acquirer confirmation).
- **Held-quote capture** UI distinct from completed card checkout (prospect hold/request routed to consultants).
- **Contact page** with UK business hours and bank-holiday messaging (content supplied or confirmed by buyer).
- **Merchandising** sections and landing treatment for **featured**, **honeymoon**, and **wedding** campaigns.
- **Trust strip and footer placements** for regulatory/trust content (copy and placement subject to legal approval—not invented in build).
- **Shop picker on checkout** called out as **missing from current wireframes** (capability implied for shop attribution; behaviour undecided in ambiguities).
- Brand **colours and fonts referenced in deck**; not all assets web-ready (buyer to supply or approve design involvement)—no full design system named in the HTML brief.
- Wireframes referenced in delivery materials; no pixel specs in the attachment.

### Derived (from capabilities)

- **Site shell and navigation** linking browse, campaigns, contact, and content areas (derived: responsive packaged-leisure site).
- **Home or hub** surfacing staff-curated featured merchandising and campaign entry points (derived: staff-curated campaigns; merchandising sections).
- **Search and browse results** view with filter affordances for dates, budget, board basis, destination themes, and departure airport dropdown (derived: product listing, browse, search, filters).
- **Product detail** layout emphasising destination, duration, board basis, departure airport, and price presentation (derived: product detail pages).
- **Basket** line items and summary leading to checkout (derived: shopping basket).
- **Checkout** steps including guest identification (email minimum per ambiguity notes), hosted payment field placeholders, and placeholder for **shop selection** where buyer rules require attribution (derived: checkout; shop picker gap in wireframes).
- **Held-quote request** form or step alternative to payment completion (derived: held-quote capture).
- **Order confirmation** screen or state after successful checkout (derived: order confirmation email; checkout completion).
- **Campaign landing pages** for honeymoon, wedding, and featured product lists (derived: merchandising landing pages).
- **Travel guide / blog** listing and article reading layout (derived: content migration ~50 articles).
- **Trust and reviews** embed zones and ATOL-style trust presentation areas (derived: trust and regulatory presentation hooks).
- **Cookie/consent and analytics** placement hooks consistent with privacy policy (derived: analytics and advertising integration)—implementation detail deferred to buyer policy.
- **CMS authoring** is out of customer POC scope unless explicitly planned later; customer-facing read-only presentation of CMS-driven copy is implied.

## UI direction

Compatibility summary only. Canonical concept lives in `docs/ui-design-brief.md` (three directions, selected metaphor, signature moment).

- Source: inferred
- Tone: Modern SaaS, Premium (consumer leisure storefront)
- Context: Public leisure travellers and advertising-driven first-time bookers compare agency-built packages and indicative prices on mobile or desktop; the UI must feel trustworthy and scannable like a high-street agency, not a generic admin tool.
- Density: moderate
- Demo quality: modern, demo-impressive-within-restraint
- Notes: Focal layout is a **departure-board-inspired browse rail**—filter controls above a scan-friendly list where each package row leads with airport, nights, board basis, and “from” price. Signature element: **per-row “ticket stub” price strip** with typographic destination covers (no faux photography). Restraint: no stock hero photos, no map airport picker, no glassmorphism or marketplace grid of identical cards; typographic covers and honest “from” pricing labels only.
- Design brief: `docs/ui-design-brief.md`

## Framework

**Silent — default Next.js App Router + TypeScript**

## Non-goals

- Native mobile applications.
- Open marketplace or third-party seller listings.
- Map-based departure airport picker in phase one.
- Algorithmic “recommended for you” personalisation.
- Replacing in-store card terminals.
- Full back-office or reservation desktop replacement (integration reference only).
- Phase-one corporate self-serve negotiated-rate portal (roadmap only).
- Phase-one cruise marketing landing pages unless separately sponsored (leadership lean phase two).
- Live chat, WhatsApp, or post-departure digital support widgets (no channel chosen).
- Live chat during browsing; SMS notifications until provider and consent model chosen.
- Online insurance upsell (not committed); gift voucher redemption online (nice-to-have, not deeply scoped).
- Progressive web application as a dedicated app project.
- National loyalty points pilot rollout.
- Invented compliance or ATOL copy; invented review widget terms.
- Scraping or importing images from third-party image search.

## Blocking gaps

Business rules and conflicts that the Planner must resolve with the buyer before implementation can mirror production behaviour:

1. **Displayed price rule:** cached or “from” guide prices versus live bookable prices at checkout—finance and sales have not chosen; checkout messaging and honour behaviour depend on this policy.
2. **Guest versus registered accounts:** guest checkout with email lookup minimum is stated, but whether accounts are mandatory for some journeys remains undecided.
3. **Online payment schedule:** whether checkout mirrors traditional thirty percent deposit with balance eight weeks before travel, or another compliant schedule—legal and acquirer confirmation pending.
4. **Flight-only on the web in phase one:** packaged leisure is the stated direction; shop-level exceptions and workshop notes conflict—scope for any flight-only SKU on the web is ambiguous.
5. **Shop attribution on checkout:** round-robin call centre versus retail consultant ownership when a shop is selected; wireframes lack shop picker; human resources and sales policy unsettled.
6. **Supplier feed failure UX:** hide affected product, telephone call-to-action, or honest temporary unavailability—leadership prefers honesty but exact UI behaviour not chosen.
7. **Currency and VAT display:** default GBP with occasional EUR quotes; inclusive versus exclusive VAT rules per product type not documented—listing, detail, basket, and checkout must follow buyer rules once supplied.

Non-blocking: hosting topology, WCAG target level, cookie banner style, brand deck assets not web-ready, reservation system name, acquirer contract details.

## Sensitive data

The RFP discusses passport data, marketing consent, and payment card capture via hosted fields but does not include real customer records. The POC must use **fake names, emails, itineraries, and payment placeholders** only—no real PANs, passports, or live PII.
