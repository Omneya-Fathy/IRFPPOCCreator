# Task plan

Comment this same checklist on the Jira issue as `TASK PLAN`. Wait for a human to comment `/approve` or run `/irfp-approve`.

- Jira key: SCRUM-19
- Status: ready-for-approve

## TASK PLAN

1. [ ] Map **Departure Board Catalog** (Direction B) onto scaffold tokens (`app/globals.css` `:root`, `lib/theme-tokens.ts`)—slate bands, horizon teal accent, tabular figure-friendly price tokens—check: `lib/theme-wiring.test.ts` passes; tokens differ from scaffold; no Tailwind reinstall; root layout keeps `import "./globals.css"`.
2. [ ] Scaffold POC app from `templates/poc-next` if missing (`scaffold-poc`)—check: `npm run build` succeeds under `pocs/SCRUM-19/`.
3. [ ] Add fictional **package catalogue fixtures** (6–10 rows: destinations, nights, board basis, MAN/BHX/LHR, campaign tags; **packaged leisure only—no flight-only SKUs**; guide/from price fields; one **Temporarily unavailable** row for supplier failure)—check: fixture loader returns varied rows; no Lorem ipsum or “Test User”.
4. [ ] Implement `TypographicCover` and **board row** surface with **ticket-stub price tab** labelled **“From”** / **Guide price**—check: Vitest asserts stub + monogram; not a generic Card grid.
5. [ ] Site shell: top nav (Horizon Voyages, Browse, Honeymoon, Wedding, Contact, **Guides**)—check: nav renders on home including Guides link.
6. [ ] Home `/`: double-height featured row, campaign tag filters, thin trust **runway bar** with copy **“ATOL / trust wording — pending legal approval”**—check: first viewport shows filter/row anchor and muted trust strip.
7. [ ] Browse `/`: sticky filter strip (departure airport **dropdown**, dates, budget, board, themes); board rows with 200ms highlight sweep on filter change (`prefers-reduced-motion`: instant)—check: airport filter is dropdown not map; Vitest filter reduces rows.
8. [ ] Price labelling per **A1** and **A7**: browse/detail **“From”** / **Guide price**; basket **“Price today”** + confirmation copy; checkout **“Total to pay today”**, VAT-inclusive GBP totals, **“Includes VAT where applicable.”**, optional **“Approx. €XXX (indicative; you pay in GBP)”** from fixture rate—check: Vitest asserts label strings and one mock checkout **price changed** path updates messaging.
9. [ ] Product detail `/packages/[slug]`: typographic cover band, chips, guide price block, add to basket + request hold; **A6** unavailable shows **Temporarily unavailable** and **0800 000 0000** CTA, blocks add-to-basket—check: dual CTAs on available packages; no flight-only bookable packages in catalog.
10. [ ] Campaign routes `/campaign/[theme]` (honeymoon, wedding, featured)—check: each theme filters fixtures; row tags visible.
11. [ ] **A6** basket behaviour—check: unavailable line in cart blocks checkout with remove-or-call message; Vitest covers block path.
12. [ ] Cart `/cart`—check: line **Price today** and **A1** footer copy present; totals VAT-inclusive GBP.
13. [ ] Checkout `/checkout`: guest identity (email required, name optional; optional **Save details for next time** fake auth); **required** shop dropdown with **Harbour Travel — Manchester**, **Harbour Travel — Leeds**, **Harbour Travel — Bristol**; summary **Pay deposit today (30%)**, **Balance due by [fixture date]**, deposit vs balance lines; embossed hosted-field placeholders; trust strip **A11**—check: Vitest shop required; deposit math 30%; no real PAN.
14. [ ] Held-quote `/checkout/hold`: required fields email, phone, departure/return dates, adults, children, preferred airport dropdown, package/destination from context; optional notes; confirmation **“We’ve saved your request. A consultant will contact you using the details you provided.”**—check: Vitest required-field validation; path separate from card payment.
15. [ ] Confirmation `/checkout/confirmation` plus demo order-confirmation email affordance (fake email only)—check: shows order id; no real PII.
16. [ ] Contact `/contact`—check: **Customer services: Mon–Fri 9–5** and placeholder phone; footer trust placeholder per **A11**.
17. [ ] Travel guides: `/guides` with **two** guide cards; `/guides/[slug]` with **one** full sample article (fixture markdown)—check: no CMS; comments/tags/search omitted.
18. [ ] In-memory order and held-quote stores—check: paid order records shop id and 30% deposit snapshot; hold record separate type in tests.
19. [ ] Vitest suite for checks above; `npm test` green—check: memorable-moment row/stub tests; anti-pattern grep (no `http(s)` URLs in UI); ready for `mark-vitest` after review.

## Out of scope

CMS authoring, live acquirer, SMTP, reservation desktop integration, map airport picker, marketplace sellers, algorithmic recommendations, native apps, real ATOL/regulatory numbers, stock photography, scraping images, full fifty-article migration, flight-only online booking, round-robin/geo shop routing, live supplier/FX APIs, penetration test, production cookie banner policy, and anything marked non-goals in `rfp-brief.md`.
