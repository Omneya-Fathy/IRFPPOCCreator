# Technical plan

- Jira key: SCRUM-19
- Stack (RFP named / Next.js default / PR-author override): RFP silent — **Next.js App Router + TypeScript**, demo UI, static fixtures + in-memory state (no live acquirer, SMTP, CMS authoring, or reservation integration).

## Unresolved business rules (Q1–Q11)

Implementation must follow operator answers **A1–A11** on Jira once posted. Do **not** invent production finance, VAT, shop-attribution, or compliance copy. Until answered, gap-dependent UI uses neutral placeholders only (e.g. “Price basis per buyer policy” is **not** allowed—invented rules; use disabled controls or explicit “pending A1” demo stubs only where the task plan names them).

| ID | Topic | Blocks |
| --- | --- | --- |
| **Q1** / **A1** | Displayed price rule | Browse row stub prices, detail price block, basket line prices, checkout total messaging |
| **Q2** / **A2** | Guest vs account | Checkout identity step, held-quote identity |
| **Q3** / **A3** | Payment schedule | Checkout summary, hosted-field amount label |
| **Q4** / **A4** | Flight-only on web | Fixture catalogue composition |
| **Q5** / **A5** | Shop attribution | Checkout shop control behaviour and post-order routing demo |
| **Q6** / **A6** | Supplier failure UX | Fixture flag for unavailable SKU; browse/detail/basket treatment |
| **Q7** / **A7** | Currency and VAT | Price formatting helpers, EUR labelling |
| **Q8** / **A8** | Held-quote fields | Held-quote form and confirmation |
| **Q9** / **A9** | Shop picker POC treatment | Checkout UI for shop selection |
| **Q10** / **A10** | Travel guide depth | `/guides` routes and nav |
| **Q11** / **A11** | Contact and trust copy | Contact page and trust runway bar |

## Screens and routes

From explicit + derived UI requirements in `rfp-brief.md`. No extra screens.

| Route | Purpose |
| --- | --- |
| `/` | Home: double-height **featured board row**, campaign tag filters (Featured / Honeymoon / Wedding), trust runway placeholder (**A11**). |
| `/browse` | Package catalog: sticky **filter strip** (dates, budget, board basis, destination themes, **departure airport dropdown**), **departure-board rows** with ticket-stub pricing (**A1**, **A7**). |
| `/packages/[slug]` | Product detail: typographic cover band, attribute chips, price block (**A1**, **A7**), add to basket + **request hold quote** CTAs. |
| `/campaign/[theme]` | Campaign landing (`honeymoon`, `wedding`, `featured`): filtered board rows + offset typographic cover layout on desktop. |
| `/cart` | Basket line items and summary (**A1**, **A7**). |
| `/checkout` | Linear checkout: identity (**A2**), optional shop control (**A5**, **A9**), order summary (**A3**), **hosted payment field placeholders** (embossed sleeve), pay action. |
| `/checkout/hold` | Held-quote path separate from card payment: form per **A8**, confirmation state. |
| `/checkout/confirmation` | Post-payment confirmation + demo email affordance (fake data only). |
| `/contact` | UK hours and bank-holiday treatment per **A11**. |
| `/guides` | Travel guide listing per **A10**. |
| `/guides/[slug]` | Single guide article per **A10** (if scope includes article body). |

Site shell nav: Browse, Honeymoon, Wedding, Contact (+ Guides if **A10** includes routes).

## UI direction

Copy from `rfp-brief.md` (Developer uses this for theme only; do not restyle beyond tokens/layout).

- Source: inferred
- Tone: Modern SaaS, Premium (consumer leisure storefront)
- Context: Public leisure travellers and advertising-driven first-time bookers compare agency-built packages and indicative prices on mobile or desktop; the UI must feel trustworthy and scannable like a high-street agency, not a generic admin tool.
- Density: moderate
- Demo quality: modern, demo-impressive-within-restraint
- Notes: Focal layout is a **departure-board-inspired browse rail**—filter controls above a scan-friendly list where each package row leads with airport, nights, board basis, and “from” price. Signature element: **per-row “ticket stub” price strip** with typographic destination covers (no faux photography). Restraint: no stock hero photos, no map airport picker, no glassmorphism or marketplace grid of identical cards; typographic covers and honest “from” pricing labels only.
- Design brief: `docs/ui-design-brief.md`

First implementation step: map UI direction + **Direction B — Departure Board Catalog** onto existing scaffold tokens in `app/globals.css` `:root` and `lib/theme-tokens.ts`; keep root `import "./globals.css"`; do not reinstall Tailwind.

## UI design contract

Selected concept from `docs/ui-design-brief.md` — **B — Departure Board Catalog**.

