# Ambiguity log

- Jira key: SCRUM-6

## Open questions

_(none — blocking Q1–Q4 answered 2026-09-22 via operator `/irfp-answer`.)_

## Answered

### Q1 — Shipping destinations

- Asked: 2026-09-22 (Requirements Planner)
- Question: Which delivery destinations should the POC accept at checkout (e.g. Portland metro only, full US domestic, or international)? This drives address validation rules and checkout helper copy.
- Answer (PR author): Accept **US domestic** shipping destinations at checkout (operator: "us").
- Status: answered

### Q2 — In-stock presentation (Hawthorne + Cedar)

- Asked: 2026-09-22 (Requirements Planner)
- Question: On product and listing views, how should buyers see availability across the two shops—one combined in-stock/out-of-stock flag, a per-location breakdown (Hawthorne / Cedar), or numeric on-hand counts per location?
- Answer (PR author): Show **one combined** in-stock / out-of-stock flag across Hawthorne and Cedar (operator: "one flag"). Derive: in stock when combined on-hand at either location is greater than zero; out of stock when both are zero. Do not show per-shop breakdown or numeric counts on buyer-facing views.
- Status: answered

### Q3 — Staff access model

- Asked: 2026-09-22 (Requirements Planner)
- Question: How should staff reach price/quantity edits, featured-list curation, and paid-order lookup in the POC—shared demo password, no gate (local demo only), separate staff login with roles, or another rule you specify?
- Answer (PR author): **No login or gate** for staff tools in the POC—local demo only; staff routes are **unauthenticated** (operator: "no login").
- Status: answered

### Q4 — Fulfilment schedule and buyer messaging

- Asked: 2026-09-22 (Requirements Planner)
- Question: The RFP states mail orders ship from Hawthorne basement three days per week but not which days. For the POC, should we use placeholder schedule copy only, or specific weekdays you name? Any buyer-facing delivery expectation text to show on confirmation (e.g. “ships within X business days”)?
- Answer (PR author): Use **placeholder fulfilment schedule copy** only; do not name specific weekdays unless already in the brief (operator: "placeholder"). Brief already states three days per week from Hawthorne basement; POC may reference that generically without naming Mon/Wed/Fri etc.
- Status: answered

## Ignored comments

Comments from anyone other than the PR author (do not use for gates).
