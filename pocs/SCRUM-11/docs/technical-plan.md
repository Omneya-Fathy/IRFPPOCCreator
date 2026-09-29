# Technical plan

- Jira key: SCRUM-11
- Stack (RFP named / Next.js default / PR-author override): RFP silent — **Next.js App Router + TypeScript**, demo UI, static fixtures + in-memory state (no real payment gateway or email provider).

## Resolved business rules (Q1–A3)

| ID | Topic | Decision |
| --- | --- | --- |
| **A1** | Portland mail-order **shipping fee** at checkout | **$0** with placeholder copy (“calculated at fulfilment”); no tiered fee model in the POC. |
| **A2** | **Returns/refunds** in the POC | **(a)** Static buyer-facing returns policy text only — no return-initiation UI. |
| **A3** | **Staff route** access | **Unauthenticated** `/staff/*` for local demo; no login gate. |

## Resolved from RFP (no PR answer required)

| Rule | Implementation intent |
| --- | --- |
| Mail-order geography | Checkout accepts delivery addresses **within Portland city limits only** (demo validator rejects outside Portland). |
| Ship-from | Mail order ships from **Hawthorne only**; Cedar is never a ship-from location. |
| Combined public stock | Buyer-facing **in-stock** indicator when `(hawthorneOnHand + cedarOnHand) > 0`. |
| Mail-order purchasability | Add-to-cart and checkout allowed only when `hawthorneOnHand > 0`. |
| In-store only | When combined on-hand > 0 but `hawthorneOnHand === 0`, show **available in store only**; not purchasable for Portland mail-order. |
| Guest checkout | No mandatory buyer accounts. |
| Staff data entry | Staff edit price and on-hand **per location** (Hawthorne and Cedar separately). |
| Fulfilment messaging | Placeholder copy referencing Hawthorne packing on the existing **three-days-per-week** rhythm **without naming weekdays** (same restraint as RFP). |
| Catalogue media | **TypographicCover** tiles only—no stock photography or generated cover art under `public/`. |

### Availability helpers (buyer UI)

- `combinedOnHand(book) = hawthorneOnHand + cedarOnHand`
- `isInStock(book) = combinedOnHand(book) > 0`
- `isMailOrderEligible(book) = hawthorneOnHand > 0`
- `isInStoreOnly(book) = isInStock(book) && !isMailOrderEligible(book)`

Listing and product views show compact badges aligned with UI direction: **mail-order eligible**, **in-store only**, or **not available** (out of stock).

## Screens and routes

From explicit + derived UI requirements in `rfp-brief.md`. No extra screens.

| Route | Purpose |
| --- | --- |
| `/` | Storefront home: **staff-picks band** in first viewport, then searchable catalogue entry (grid/list). |
| `/browse/genre` | Genre navigation / listing entry. |
| `/browse/genre/[slug]` | Catalogue filtered by genre. |
| `/browse/author` | Author navigation / listing entry. |
| `/browse/author/[slug]` | Catalogue filtered by author. |
| `/search` | Search results for title or ISBN (`?q=`). |
| `/books/[id]` | Product page: typographic cover, title, author, ISBN, price, availability badges per Hawthorne/Cedar rules. |
| `/cart` | Cart review; line items must be mail-order eligible. |
| `/checkout` | Guest checkout: Portland delivery address + fake card fields; shipping fee line per **A1**; no required account. |
| `/checkout/confirmation` | Post-checkout confirmation + demo order-confirmation email affordance; fulfilment placeholder copy. |
| `/staff` | Staff operations shell—access per **A3**. |
| `/staff/inventory` | Edit price and on-hand per location (manual only). |
| `/staff/picks` | Curate staff-pick lists on home. |
| `/staff/orders` | Guest order lookup by order number **and** buyer email. |

Returns/refunds UI (if any) follows **A2**—static policy route or omit per answer.

## UI direction

Copy from `rfp-brief.md` (Developer uses this for theme only; do not restyle beyond tokens/layout).

- Source: inferred
- Tone: Modern SaaS, Premium
- Context: Consumer-facing independent bookstore storefront for Portland readers, plus staff-facing admin for inventory and merchandising; warm retail brand without enterprise dashboard austerity.
- Density: moderate
- Demo quality: modern, demo-impressive-within-restraint
- Notes: Storefront uses a catalog-first layout with a staff-picks band as the first-viewport focal point, then searchable grid or list of titles. Signature element: cover-forward product cards with compact availability badges (in stock, in-store only, mail-order eligible) driven by the Hawthorne/Cedar rules. Restraint: placeholder cover art only, no stock lifestyle photography, no loyalty widgets or recommendation carousels beyond staff picks.

First implementation step: map tone + density onto existing scaffold tokens in `app/globals.css` `:root` and the layout shell; do not reinstall Tailwind.

## Local data

- **Catalogue fixtures**: fictional books (title, author, ISBN, genre, price, `hawthorneOnHand`, `cedarOnHand`); staff edits mutate in-memory copy for demo.
- **Availability helpers**: implement rules above for all buyer-facing surfaces.
- **Featured lists**: staff-pick lists referencing book ids; editable in staff UI; home renders picks band first.
- **Cart**: in-memory; reject or disable add for non–mail-order-eligible titles.
- **Orders**: in-memory on successful checkout; Portland address, line items, fake payment status, shipping fee fields per **A1**, fulfilment placeholder; staff lookup requires **both** order id and email match.
- **Email**: demo affordance only on confirmation—no SMTP.
- **Payment**: fake card validation only.
- **Address validation**: Portland city limits (shared validator module + Vitest).

## Server/API

Minimal Route Handlers only where needed:

- Optional `POST /api/checkout` — validate Portland address, mail-order-eligible line items, apply **A1** fee rule, create order.
- Optional `PATCH` staff inventory endpoints (no auth per **A3** unless answer specifies otherwise).
- Prefer `lib/store.ts` in-memory pattern from scaffold.

## Vitest checks (must match task plan)

- Theme tokens reflect Modern SaaS + Premium tone and moderate density (primary, muted, card differ from scaffold defaults).
- Home renders staff-picks band and catalogue entry; primary route uses Notes **signature pattern** (picks band + cover-forward cards with badges).
- `isMailOrderEligible`, `isInStoreOnly`, and out-of-stock cases on fixtures.
- Genre, author, and search filters behave correctly.
- Product and listing cards show correct availability badges.
- Cart blocks or omits in-store-only / out-of-stock adds; totals correct for eligible items.
- Checkout rejects non-Portland addresses; accepts valid Portland fixture; creates order without account.
- Checkout shipping/fee presentation matches **A1** once answered.
- Confirmation shows order id and generic fulfilment placeholder (no weekday names).
- Staff inventory update reflects on storefront badges and mail-order eligibility.
- Staff picks update home band.
- Staff order lookup requires order number **and** email (**both** must match).
- Staff access matches **A3**.
- Returns scope matches **A2** if applicable.
- No clickable `http(s)` links in UI; no secret patterns in POC files.
