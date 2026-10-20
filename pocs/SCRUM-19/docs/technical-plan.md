# Technical plan

- Jira key: SCRUM-19
- Stack (RFP named / Next.js default / PR-author override): RFP silent — **Next.js App Router + TypeScript**, demo UI, static fixtures + in-memory state (no live acquirer, SMTP, CMS authoring, or reservation integration).

## Resolved business rules (A1–A11, Jira comment 10405)

Operator answers are authoritative. Implementation must match these strings and behaviours; do not invent production finance, VAT, shop-attribution, or compliance claims beyond what is stated below.

### A1 — Displayed price rule

- Browse, listing, and detail: **cached guide “from” prices** (fixture-backed; notional daily refresh only—no live supplier API).
- Labels: **“Guide price”** / **“From”** on browse rows and detail.
- Basket and checkout: same guide price as **“Price today”**; checkout total label **“Total to pay today”**.
- Copy (basket/checkout): “Final price is confirmed when you pay. If the supplier price changes before payment, we’ll show the updated total before you confirm.”
- Demo: one mock **“price changed”** path on checkout to show updated total messaging.

### A2 — Guest vs registered accounts

- Default: **guest checkout** — email required, name optional.
- Optional: **“Save details for next time”** (email + password, fake auth only).
- No account-required journeys in the POC. Staff/back-office login out of scope.

### A3 — Online payment schedule

- Hosted-card flow: **30% deposit** at checkout; balance due before travel (date from fixture).
- Labels: **“Pay deposit today (30%)”**, **“Balance due by [fixture date]”**, separate line items for deposit vs balance.
- Full-pay-only not required for the demo.

### A4 — Flight-only on the web

- Customer catalog: **packaged leisure only** (flight + hotel or flight + package).
- **Omit flight-only SKUs** from catalog (default POC scope). No online bookable flight-only.

### A5 — Shop attribution

- Rule: **selected shop wins** (retail consultant ownership tied to shop in fixtures).
- Fixture shop names only: **“Harbour Travel — Manchester”**, **“Harbour Travel — Leeds”**, **“Harbour Travel — Bristol”** (fictional).
- No round-robin call centre or geo-nearest in POC.

### A6 — Supplier feed failure

- Show **“Temporarily unavailable”** with telephone CTA (non-clickable copy, e.g. **0800 000 0000**).
- Block add-to-basket; if line already in basket, **block checkout** with message to remove or call.
- Do not hide affected products silently.

### A7 — Currency and VAT

- All customer-facing totals: **VAT-inclusive GBP**.
- Checkout: one line **“Includes VAT where applicable.”**
- EUR: secondary only — **“Approx. €XXX (indicative; you pay in GBP)”** via fixed fixture FX rate (no live FX).

### A8 — Held-quote capture

- Required fields: email, phone, departure date, return date, adults, children, preferred airport (dropdown from fixtures), package or destination (from context).
- Optional: notes.
- Confirmation (no SLA): **“We’ve saved your request. A consultant will contact you using the details you provided.”**

### A9 — Shop picker in POC

- **Functional required shop dropdown** at checkout, options = three A5 shops. Not disabled; not omitted.

### A10 — Travel guide / blog depth

- **`/guides`**: listing with **two guide cards** (fixtures).
- **`/guides/[slug]`**: **one** full sample article (static markdown/fixture).
- No CMS; defer comments, tags, and search. Nav includes Guides.

### A11 — Contact and trust copy

- Trust strip (checkout + footer): **“ATOL / trust wording — pending legal approval”** (muted).
- Contact: fictitious **“Customer services: Mon–Fri 9–5”** and placeholder phone.
- Do not invent real ATOL numbers or regulatory claims.

## Screens and routes

From explicit + derived UI requirements in `rfp-brief.md`. No extra screens.

