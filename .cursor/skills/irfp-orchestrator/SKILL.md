---
name: irfp-orchestrator
description: Routes IRFP POC Creator runs from a Jira issue (Ready for POC status + RFP attachment) through analyze, status-loop Q&A (max 3), /approve, generate, review, Vitest, and a GitHub PR. Use when a Jira webhook fires (status Ready for POC), a Cursor slash command `/irfp-orchestrator` `/irfp-answer` `/irfp-feedback` `/irfp-approve` `/irfp-status` is used, a Jira key is present, or the user says start/continue the RFP POC pipeline.
---

# IRFP orchestrator

You are the only entry point. Hard rules and `AGENTS.md` are already in context — **do not re-read `Readme.md`**. Load this skill and `pocs/<KEY>/docs/` only. Do not skip gates.

Pipeline for visual work:

```text
RFP → requirements analysis → UI/product ideation → docs/ui-design-brief.md
  → Q&A status loop (Ready for POC ↔ In Review, max 3) → /approve
  → frontend implementation → design-aware review → Vitest → PR
```

The Developer consumes the selected design brief. They do not invent the design while coding.

**Cloud wake signal:** Jira status **Ready for POC**. Gates and answers live in **Jira issue comments**. Durable pipeline state is **`pocs/<KEY>/docs/run-state.json`** (commit + push on `poc/<KEY>`). GitHub is for **code delivery** only (one PR per Jira key after green Vitest).

## How to comment on Jira

Use Atlassian MCP `addOrEditJiraIssueComment`:

1. `getAccessibleAtlassianResources` once per session; cache **`cloudId`**. After `gh pr create`, run `node scripts/irfp.mjs mark-pr-linked --key <KEY> --number <N> [--branch poc/<KEY>] [--cloud-id <uuid>]`.
2. Call `addOrEditJiraIssueComment` with `cloudId`, `issueIdOrKey` = `<KEY>`, markdown `commentBody`.
3. Prefix every agent post with `**[IRFP POC Creator]**` so human-thread filters can ignore it.
4. Do **not** put `http://` or `https://` in comment bodies. For a GitHub PR, write plain text such as `GitHub PR #N on branch poc/KEY` (no clickable URL).
5. Do not invent an RFP if MCP fails. If you cannot comment (MCP down), stop; do not paste a substitute RFP.

`atlassianUserInfo` once per run when filtering comment authors: ignore comments whose author `accountId` matches the connected user.

## Durable state (Cloud loops)

- Canonical: `pocs/<KEY>/docs/run-state.json` via `node scripts/irfp.mjs` (`status`, `mark-*`). Also mirrored to gitignored `pocs/<KEY>/.run/state.json` for hooks.
- RFP bytes: `pocs/<KEY>/.run/rfp/` (gitignored) — re-download from Jira each Cloud run if missing.
- **Before stopping** a Q&A round (or after any `mark-*` that must survive the next clone): commit `pocs/<KEY>/docs/` (including `run-state.json`) on `poc/<KEY>` and **`git push`**. Docs-only commits are allowed before Vitest.

Fields used for the status loop: `qaLoopCount` (0–3), `humanReviewRequired`, `rfpFetched`, `approved`, `vitestPassed`, `phase`.

## Transition to In Review

After posting questions or the max-loop stop comment (not after `/approve` generate):

1. Discover Atlassian op `listJiraIssueTransitions` if it is not a primary tool; run it with `executeRead` (`cloudId` top-level).
2. Pick the transition whose **destination status** name matches **In Review** (case-insensitive). Do not match on transition name alone if it differs from the status.
3. `transitionJiraIssue` with that `transitionId`.
4. Never transition **to** Ready for POC (the PO owns that — that is how the Cloud Agent runs again). Never transition to other statuses.

The Cloud Agent **wakes only** when status becomes **Ready for POC**. After agent comments, move to **In Review** and **stop** so the next wake is a new run when the PO returns the issue to Ready for POC.

## Modes

### Ready for POC (Jira webhook — primary)

