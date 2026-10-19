# Task plan

Comment this same checklist on the Jira issue as `TASK PLAN`. Wait for a human to comment `/approve` or run `/irfp-approve` after **Q1–Q11** are answered (or explicitly waived in Jira).

- Jira key: SCRUM-19
- Status: waiting-for-approve

**Decisions pending:** Q1–Q11 (see `docs/ambiguity-log.md`). Gap-dependent tasks reference **A1–A11**; do not ship invented finance, VAT, shop, or legal copy.

## TASK PLAN

1. [ ] Map **Departure Board Catalog** (Direction B) onto scaffold tokens (`app/globals.css` `:root`, `lib/theme-tokens.ts`)—slate bands, horizon teal accent, tabular figure-friendly price tokens—check: `lib/theme-wiring.test.ts` passes; tokens differ from scaffold; no Tailwind reinstall; root layout keeps `import "./globals.css"`.
2. [ ] Scaffold POC app from `templates/poc-next` if missing (`scaffold-poc`)—check: `npm run build` succeeds under `pocs/SCRUM-19/`.
3. [ ] Add fictional **package catalogue fixtures** (destinations, nights, board basis, MAN/BHX/LHR airports, campaign tags, price fields for **A1**/**A7**, flight-only flag per **A4**, availability per **A6**)—check: fixture loader returns 6–10 varied rows; no Lorem ipsum or “Test User”.
4. [ ] Implement `TypographicCover` and **board row** surface with **ticket-stub price tab** (signature moment) and airport/board badges—check: Vitest asserts stub + monogram present; not a generic Card grid.
5. [ ] Site shell: top nav (Horizon Voyages, Browse, Honeymoon, Wedding, Contact; Guides link if **A10** includes routes)—check: nav renders on home.
6. [ ] Home `/`: double-height featured row, campaign tag filters, thin trust **runway bar** placeholder per **A11**—check: first viewport shows filter/row anchor; trust strip not invented ATOL legal text unless **A11** supplies it.
7. [ ] Browse `/`: sticky filter strip (departure airport **dropdown**, dates, budget, board, themes); board rows with 200ms highlight sweep on filter change (`prefers-reduced-motion`: instant)—check: airport filter is dropdown not map; Vitest filter reduces rows.
8. [ ] Implement price labelling and formatting per **A1** (from vs live) and **A7** (GBP/EUR, VAT)—check: Vitest cases use operator answers; browse stub and detail block match policy.
9. [ ] Product detail `/packages/[slug]`: typographic cover band, chips, price block, add to basket + request hold—check: dual CTAs visible; **A4** flight-only packages excluded or included per answer.
10. [ ] Campaign routes `/campaign/[theme]` (honeymoon, wedding, featured)—check: each theme filters fixtures; row tags visible.
11. [ ] Supplier failure presentation per **A6**—check: at least one demo fixture state; browse/detail/basket behaviour matches answer.
12. [ ] Cart `/cart`—check: line totals respect **A1**/**A7**; blocked lines if **A6** requires.
13. [ ] Checkout `/checkout`: identity step per **A2**; shop control per **A9** and attribution rules **A5**; summary per **A3**; embossed **hosted payment field placeholders**—check: no real PAN; shop picker matches **A9** (functional, disabled placeholder, or omitted).
14. [ ] Held-quote `/checkout/hold` (or equivalent distinct route): form fields and confirmation per **A8**—check: Vitest validates required fields; path separate from card payment completion.
15. [ ] Confirmation `/checkout/confirmation` plus demo order-confirmation email affordance (fake email only)—check: shows order id; no real PII.
16. [ ] Contact `/contact`—check: hours and bank-holiday treatment per **A11** only.
17. [ ] Travel guides `/guides` and `/guides/[slug]` per **A10**—check: scope matches answer (sample list, one article, or routes omitted from nav).
18. [ ] In-memory order and held-quote stores—check: paid order and hold record retrievable in tests; distinct types.
19. [ ] Vitest suite for checks above; `npm test` green—check: memorable-moment row/stub tests; anti-pattern grep (no `http(s)` URLs in UI); ready for `mark-vitest` after review.

## Out of scope

CMS authoring, live acquirer, SMTP, reservation desktop integration, map airport picker, marketplace sellers, algorithmic recommendations, native apps, invented ATOL/legal copy, stock photography, scraping images, full fifty-article migration, penetration test, production cookie banner policy, and anything marked non-goals in `rfp-brief.md`.