- Selected direction (name): **B — Departure Board Catalog**
- Design metaphor: A **holiday departure board** in a Manchester-area travel shop: each line is a leavable package (airport, nights, board, from-price), not a flight number—but the **scan rhythm** is the same.
- Emotional target: Calm confidence: “I can see what’s leaving from my airport, what it costs from, and whether I should pay now or hold for a consultant.”
- Visual personality (3–5 traits): Row-first catalog (not card mosaic); tabular price and nights alignment; ticket-stub trailing price chips; trust strip as thin **runway bar** above footer; campaign accents as **row tags**, not full-bleed heroes.
- First-viewport visual anchor: Sticky filter strip + at least one **board row** with **ticket-stub “from” price tab** and airport code pill visible without scroll on mobile home/browse.
- Hierarchy (PRIMARY → SECONDARY → SUPPORTING → UTILITY): **PRIMARY:** destination + from-price on rows; total/from on detail/checkout. **SECONDARY:** departure airport, nights, board badges. **SUPPORTING:** campaign tags, trust strip, short descriptions. **UTILITY:** nav, cookie/analytics placeholders, legal footer hooks.
- Signature moment: **Ticket-stub price tab** on each browse row—notched trailing element with **“from £XXX”** and nights; filter change triggers **200ms row highlight sweep** (instant reorder only when `prefers-reduced-motion`).
- Visual rhythm / controlled asymmetry: Browse alternates compact rows with one **double-height featured row**; detail uses wide cover band → chip row → prose → action bar; checkout sparse payment sleeve → dense summary; campaign landing offset typographic cover left, filter strip right on desktop.
- Media strategy (RFP files / upload / typographic or domain-native): **Typographic only** — `TypographicCover` tiles (destination initials, region hue, nights chip); no file upload; no `public/` stock photos; no faux beaches.
- Content density and fixture notes: 6–10 varied package rows; 2–3 basket lines; subset with honeymoon/wedding tags; MAN/BHX/LHR airports; board basis variety; no Lorem ipsum or “Test User”; one fixture may demonstrate **A6** unavailable state when answered.
- Responsive adaptation of the concept: Mobile filter strip → **Filters sheet**; stub tab moves **below** destination on small screens; trust strip stays above fold on home; signature stub on every row variant.
- Anti-patterns to avoid: Centered hero + three equal promo cards; map airport picker; purple/blue AI gradient or glassmorphism; marketplace seller clutter; fake photographic destinations; identical card grid; Lorem / Test User.
- Memorable-moment answer: User recalls **package rows with tear-off “from” price stubs** and airport pills—not merely “blue site.”
- Any-app test (why this is not generic SaaS): **Departure-board row schema** (airport + nights + board + stub pricing) and **held-quote vs pay** dual path are travel-agency-specific; not entity admin tables.

## Local data

- **Package fixtures**: fictional leisure packages with slug, destination label, nights, board basis (AI/BB/HB), departure airport code (MAN/BHX/LHR where offered), campaign tags, indicative price fields (interpretation **A1**, format **A7**), `flightOnly` flag excluded or included per **A4**, `availability` per **A6**.
- **Filters**: client-side filter state on `/browse` (dropdown airport per RFP—not map); budget/dates/themes as demo controls backed by fixture metadata.
- **Cart**: in-memory cart (line items reference package id, qty 1 typical for packages).
- **Orders**: in-memory on successful checkout; includes identity per **A2**, shop id per **A5**/**A9**, payment schedule snapshot per **A3**, fake payment status; no real PAN.
- **Held quotes**: in-memory list on hold submit per **A8**; distinct from paid orders.
- **Guides**: 0–5 fictional articles per **A10**.
- **Shops**: fictional shop list for picker per **A5**/**A9** when enabled.
- **Trust/contact**: static strings from **A11** or approved placeholders.

## Server/API

Minimal Route Handlers only if needed for Vitest or checkout validation:

- `POST /api/checkout` — validate identity per **A2**, apply price rules per **A1**/**A3**/**A7**, create fake order.
- `POST /api/hold-quote` — validate **A8** fields, append held quote.
- Optional `GET /api/packages` — fixture search/filter for tests.

Prefer `lib/store.ts` + fixtures import pattern from scaffold.

## Vitest checks (must match task plan)

- `lib/theme-wiring.test.ts`: tokens differ from scaffold defaults; slate/teal departure-board palette.
- Browse row component renders **ticket-stub** and airport pill; respects `prefers-reduced-motion` branch.
- Filter by departure airport dropdown updates visible rows (no map picker).
- Price display helpers follow **A1** and **A7** once answered (tests stub answers or fixture metadata).
- **A4**: catalogue contains or excludes flight-only SKUs per answer.
- **A6**: unavailable package treatment on browse/detail/basket per answer.
- Cart add/remove and checkout flow with hosted-field placeholders (no real card data).
- Held-quote path distinct from paid checkout per **A8**.
- Shop control behaviour per **A9**/**A5**.
- Contact and trust blocks per **A11**.
- Guides routes per **A10**.
- No clickable `http(s)` in UI; `layout.tsx` keeps `import "./globals.css"`; globals retain `@tailwind` layers.
