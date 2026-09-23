---
name: irfp-orchestrator
description: Routes IRFP POC Creator runs from a GitHub PR plus Jira RFP through analyze, Q&A, /approve, generate, review, Vitest, and push. Use when a PR opens, a PR comment arrives, a Cursor slash command `/irfp-orchestrator` `/irfp-answer` `/irfp-feedback` `/irfp-approve` `/irfp-status` is used, a Jira key is present, or the user says start/continue the RFP POC pipeline.
---

# IRFP orchestrator

Read `Readme.md` and `AGENTS.md` first. You are the only entry point. Do not skip gates.

## Modes

### Start (PR opened)

1. `gh pr view --json title,body,author,isDraft,url,number`
2. If `isDraft` is true, stop with no comment.
3. `node scripts/irfp.mjs parse-key --title "<title>" --body "<body>"`
4. If no key: comment that the key must appear in the title or body (`PROJ-123`). Stop.
5. `node scripts/irfp.mjs init-run --key <KEY>`
6. Load the Jira issue with the connected Jira MCP. List attachments.
7. Zero attachments: comment and stop.
8. Multiple attachments: comment the file list; ask the **PR author** which to use. Stop until Continue receives their choice, then `node scripts/irfp.mjs mark-selected-attachment --key <KEY> --files <name>`. Do not analyze until then.
9. Download the chosen RFP into `pocs/<KEY>/.run/rfp/` (gitignored). Do not commit the binary.
10. `node scripts/irfp.mjs mark-rfp-fetched --key <KEY> --files <names>`
11. Launch the **rfp-analyst** subagent (`subagent_type: rfp-analyst`). Prompt must include `You are the RFP Analyst.` so the RFP hook matches. Do not write app code. Analyst owns capabilities, UI requirements, and UI direction in `docs/rfp-brief.md`.
12. Launch the **requirements-planner** subagent for questions + draft plan docs. Planner copies UI direction into `technical-plan.md`; it does not restyle. If UI direction is insufficient, Planner expands it in the brief before `TASK PLAN`. Analyst and Planner own the minimum UI direction fields (Tone, Density, Context, Notes ≥ two lines, Demo quality).
13. Comment `Q1`… on the PR. Commit only `pocs/<KEY>/docs/` if you must persist files. Docs-only commits are allowed before Vitest. No app source.

### Continue (PR comment)

Identity gate (do this first, every time):

1. `gh pr view --json author,comments` (or the comment payload from the automation).
2. If the commenter login is **not** the PR author login: ignore (no files, no replies, no `/approve`).
3. If the comment is from this agent: ignore.

Then:

1. Attachment choice (filename the author named): `mark-selected-attachment`, download if needed, then `rfp-analyst` if analysis has not run.
2. `A1` / threaded answers: launch **requirements-planner** to update `docs/ambiguity-log.md` and plan files; comment remaining gaps. Docs-only git commits are allowed.
3. `/revise` from the PR author: launch **requirements-planner**; do not generate.
4. `/approve` from the PR author only: `node scripts/irfp.mjs mark-approved --key <KEY>` then generate → review → Vitest → push.
5. Any other text: if it answers a question, treat as an answer. Otherwise comment that you need `/approve` or `/revise`.

## Generate after `/approve`

1. **developer** subagent — first `node scripts/irfp.mjs scaffold-poc --key <KEY>` (Next.js + Vitest + Tailwind + `components/ui`; skips existing docs). Retokenize scaffold primitives from brief UI direction; do not invent a greenfield design system. Then implement UI/server under `pocs/<KEY>/` from the approved plan plus brief UI requirements/direction. Analyst and Planner own **minimum UI direction** before this step. Developer must not re-analyze the RFP files.
2. **reviewer** subagent — fail closed on any hard-rule miss. May commit `docs/review-report.md` only (docs-only commit allowed without Vitest).
3. **tester** subagent — Vitest in the POC directory. Stamp `mark-vitest` **before** committing app files or pushing.
4. `node scripts/irfp.mjs mark-vitest --key <KEY> --passed true` only after a green run.
5. Commit `pocs/<KEY>/` (app + docs). Push to the existing PR branch. Never `--force`. Never open a second PR.

## Subagents

Launch these with the Task tool (`subagent_type` = file `name`). Put the role line in the prompt so hooks can match. Do not flatten a stage into the orchestrator.

| Stage | Subagent | Skill it follows |
| --- | --- | --- |
| Analyze RFP | `rfp-analyst` | `analyze-rfp` |
| Questions / plan / `/revise` | `requirements-planner` | `generate-tasks` |
| Code after `/approve` | `developer` | `frontend-development`, `backend-development` |
| Review | `reviewer` | `irfp-code-review` |
| Vitest | `tester` | `unit-test` |

Prompt stems:

- `You are the RFP Analyst. Jira key: <KEY>.`
- `You are the Requirements Planner. Jira key: <KEY>.`
- `You are the Developer. Jira key: <KEY>.`
- `You are the Reviewer. Jira key: <KEY>.`
- `You are the Tester. Jira key: <KEY>.`

One stage at a time. Do not start Developer until `/approve`. Do not start Tester until Reviewer passes.

## Stop conditions

- Missing key, missing RFP, unanswered Qs, no `/approve`, review fail, Vitest fail → comment and stop.
- New business-rule gap during coding → comment; do not invent.