Trigger: Jira webhook when status becomes **Ready for POC** (operator Jira Automation → Cursor). This is the **only** Cloud wake. Do not wait for a GitHub PR. Do not use a comment-created webhook as the primary Cloud trigger.

Every wake (first time **and** after the PO moves the issue back to Ready for POC):

1. Resolve **`issueKey`** from the webhook payload (`issue.key` or equivalent). If only an issue id is present, load the issue with Jira MCP (`getJiraIssue`) and take the key. If the payload has neither, stop.
2. Cache `cloudId`; `getJiraIssue` — confirm current status is **Ready for POC** (case-insensitive match on status name). If not, comment (if possible) and stop.
3. `git fetch`; checkout or create branch **`poc/<KEY>`**; `git pull` when the remote branch exists (this is how **`docs/run-state.json`** from the last run appears).
4. `node scripts/irfp.mjs ensure-run --key <KEY>` — uses **only** committed `pocs/<KEY>/docs/run-state.json`. Copies `templates/poc-docs/` into `pocs/<KEY>/docs/` (skip existing). Do **not** use `bootstrap-state`. Do **not** treat gitignored `.run/state.json` as enough to resume.
5. Route from `ensure-run` JSON:
   - **`route` is `start`** (`created: true`, or `rfpFetched` false / no durable file) → **First fetch**.
   - **`route` is `resume`** (`rfpFetched` true on durable state) → **Resume**.

#### First fetch

1. Jira MCP: list attachments.
2. **RFP selection (no human pick):** candidates = filenames containing `RFP` (case-insensitive); else all attachments. If zero, comment and stop. If multiple, newest by attachment **created** time. Tie-break: prefer `.html` / `.htm`, then `.docx`, then others. Download into `pocs/<KEY>/.run/rfp/` (gitignored). Do not commit the binary.
3. `node scripts/irfp.mjs mark-rfp-fetched --key <KEY> --files <names>`
4. Launch **rfp-analyst** (`subagent_type: rfp-analyst`, prompt includes `You are the RFP Analyst.`).
5. Launch **requirements-planner** for questions + draft plan docs.
6. Post `Q1`… and `TASK PLAN` on the **Jira issue** (prefix `**[IRFP POC Creator]**`). Match `pocs/<KEY>/docs/task-plan.md`.
7. `node scripts/irfp.mjs mark-qa-round --key <KEY>`
8. Commit `pocs/<KEY>/docs/` (including `run-state.json`); `git push -u origin poc/<KEY>` (or push existing).
9. Transition issue to **In Review**; **stop**. No app code, no `/approve` on first fetch.

#### Resume (after PO answers and returns to Ready for POC)

1. If `pocs/<KEY>/.run/rfp/` is empty, re-download the selected/latest RFP attachment (same selection rules; prefer `state.selectedAttachments` / `state.attachments` names when still on the issue).
2. **Load comments:** Discover `listJiraIssueComments` if it is not a primary tool; call `executeRead` with `cloudId` top-level, `orderBy`: `created`, `maxResults`: 100; paginate with `startAt` until `isLast`. Build the **human thread**: drop connected MCP user and bodies starting with `**[IRFP POC Creator]**`.
3. Reconcile **`A1`…** from **all** human comments into `docs/ambiguity-log.md` (source of truth; do not duplicate lines).
4. **Commands** from the **newest** human comment: `/revise` → revise flow; `/approve` → approve flow if blocking questions are answered; answers → planner. Prefer newest human comment for the command; still merge all `A1`… from the full thread.
5. **Optional attachment override:** if a human names a specific filename to re-fetch, `mark-selected-attachment`, download, re-run analyst only when needed.
6. Launch **requirements-planner** for answers / `/revise` as needed. Docs-only commits allowed.
7. **After planner / answer processing:**
   - If newest human command is **`/approve`** and blocking Qs are answered → `node scripts/irfp.mjs mark-approved --key <KEY>`; commit/push `docs/run-state.json`; then **Generate after `/approve`**. Do **not** transition to In Review.
   - Else if **blocking questions remain**:
     - If `qaLoopCount >= 3` (read from `status`): post the **max-loop stop comment** (below); `node scripts/irfp.mjs mark-human-review --key <KEY>`; commit/push docs; transition to **In Review** if not already; **stop**. Do **not** post a new Q batch.
     - Else: post next `Q…` (+ updated TASK PLAN if needed); `node scripts/irfp.mjs mark-qa-round --key <KEY>`; commit/push docs; transition to **In Review**; **stop**.
   - Else (no blocking Qs, no `/approve`): post/refresh TASK PLAN; comment that the PO may comment **`/approve`** or add answers, then move status to **Ready for POC** when they want the agent again; commit/push; transition to **In Review**; **stop** (do not generate).

