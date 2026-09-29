# Technical plan

- Jira key: SCRUM-10
- Stack (RFP named / Next.js default / PR-author override): RFP silent — **Next.js App Router + TypeScript**, demo UI, static fixtures + in-memory state (no real payment gateway or email provider).

## Pending PR-author decisions (Q1–Q5)

Implementation tasks reference **A1–A5** once answered on Jira (`A1` … `A5` matching Q1 … Q5). Do not treat `/approve` as valid until these are answered.

| ID | Topic | Blocks |
| --- | --- | --- |
| **A1** | Portland mail-order shipping fee at checkout | Checkout shipping line item and totals |
| **A2** | Returns/refunds inside fourteen-day window | Returns information surface copy/workflow |
| **A3** | Staff access model | Whether `/staff/*` requires credentials |
| **A4** | Fulfilment schedule buyer messaging | Confirmation and order record copy |
| **A5** | Guest order lookup matching rule | Staff order lookup form validation and search |

## Fixed rules (from RFP brief — not open)

- **Combined public stock**: Buyer-facing combined in-stock indicator when `hawthorneOnHand + cedarOnHand > 0` (or either location > 0 per combined total semantics in fixtures).
- **Mail-order purchasability**: Portland mail-order checkout may include a title only when **Hawthorne on-hand > 0**; Cedar-only stock is not shippable.
- **In-store-only messaging**: When combined on-hand > 0 but Hawthorne on-hand = 0, show **available in store only** and do not allow Portland mail-order purchase for that title.
- **Shipping destination**: Mail order ships only to addresses within **Portland city limits** (demo address validation; no international or broader US unless PR author overrides in a Jira comment).
- **Guest checkout**: No mandatory buyer account; fake card fields only.
- **Covers**: Placeholder cover presentation via **TypographicCover** (no lifestyle photography, no decorative assets under `public/` unless RFP supplies files).

## Screens and routes

From explicit + derived UI requirements in `rfp-brief.md`. No extra screens.

| Route | Purpose |
| --- | --- |
| `/` | Catalogue hub: warm header, **staff-picks band as first-viewport focal**, then genre tiles or compact title grid. |
| `/browse/genre` | Genre navigation entry. |
| `/browse/genre/[slug]` | Titles filtered by genre. |
| `/browse/author` | Author navigation entry. |
| `/browse/author/[slug]` | Titles filtered by author. |
| `/search` | Search results for title or ISBN (`?q=`). |
| `/books/[id]` | Product detail: TypographicCover, title, author, ISBN, price, combined stock badge, in-store-only treatment, mail-order vs blocked add-to-cart. |
| `/cart` | Cart; line items respect Hawthorne-only mail-order rules. |
| `/checkout` | Guest checkout: Portland delivery address, card payment, shipping fee line per **A1**; no account. |
| `/checkout/confirmation` | On-site confirmation plus demo order-confirmation email affordance; fulfilment copy per **A4**. |
| `/returns` (or equivalent single surface) | Returns information aligned with fourteen-day limit per **A2**. |
| `/staff` | Staff shell; access per **A3**. |
| `/staff/inventory` | Edit price and Hawthorne/Cedar on-hand (manual only). |
| `/staff/picks` | Curate featured lists on home. |
| `/staff/orders` | Guest order lookup per **A5**. |

Listing views reuse product cards with combined stock badge and in-store-only treatment consistent with the product page.

## UI direction

Copy from `rfp-brief.md` (Developer uses this for theme only; do not restyle beyond tokens/layout).

- Source: inferred
- Tone: Modern SaaS, Premium
- Context: Consumer-facing indie bookstore e-commerce for Portland readers and remote mail-order buyers; staff use separate admin flows for inventory, pricing, and order lookup.
- Density: moderate
- Demo quality: modern, demo-impressive-within-restraint
- Notes: Catalog-first layout with a warm header and a staff-picks band as the first-viewport focal point, leading into genre tiles or a compact title grid. Signature: book-cover-forward product cards with a clear combined-stock badge and a distinct **available in store only** treatment when Hawthorne mail-order quantity is zero. Restraint: use placeholder cover art only, no stock lifestyle photography, no loyalty widgets or marketplace chrome beyond the stated capabilities.

First implementation step: map tone + density onto existing scaffold tokens in `app/globals.css` `:root` and the layout shell; do not reinstall Tailwind. Vitest must assert primary/muted/card CSS variables **differ from scaffold defaults** and reflect Modern SaaS, Premium at moderate density. Primary route `/` must implement the Notes **signature pattern** (staff-picks band focal, cover-forward cards, in-store-only treatment).

## Local data

- **Catalogue fixtures**: fictional Willow & Page books with genre, author, ISBN, price, `hawthorneOnHand`, `cedarOnHand`; staff edits mutate in-memory copy.
- **Stock helpers**: `combinedInStock`, `mailOrderPurchasable` (Hawthorne > 0), `inStoreOnly` (combined > 0 && Hawthorne === 0) for badges and cart/checkout guards.
- **Featured lists**: staff-pick lists referencing book ids; editable in staff UI.
- **Cart**: in-memory cart; reject or block mail-order for in-store-only titles.
- **Orders**: in-memory store on successful checkout; lookup rules per **A5**; fake payment and Portland shipping address.
- **Email**: demo affordance only (confirmation queued / copy on confirmation)—no SMTP.
- **Payment**: fake card validation only.
- **Address validation**: Portland city limits (city/state/ZIP demo rules)—stricter allowlist optional if PR author specifies in Jira.

## Server/API

Minimal Route Handlers or in-memory `lib/store.ts` pattern:

- Checkout validates Portland destination, applies **A1** shipping fee, creates order with **A4** fulfilment note.
- Staff inventory/picks mutations (no auth per **A3** unless answered otherwise).
- Staff order lookup per **A5**.

## Vitest checks (must match task plan)

- Theme tokens differ from scaffold defaults and match Modern SaaS, Premium / moderate density.
- Home implements staff-picks-first signature pattern and renders featured picks from fixtures.
- Genre/author browse and search (title + ISBN) filter correctly; cards use TypographicCover and stock badges.
- Product page shows in-store-only treatment when Hawthorne = 0 and combined > 0; mail-order add blocked accordingly.
- Cart/checkout enforce Hawthorne-only mail-order; Portland address validation rejects out-of-limits fixtures.
- Checkout shipping fee behavior matches **A1**; confirmation shows **A4** copy and email affordance.
- Returns surface reflects **A2**.
- Staff inventory updates drive combined badge and mail-order eligibility on storefront.
- Staff picks update home band.
- Staff order lookup behaves per **A5**; staff routes respect **A3**.
- No clickable `http(s)` links in UI; no secret patterns in POC files.
