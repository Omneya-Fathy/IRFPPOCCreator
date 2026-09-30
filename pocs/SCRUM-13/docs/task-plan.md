# Task plan

Comment this same checklist on the Jira issue as `TASK PLAN`. Wait for a human to comment `/approve` or run `/irfp-approve`.

- Jira key: SCRUM-13
- Status: waiting-for-approve

**Decisions locked:** A1 guest checkout; A2 go-live 15 Nov 2026 (planning); A3 US-only shipping.

## TASK PLAN

1. [ ] Map Direction A (Shelf Talker Counter) onto scaffold tokens (`app/globals.css` `:root`, `lib/theme-tokens.ts`)—cream paper, ink text, brick-red primary; keep `import "./globals.css"`—check: `lib/theme-wiring.test.ts` passes and tokens differ from scaffold defaults.
2. [ ] Scaffold POC app from `templates/poc-next` if missing (`scaffold-poc`)—check: `npm run build` succeeds in `pocs/SCRUM-13/`.
3. [ ] Catalogue fixtures with realistic indie titles, authors, ISBNs, genres, prices, Hawthorne/Cedar on-hand—check: loader returns required fields; no Lorem or repeated placeholder names.
4. [ ] `isMailEligible(book)` (`hawthorneOnHand > 0`) for buyer stock badges—check: Vitest for zero Hawthorne vs positive Hawthorne.
5. [ ] Storefront shell: top bar (logo text, search, cart count), paper-warm surfaces—check: layout renders nav without generic centered hero.
6. [ ] Home `/`: staff-picks **talker rail** + genre-led typographic cover grid—check: rail visible above/before grid; `TypographicCover` on cards.
7. [ ] **Signature moment**: expandable shelf-talker on staff picks (click + keyboard)—check: Vitest or component test that expand reveals curator note; add-to-cart available from expanded card.
8. [ ] Genre browse index + `[slug]` pages—check: filter returns only matching books; stock badge on cards.
9. [ ] Author browse index + `[slug]` pages—check: author filter correct; stock badge on cards.
10. [ ] Search `/search?q=` for title and ISBN—check: Vitest title and ISBN match cases.
11. [ ] Product `/books/[id]`: asymmetric cover anchor, metadata stack, price, mail-eligible badge—check: required RFP fields present; typographic cover only.
12. [ ] Cart `/cart`: add, update qty, remove, line totals—check: totals Vitest.
13. [ ] US address validator module—check: Vitest rejects non-US and invalid ZIP; accepts valid US fixture.
14. [ ] Guest checkout `/checkout` (**A1**): US address (**A3**) + fake card—check: no account fields required; invalid destination rejected.
15. [ ] Confirmation `/checkout/confirmation` + demo email affordance—check: order id shown; placeholder Hawthorne fulfilment copy without weekday names.
16. [ ] In-memory orders on successful checkout—check: order record includes guest email and US address.
17. [ ] Staff shell `/staff` unauthenticated—check: `/staff/inventory` loads without credentials.
18. [ ] Staff inventory `/staff/inventory`: edit price and on-hand (both locations)—check: buyer badge updates when Hawthorne on-hand changes.
19. [ ] Staff picks `/staff/picks`: curate lists and curator notes for talker rail—check: home rail updates after edit.
20. [ ] Visual QA hooks for Reviewer: domain identity (not generic SaaS), first-viewport talker/grid anchor, hierarchy, memorable talker moment, anti-pattern avoidance—check: noted in `review-report.md` if not unit-testable.
21. [ ] Full Vitest suite green—check: `npm test` in `pocs/SCRUM-13/`; eligible for `mark-vitest` after review pass.

## Out of scope

Do not implement anything not listed above or marked non-goals in `rfp-brief.md` (ebooks, gift wrap, loyalty, marketplace, till integration, Cedar as ship-from, required accounts, international shipping, recommendation engine, photographic cover assets, loyalty punch-card UI, deployment/go-live automation for **A2**).