| Route | Purpose |
| --- | --- |
| `/` | Home: double-height **featured board row**, campaign tag filters (Featured / Honeymoon / Wedding), trust runway per **A11**. |
| `/browse` | Package catalog: sticky **filter strip** (dates, budget, board basis, destination themes, **departure airport dropdown**), **departure-board rows** with ticket-stub **“From”** / guide pricing (**A1**, **A7**). |
| `/packages/[slug]` | Product detail: typographic cover band, attribute chips, **Guide price** block (**A1**, **A7**), add to basket + **request hold quote** CTAs; **A6** unavailable state when applicable. |
| `/campaign/[theme]` | Campaign landing (`honeymoon`, `wedding`, `featured`): filtered board rows + offset typographic cover layout on desktop. |
| `/cart` | Basket: **Price today** lines and messaging per **A1**; **A6** blocks checkout when needed. |
| `/checkout` | Linear checkout: guest identity (**A2**), **required shop dropdown** (**A5**, **A9**), summary with **30% deposit** labels (**A3**), **Total to pay today** + VAT line (**A1**, **A7**), trust strip (**A11**), **hosted payment field placeholders**, mock price-change path. |
| `/checkout/hold` | Held-quote form per **A8**; confirmation string per **A8**. |
| `/checkout/confirmation` | Post-payment confirmation + demo email affordance (fake data only). |
| `/contact` | **A11** hours and placeholder phone. |
| `/guides` | Two-card listing per **A10**. |
| `/guides/[slug]` | One sample article body per **A10**. |

Site shell nav: Browse, Honeymoon, Wedding, Contact, **Guides**.

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
- Content density and fixture notes: 6–10 varied package rows; 2–3 basket lines; subset with honeymoon/wedding tags; MAN/BHX/LHR airports; board basis variety; no Lorem ipsum or “Test User”; at least one fixture with **A6** unavailable state.
- Responsive adaptation of the concept: Mobile filter strip → **Filters sheet**; stub tab moves **below** destination on small screens; trust strip stays above fold on home; signature stub on every row variant.
- Anti-patterns to avoid: Centered hero + three equal promo cards; map airport picker; purple/blue AI gradient or glassmorphism; marketplace seller clutter; fake photographic destinations; identical card grid; Lorem / Test User.
- Memorable-moment answer: User recalls **package rows with tear-off “from” price stubs** and airport pills—not merely “blue site.”
- Any-app test (why this is not generic SaaS): **Departure-board row schema** (airport + nights + board + stub pricing) and **held-quote vs pay** dual path are travel-agency-specific; not entity admin tables.

## Local data

- **Package fixtures**: 6–10 fictional leisure packages; **no flight-only** bookable SKUs (**A4**); fields for guide/from price (**A1**), VAT-inclusive GBP + optional EUR reference rate (**A7**), `availability: unavailable` for **A6** demo row; campaign tags; MAN/BHX/LHR.
- **Filters**: client-side on `/browse` (airport dropdown—not map).
- **Cart**: in-memory; **Price today** and **A1** messaging.
- **Orders**: in-memory on checkout; guest email (**A2**), `shopId` from three Harbour Travel shops (**A5**/**A9**), deposit 30% + balance date snapshot (**A3**), fake payment; mock price-change branch.
- **Held quotes**: in-memory per **A8** field set; separate from paid orders.
- **Guides**: two listing cards + one article slug (**A10**).
- **Shops**: exactly three fixture entries (**A5** names).
- **Trust/contact**: **A11** placeholder strings.

## Server/API

Minimal Route Handlers only if needed for Vitest or checkout validation:

- `POST /api/checkout` — validate guest identity (**A2**), shop required (**A9**), guide/deposit totals (**A1**/**A3**/**A7**), block **A6** lines, create fake order.
- `POST /api/hold-quote` — validate **A8** required fields, append held quote.
- Optional `GET /api/packages` — fixture search/filter for tests.

Prefer `lib/store.ts` + fixtures import pattern from scaffold.

## Vitest checks (must match task plan)

- `lib/theme-wiring.test.ts`: tokens differ from scaffold defaults; slate/teal departure-board palette.
- Browse row: **ticket-stub**, **“From”** / guide price labels (**A1**); airport pill; reduced-motion branch.
- Airport dropdown filter (no map).
- Price helpers: VAT-inclusive GBP, EUR secondary string, checkout **“Includes VAT where applicable.”** (**A7**).
- Catalogue excludes flight-only SKUs (**A4**).
- **A6**: unavailable row CTA + basket/checkout block.
- Checkout: **30% deposit** lines (**A3**), **Total to pay today**, mock price-change copy (**A1**).
- Shop dropdown required with three Harbour Travel options (**A5**/**A9**).
- Held-quote validation and confirmation copy (**A8**); distinct from paid flow.
- Guides: two cards + one article route (**A10**).
- Contact + trust placeholders (**A11**).
- No clickable `http(s)` in UI; `layout.tsx` keeps `import "./globals.css"`; globals retain `@tailwind` layers.
