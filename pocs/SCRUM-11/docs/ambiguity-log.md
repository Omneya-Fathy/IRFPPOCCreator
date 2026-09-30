# Ambiguity log

- Jira key: SCRUM-11

## Open questions

_(none — Q1–Q3 answered 2026-09-29.)_

## Answered

### Q1 — Portland mail-order shipping fee at checkout

- Asked: 2026-09-29 (Requirements Planner)
- Question: The RFP leaves the **shipping fee model** for Portland mail-order to implementers. For the POC checkout total line, which rule should we demo?
- Answer (PR author): **$0 / “calculated at fulfilment” placeholder** with copy only (A1).
- Status: answered

### Q2 — Returns and refunds in the POC

- Asked: 2026-09-29 (Requirements Planner)
- Question: What should the POC include for returns/refunds?
- Answer (PR author): **(a)** static buyer-facing policy text only — no return initiation UI (A2).
- Status: answered

### Q3 — Staff tools access in the POC

- Asked: 2026-09-29 (Requirements Planner)
- Question: How should staff reach inventory edits, staff-pick curation, and guest order lookup in this demo?
- Answer (PR author): **Unauthenticated** `/staff/*` routes — local POC only, no login gate (A3).
- Status: answered

## Ignored comments

Comments from anyone other than the PR author (do not use for gates).
