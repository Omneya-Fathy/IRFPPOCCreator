# Ambiguity log

- Jira key: SCRUM-8

## Open questions

_(none — blocking Q1–Q2 answered 2026-09-30 on Jira.)_

## Answered

### Q1 — Sign-in / account mechanism (POC)

- Asked: 2026-09-30 (Requirements Planner)
- Question: The RFP requires accounts for publish and follow but does not name an authentication method. For the POC, should we use a dummy sign-in stub, a specific flow, or relax the gate?
- Answer (Jira **A1**): **Dummy sign-in only; not required.** The POC uses a **default demo actor** for feed, publish, and follow with **no mandatory login gate**. Optional `/sign-in` may **switch persona** for attribution (who published / who is following).
- Status: answered

### Q2 — Recipe photo source (POC)

- Asked: 2026-09-30 (Requirements Planner)
- Question: RFP requires a recipe photo field. Should the POC use typographic covers only, file upload with in-memory storage, or another honest demo rule?
- Answer (Jira **A2**): **File upload** on add/edit recipe; store in-memory as **data URL** (`photoDataUrl`). Display uploaded image when set; otherwise **typographic fallback** (title + subtitle/metadata per Harvest Table / `TypographicCover`).
- Status: answered

## Ignored comments

Comments from the automation account or bodies prefixed `**[IRFP POC Creator]**` (do not use for gates).
