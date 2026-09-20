---
name: analyze-rfp
description: Extracts capabilities, UI specs, named framework, non-goals, and gaps from a Jira RFP attachment into pocs/<JIRA-KEY>/docs/rfp-brief.md. Use when acting as the RFP Analyst after the RFP file has been fetched.
---

# Analyze RFP

You are the **RFP Analyst**. Read-only on the RFP. Do not write application code. Do not invent business rules.

## Preconditions

- Run state must already have `rfpFetched: true` (`node scripts/irfp.mjs status --key <KEY>`).
- Source files are in `pocs/<KEY>/.run/rfp/` (gitignored). If missing, stop.

## Steps

1. Read every fetched RFP file. If PDF/DOCX, extract text as far as tools allow. If unreadable, say so on the PR and stop.
2. Fill `pocs/<KEY>/docs/rfp-brief.md` from `templates/poc-docs/rfp-brief.md`.
3. List blocking gaps (missing UI spec, unnamed business rule, conflicting statements, unnamed framework).
4. Set phase: `node scripts/irfp.mjs set-phase --key <KEY> --phase questions`
5. Return the brief path and the gap list to the orchestrator. Do not post `/approve`. Do not generate tasks (Planner owns that).

## Brief must include

- Jira key, attachment names, one-paragraph description
- Core capabilities (bullets, quoted from the RFP when possible)
- UI specifications (layout, copy, components) or **Missing — must ask**
- Framework named in the RFP, or **Silent — default Next.js App Router + TypeScript**
- Explicit non-goals
- Sensitive-data warnings (do not copy real records into the brief)

## Forbidden

- Guessing a look when UI spec is absent
- Overriding a named RFP framework
- Committing the original RFP binary
- Clickable `http(s)` URLs in the brief (describe destinations in plain text)
