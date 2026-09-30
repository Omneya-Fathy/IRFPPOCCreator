# Ambiguity log

- Jira key: SCRUM-13

## Open questions

_(none — operator Q1 answered 2026-09-30.)_

## Answered

### Q1 — Checkout identity, go-live, and shipping (operator)

- Asked: 2026-09-30 (operator on Jira; not `**[IRFP POC Creator]**` prefix)
- Questions:
  1. Should buyers be required to create an account before paying, or is guest checkout allowed?
  2. What is the target go-live date for the storefront?
  3. Which shipping destinations should checkout accept (e.g. US only, international)?
- **A1** (checkout identity): **Guest checkout allowed** — buyers may complete checkout without creating an account.
- **A2** (go-live): Target go-live date **15 November 2026** (planning reference; POC remains a local demo without deployment calendar).
- **A3** (shipping): **US only** — checkout accepts US domestic delivery destinations; reject non-US addresses in demo validation.
- Status: answered

## POC defaults (not blocking — derived from RFP + IRFP convention)

| Topic | POC default |
| --- | --- |
| Buyer in-stock badge | **Mail-eligible stock**: in stock when `hawthorneOnHand > 0` (Hawthorne fulfils mail orders; Cedar walk-in only for this build). Single in-stock / not-in-stock badge on buyer UI; no per-location breakdown or numeric counts. |
| Staff access | No authentication on `/staff/*` — local demo only (RFP did not specify staff login). |
| Fulfilment copy | Placeholder messaging: mail orders pack from Hawthorne on a **three-days-per-week** schedule per RFP; do **not** name specific weekdays on confirmation. |
| Cover imagery | **Typographic only** — `TypographicCover` tiles; no file upload or `public/` jacket assets (per `ui-design-brief.md`). |

## Ignored comments

Comments from the automation account or bodies prefixed `**[IRFP POC Creator]**` (do not use for gates).