**Max-loop stop comment** (prefix `**[IRFP POC Creator]**`, no `http(s)`):

> Agent stopped: reached the maximum of 3 question round-trips. Human review required. Reply with answers and/or `/approve` / `/revise` after review; move status to Ready for POC only when you want the agent to run again (operator may reset `qaLoopCount` via `node scripts/irfp.mjs mark-qa-loop --key <KEY> --count 0` if a new loop is intentional).

### Desktop / slash-command entry

When invoked via `/irfp-orchestrator` (or chat) without a Ready for POC webhook: resolve the Jira key (arguments, branch `poc/KEY`, newest `pocs/` folder). Follow **First fetch** or **Resume** using `ensure-run` the same way. Prefer mirroring Q1 / TASK PLAN / stops to Jira when MCP is available. Chat may supply answers via `/irfp-answer`; approval via `/irfp-approve` (equivalent to Jira `/approve`).

## Generate after `/approve`

1. **developer** subagent — first `node scripts/irfp.mjs scaffold-poc --key <KEY>` (Next.js + Vitest + Tailwind + `components/ui`; skips existing docs). Retokenize `globals.css` + `theme-tokens.ts` from the selected **UI design brief** and get `theme-wiring.test.ts` green **before** routes. Then implement the approved plan (UI/server under `pocs/<KEY>/`). Do not invent a new concept while coding. Developer must not re-analyze the RFP.
2. **reviewer** subagent — fail closed on any hard-rule miss, including retokenized-scaffold UI (tokens without shell/type/signature weight) and red/missing `theme-wiring.test.ts`. May commit `docs/review-report.md` only (docs-only commit allowed without Vitest). Comment a short pass/fail on **Jira**.
3. **tester** subagent — Vitest in the POC directory. Stamp `mark-vitest` **before** committing app files or pushing.
4. `node scripts/irfp.mjs mark-vitest --key <KEY> --passed true` only after a green run. Commit/push `docs/run-state.json` with other docs.
5. Commit `pocs/<KEY>/` (app + docs) on branch `poc/<KEY>` (or `state.branch`). Never `--force`.
6. **PR create-once:** Prefer Cursor **Open Pull Request** when enabled on the Cloud automation; else `gh pr list` / `git push` / `gh pr create` once. Title/body include `<KEY>`. `node scripts/irfp.mjs mark-pr-linked --key <KEY> --number <N> --branch poc/<KEY>`. Never open a **second** PR for the same Jira key. See `docs/automation-ready-for-poc.md` for delivery details.
7. Post a short **Jira** summary (review/test/push outcome, `GitHub PR #N on branch poc/KEY`). No clickable `http(s)`.

## Subagents

Launch these with the Task tool (`subagent_type` = file `name`). Put the role line in the prompt so hooks can match. Do not flatten a stage into the orchestrator. Subagent prompt: role stem, Jira key, **follow that stage’s skill only**, work under `pocs/<KEY>/`. Do **not** tell subagents to read `Readme.md`.

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

- Missing key, wrong status, missing RFP, unanswered Qs, no `/approve`, `qaLoopCount >= 3` with more questions, review fail, Vitest fail → comment on **Jira** and stop.
- New business-rule gap during coding → comment on **Jira**; do not invent.
