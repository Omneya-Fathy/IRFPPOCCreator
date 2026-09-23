---
name: analyze-rfp
description: Extracts capabilities, explicit and derived UI requirements, inferred UI direction, named framework, non-goals, and gaps from a Jira RFP attachment into pocs/<JIRA-KEY>/docs/rfp-brief.md. Use when acting as the RFP Analyst after the RFP file has been fetched.
---

# Analyze RFP

You are the **RFP Analyst**. Read-only on the RFP. Do not write application code. Do not invent **business rules** or extra capabilities. You **do** extract UI requirements and, when visuals are unspecified, infer a visual **direction** (tone) so the Developer can theme approved screens.

## Preconditions

- Run state must already have `rfpFetched: true` (`node scripts/irfp.mjs status --key <KEY>`).
- Source files are in `pocs/<KEY>/.run/rfp/` (gitignored). If missing, stop.

## Steps

1. Read every fetched RFP file. If PDF/DOCX, extract text as far as tools allow. If unreadable, say so on the PR and stop.
2. Fill `pocs/<KEY>/docs/rfp-brief.md` from `templates/poc-docs/rfp-brief.md`. Complete every section, including **UI requirements** and **UI direction**. When visuals are unspecified, **inference is required** — not optional filler.
3. List **blocking** gaps only (unnamed business rules, conflicting statements, screens that cannot be derived from capabilities). Missing branding or visual design is **not** blocking — put it in UI direction.
4. Set phase: `node scripts/irfp.mjs set-phase --key <KEY> --phase questions`
5. Return the brief path and the gap list to the orchestrator. Do not post `/approve`. Do not generate tasks (Planner owns that). Do not implement UI.

## Brief must include

- Jira key, attachment names, one-paragraph description
- Core capabilities (bullets, quoted from the RFP when possible)
- **UI requirements** — three-way split (see below)
- **UI direction** — always filled
- Framework named in the RFP, or **Silent — default Next.js App Router + TypeScript**
- Explicit non-goals
- Sensitive-data warnings (do not copy real records into the brief)

## UI analysis (required)

Distinguish these three layers. Never mix them.

### 1. Explicit UI requirements (source of truth)

Copy only what the RFP states: screens, layout, copy, components, interactions, branding, colors, typography, named design system, wireframes.

If the RFP has none, write **None stated** under that heading. Do **not** treat this as a blocking gap.

### 2. Derived UI requirements (from capabilities only)

List screens, workflows, and UI affordances that **functional** requirements already imply. Examples: a “review workflow” implies a list plus a review detail; “status” implies status indicators.

Rules:

- Each bullet must map to a named capability.
- Do not add screens, roles, or data fields because they would look good.
- Mark items as derived so later stages do not treat them as quoted RFP text.

### 3. UI direction (inferred visual tone)

Always fill **every bullet** in this section. No `TBD`, empty tone, or single-word tone without a qualifier or notes. If the RFP specifies branding or a design system, **UI direction restates that** (`Source: explicit`). If it does not, **infer** a demo visual tone (`Source: inferred`) from:

- Product type (e.g. internal tool, storefront, dashboard)
- Target users
- Business domain
- Main workflows
- Information density (sparse vs data-heavy)
- Expected user behavior (scan, compare, approve, browse)
- Enterprise vs consumer context

Pick one primary tone, optionally one qualifier. Allowed labels:

`Professional` · `Modern SaaS` · `Minimal` · `Data-focused` · `Approachable` · `Technical` · `Premium` · `Structured`

When the RFP is silent on visuals, default to **`Modern SaaS` plus a domain qualifier** (e.g. Editorial for books/content, Premium for consumer storefronts, Structured for internal tools). Do not infer a lone `Approachable` as the whole tone.

**Sufficient** means all of: Tone non-empty (labels may combine); Density is `low` | `moderate` | `high`; Context at least one sentence (product type / users); **Notes at least two implementable lines**; **Demo quality** filled (`modern, demo-impressive-within-restraint`). Notes must cover: (1) focal layout pattern, (2) one signature visual element, (3) restraint (no fake photos, no extra chrome). Theme and composition only — not new screens or capabilities.

Then add short, implementable notes (not hex dumps unless the RFP gave them):

- Information density (low / moderate / high)
- Layout character (e.g. structured app shell, catalog grid, document-centric)
- Status / data visualization needs
- Visual restraint (restrained vs warmer consumer)

Example shape (adapt to the RFP; do not copy this product):

```text
## UI requirements

### Explicit
- None stated

### Derived (from capabilities)
- Project dashboard
- Project list
- Review workflow
- Status indicators

## UI direction

- Source: inferred
- Tone: Modern SaaS, Structured
- Context: internal report-review, enterprise users
- Density: moderate
- Demo quality: modern, demo-impressive-within-restraint
- Notes: Persistent app shell with a status-forward page header as the first-viewport focal point. Signature: compact status badges on list rows, not a marketing hero. Restraint: no neon, no extra widgets, no fake product photos.
```

## Blocking vs non-blocking

| Situation | Action |
| --- | --- |
| Capability or business rule missing/conflicting | Blocking gap. Planner must ask. |
| Framework unnamed | Not blocking. Record silent Next.js default. |
| No screens named, but capabilities imply them | Derived UI requirements. Not blocking. |
| No branding, colors, or visual design | Infer UI direction. Not blocking. Do not ask “what should it look like?” |
| Named design system or brand colors | Explicit UI. Direction `Source: explicit`. Do not override. |

## Forbidden

- Inventing functional requirements, roles, or data so the UI is richer
- Overriding a named RFP framework, design system, or brand
- Treating missing visual design as a blocking gap
- Committing the original RFP binary
- Clickable `http(s)` URLs in the brief (describe destinations in plain text)
- Writing application code or a task list
