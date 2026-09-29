---
name: irfp-orchestrator
description: Routes IRFP POC Creator runs from a Jira issue (RFP attachment + comments) through analyze, Q&A, /approve, generate, review, Vitest, and a GitHub PR for code. Use when a Jira webhook fires (Ready + RFP, or a comment), a Cursor slash command `/irfp-orchestrator` `/irfp-answer` `/irfp-feedback` `/irfp-approve` `/irfp-status` is used, a Jira key is present, or the user says start/continue the RFP POC pipeline.
---

# IRFP orchestrator

Read `Readme.md` and `AGENTS.md` first. You are the only entry point. Do not skip gates.

Gates live on **Jira issue comments**. GitHub is for **code delivery** only (one PR per Jira key after green Vitest).

## How to comment on Jira

Use Atlassian MCP `addOrEditJiraIssueComment`:

1. `getAccessibleAtlassianResources` once per session; cache **`cloudId`**. After `gh pr create`, run `node scripts/irfp.mjs mark-pr-linked --key <KEY> --number <N> [--branch poc/<KEY>] [--cloud-id <uuid>]`.
2. Call `addOrEditJiraIssueComment` with `cloudId`, `issueIdOrKey` = `<KEY>`, markdown `commentBody`.
3. Prefix every agent post with `**[IRFP POC Creator]**` so Continue can ignore it.
4. Do **not** put `http://` or `https://` in comment bodies. For a GitHub PR, write plain text such as `GitHub PR #N on branch poc/KEY` (no clickable URL).
5. Do not invent an RFP if MCP fails. If you cannot comment (MCP down), stop; do not paste a substitute RFP.

`atlassianUserInfo` once per Continue run: ignore comments whose author `accountId` matches the connected user.

## Modes

### Start (Jira webhook — primary)

Trigger: Jira webhook (User Story **created** and/or status **Ready** with RFP attachment—match your automation). Do not wait for a GitHub PR.

1. Resolve **`issueKey`** from the webhook payload (`issue.key` or equivalent). If only an issue id is present, load the issue with Jira MCP (`getJiraIssue`) and take the key. If the payload has neither, stop (cannot comment without a key).
2. `node scripts/irfp.mjs init-run --key <KEY>` (creates `pocs/<KEY>/`, sets default branch `poc/<KEY>`).
3. **Branch:** `git fetch` then checkout or create `poc/<KEY>`. All docs commits go on this branch. No PR is required yet.
4. Jira MCP: cache `cloudId`; load the issue; list attachments.
5. **RFP selection (no human pick):** Build candidates: attachments whose filename contains `RFP` (case-insensitive). If that set is empty, use **all** issue attachments. If zero attachments, comment and stop. If one candidate, use it. If **multiple**, auto-select the **latest** by Jira attachment **created** time (newest upload wins). Do **not** comment a file list and wait; do **not** require Continue or `mark-selected-attachment` for the default path. Tie-break when created times are equal or missing: prefer `.html` / `.htm`, then `.docx`, then others. After choosing, you may note on Jira which filename was used (prefix `**[IRFP POC Creator]**`); do not block the pipeline for confirmation.
6. Download the chosen RFP into `pocs/<KEY>/.run/rfp/` (gitignored). Do not commit the binary.
7. `node scripts/irfp.mjs mark-rfp-fetched --key <KEY> --files <names>`
8. Launch the **rfp-analyst** subagent (`subagent_type: rfp-analyst`). Prompt must include `You are the RFP Analyst.` so the RFP hook matches. Do not write app code. Analyst owns capabilities, UI requirements, and UI direction in `docs/rfp-brief.md`.
9. Launch the **requirements-planner** subagent for questions + draft plan docs. Planner copies UI direction into `technical-plan.md`; it does not restyle. If UI direction is insufficient, Planner expands it in the brief before `TASK PLAN`. Analyst and Planner own the minimum UI direction fields (Tone, Density, Context, Notes ≥ two lines, Demo quality).
10. Post `Q1`… and `TASK PLAN` on the **Jira issue** only (not a GitHub PR). Commit only `pocs/<KEY>/docs/` if you must persist files. Docs-only commits are allowed before Vitest. No app source.

### Continue (Jira comment webhook)

Identity gate on the **webhook comment** (do this first, every time):

