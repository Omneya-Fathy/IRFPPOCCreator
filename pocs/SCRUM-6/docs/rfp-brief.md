# RFP brief

- Jira key: SCRUM-6
- Attachments used: RFP.docx
- Extracted at: 2026-09-21

## Description

Willow & Page Booksellers operates two Portland bookshops (Hawthorne and Cedar). Today, off-floor demand is handled through Instagram messages, paper printouts, and phone payments, which leads to lost threads and double-promising the last copy of a title. This engagement delivers a public e-commerce website for physical books sold by Willow & Page: catalogue browsing, product pages, shopping cart, guest checkout with card payment and delivery address, order confirmation email, and staff tools to maintain price and on-hand quantity, curate featured lists, and locate paid orders. Website inventory is updated only when staff edit it; the in-store till is not linked and quantity does not change automatically on web payment or in-store sale. Mail orders are packed from the Hawthorne basement three days per week; Cedar remains walk-in only.

## Core capabilities

- Public e-commerce website for physical books owned and sold by Willow & Page (not a marketplace).
- Browse catalogue by genre and by author.
- Search catalogue by title or ISBN.
- Product pages showing cover image, title, author, ISBN, price, and whether the title is in stock using both Hawthorne and Cedar.
- Shopping cart.
- Guest checkout without requiring an account before paying (accounts optional).
- Checkout collects a delivery address and takes card payments on the website.
- Order confirmation email to the buyer after checkout.
- Staff-curated featured lists (staff picks); not an automated recommendation engine.
- Staff tools to update price and on-hand quantity without a developer.
- On-hand quantity on the website changes only when staff edit it (not on web payment success or in-store till sale).
- Staff can locate a paid order.
- Fulfilment: mail orders packed from the Hawthorne basement three days per week.

## UI requirements

### Explicit

- Product page with cover image, title, author, ISBN, price, and in-stock status using both Hawthorne and Cedar.
- Shopping cart.
- Checkout flow that a guest may complete, collecting a delivery address and card payment.
- Browse by genre and by author.
- Search by title or ISBN.
- Staff-curated featured lists (staff picks).
- Staff tools to update price and on-hand quantity without a developer.
- Staff capability to locate a paid order.
- Order confirmation email to the buyer (email content; no on-screen design specified).

### Derived (from capabilities)

- Storefront home or landing surface that surfaces staff-curated featured lists. *(Maps to: staff-curated featured lists)*
- Genre browse listing showing titles within a selected genre. *(Maps to: browse by genre)*
- Author browse listing showing titles for a selected author. *(Maps to: browse by author)*
- Search results listing for title or ISBN queries. *(Maps to: search by title or ISBN)*
- Catalogue or listing views that lead into product pages. *(Maps to: viewing products)*
- Cart review step before checkout. *(Maps to: shopping cart)*
- Post-checkout confirmation or acknowledgment screen in addition to the confirmation email. *(Maps to: checkout; order confirmation email)*
- In-stock / out-of-stock indicator on product and listing surfaces, informed by Hawthorne and Cedar availability. *(Maps to: product page in-stock using both locations)*
- Staff product maintenance UI to edit price and on-hand quantity. *(Maps to: staff tools to update price and on-hand quantity)*
- Staff order lookup UI to find a paid order. *(Maps to: staff can locate a paid order)*
- Staff featured-list curation UI to manage staff picks. *(Maps to: staff-curated featured lists)*

## UI direction

- Source: inferred
- Aura: Approachable, Structured
- Context: independent bookstore e-commerce for readers; small retail staff and guest shoppers; consumer-facing but operationally grounded
- Density: moderate
- Notes: warm, bookshop-appropriate storefront with clear catalogue grids and readable product detail; simple app shell for staff maintenance and order lookup; prominent in-stock signaling; restrained styling without marketplace or big-box retail chrome; no consumer marketing splash beyond featured staff picks

## Framework

Silent — default Next.js App Router + TypeScript.

## Non-goals

- Ebooks or audiobooks.
- Gift wrap at checkout.
- Loyalty or punch-card programme.
- Book-club or members' price programme.
- Third-party sellers or marketplace listings.
- Replacing or linking the in-store till or card terminal.
- Automatic website quantity changes on web payment success or in-store till sale.
- Requiring an account before paying.
- Automated recommendation engine.
- Shipping mail orders from Cedar (Cedar remains walk-in only).

## Blocking gaps

- **Shipping destinations** — the RFP states delivery address is collected at checkout but never defines where orders may be shipped (city only, country only, or broader). Checkout and fulfilment rules cannot be finalized without this.
- **Staff access for staff tools** — price/inventory editing, featured-list curation, and paid-order lookup are required, but who may use these tools and how they authenticate is not stated.
- **Paid-order lookup criteria** — staff must locate a paid order, but searchable fields (order number, buyer email, name, date, etc.) are not defined.
- **In-stock presentation across Hawthorne and Cedar** — availability must use both locations, but whether shoppers see one combined in-stock state or per-location detail is not specified.

## Sensitive data

The RFP describes shop operations and customer scenarios (Instagram orders, reserved hardcovers) but does not include real customer records, payment details, or order data. Use fake catalogue, buyer, and order data in the POC.