1. Read **`issue.key`**, comment **author `accountId`**, and **body** from the webhook payload. If `issue.key` is missing, stop. If comment body or author is missing, use **Load comments** (below) and treat the **newest human** comment as the trigger; if none, stop.
2. Call **`atlassianUserInfo`**. If the **webhook** commenter `accountId` equals the connected user → **ignore** (no files, no replies; loop guard).
3. If the **webhook** body starts with `**[IRFP POC Creator]**` → **ignore**.
4. Any other human **webhook** commenter may proceed.

**Load comments (required after the gate passes):**

1. Call **`listJiraIssueComments`** with `cloudId`, `issueIdOrKey`, `orderBy`: `created`, `maxResults`: 100. Paginate with `startAt` until `isLast` is true (do not rely on `getJiraIssue` alone — it embeds at most ~20 comments).
2. Build the **human thread**: drop comments whose author `accountId` is the connected MCP user and drop bodies starting with `**[IRFP POC Creator]**`.
3. Reconcile **`A1`…** answers from **all** human comments into `docs/ambiguity-log.md` (not only the webhook body). Use **`pocs/<KEY>/docs/ambiguity-log.md`** as source of truth; do not duplicate lines already logged.
4. **Commands:** if the **newest** human comment is `/revise`, run revise flow. If the **newest** human comment is `/approve` (and blocking questions are answered per the log), run approve flow. If the newest comment is an answer, run planner. Older `/approve` without a newer human `/revise` does not apply if a later human comment superseded it — prefer **newest** human comment for the command; still merge **all** `A1`… text from the full thread.

Then:

1. **Optional attachment override:** If a human comment names a **specific filename** and fetch/analysis has not completed (or they ask to re-run on a different file), run `mark-selected-attachment`, download that file, then `rfp-analyst` if analysis has not run. Otherwise do not stop Start for multiple attachments.
2. `A1` / threaded answers: launch **requirements-planner** to update `docs/ambiguity-log.md` and plan files; comment remaining gaps on Jira. Docs-only git commits are allowed.
3. `/revise` from a human: launch **requirements-planner**; do not generate.
4. `/approve` from a human: `node scripts/irfp.mjs mark-approved --key <KEY>` then generate → review → Vitest → push / create PR.
5. Any other text: if it answers a question, treat as an answer. Otherwise comment on Jira that you need `/approve` or `/revise`.

### Legacy Start (PR opened)

Optional for local/`gh`-driven runs. Extract the first Jira key from PR title then body. If `isDraft` is true, stop with no comment. Then follow **Start (Jira webhook)** from `init-run` onward. **Always comment on Jira** when `issueKey` is known — do not dual-post to the PR.

## Generate after `/approve`

1. **developer** subagent — first `node scripts/irfp.mjs scaffold-poc --key <KEY>` (Next.js + Vitest + Tailwind + `components/ui`; skips existing docs). Retokenize scaffold primitives from brief UI direction; do not invent a greenfield design system. Then implement UI/server under `pocs/<KEY>/` from the approved plan plus brief UI requirements/direction. Analyst and Planner own **minimum UI direction** before this step. Developer must not re-analyze the RFP files.
2. **reviewer** subagent — fail closed on any hard-rule miss. May commit `docs/review-report.md` only (docs-only commit allowed without Vitest). Comment a short pass/fail on **Jira**.
3. **tester** subagent — Vitest in the POC directory. Stamp `mark-vitest` **before** committing app files or pushing.
4. `node scripts/irfp.mjs mark-vitest --key <KEY> --passed true` only after a green run.
5. Commit `pocs/<KEY>/` (app + docs) on branch `poc/<KEY>` (or `state.branch`). Never `--force`.
6. **PR create-once:** `gh pr list --search "<KEY>" --json number,headRefName` (and/or head `poc/<KEY>`). If **no open PR** for this key: `git push -u origin poc/<KEY>`, then **`gh pr create`** once (title/body include `<KEY>`). `node scripts/irfp.mjs mark-pr-linked --key <KEY> --number <N> --branch poc/<KEY>`. If a PR already exists: push to **that** branch only. Never open a **second** PR for the same Jira key.
7. Post a short **Jira** summary (review/test/push outcome, `GitHub PR #N on branch poc/KEY`). No clickable `http(s)`.

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

- Missing key, missing RFP, unanswered Qs, no `/approve`, review fail, Vitest fail → comment on **Jira** and stop.
- New business-rule gap during coding → comment on **Jira**; do not invent.
