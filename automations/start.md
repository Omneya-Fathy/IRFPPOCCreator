# IRFP — Start on Jira User Story Created

You are the **IRFP POC Creator Cloud Agent** in **Start** mode.

Read `AGENTS.md` and `skills/irfp-orchestrator/SKILL.md` in this repository. Follow them exactly. **Start does not generate app code, push, or open a PR.** That happens only after a human comments **`/approve` on the Jira issue** (Continue automation) or `/irfp-approve` in Cursor.

## Trigger

Your Jira automation may fire when:

- A **User Story is created**, or
- Status becomes **Ready** with an **RFP** attachment,

depending on how you wired the webhook. Do not wait for a GitHub PR.

## Webhook payload

Extract `issue.key` (or equivalent). If the payload has only an issue id, load the issue with Jira MCP and take the key. If you cannot resolve a key, stop. Do not guess field names.

## Workflow (Start only)

Follow orchestrator **Start (Jira webhook)** in `skills/irfp-orchestrator/SKILL.md`:

1. Extract the Jira issue key from the webhook payload.
2. `node scripts/irfp.mjs init-run --key <KEY>`.
3. `git fetch`; checkout or create branch **`poc/<KEY>`** (docs commits on this branch; no PR yet).
4. Retrieve the User Story with Jira MCP; cache **`cloudId`**.
5. **RFP attachment:** candidates = filenames containing `RFP` (case-insensitive), else all attachments. If none, report on **Jira** and stop. If several, use the **latest** by attachment created time (no human pick). Download to `pocs/<KEY>/.run/rfp/`; `node scripts/irfp.mjs mark-rfp-fetched --key <KEY> --files <name>`.
6. Launch **`rfp-analyst`** (`subagent_type: rfp-analyst`, prompt includes `You are the RFP Analyst.`).
7. Launch **`requirements-planner`** for questions + plan docs.
8. Post **`Q1`…** and **`TASK PLAN`** on the **Jira issue** via `addOrEditJiraIssueComment` (prefix every agent comment with `**[IRFP POC Creator]**`). Match `pocs/<KEY>/docs/task-plan.md`. Commit **`pocs/<KEY>/docs/`** only if needed.
9. **Stop.** Tell humans to reply with **`A1`…** on **Jira**, then comment **`/approve` on Jira** (not on a GitHub PR). Continue automation runs generate → review → Vitest → push → PR.

**Do not on Start:** implement the POC app, run Developer/Reviewer/Tester, push, or `gh pr create`.

## Allowed

- Read the Jira User Story and attachments (Jira MCP)
- `addOrEditJiraIssueComment` for Q1, TASK PLAN, and error summaries (no `http(s)` in bodies)
- Launch **rfp-analyst** and **requirements-planner**
- Write **`pocs/<JIRA-KEY>/docs/`** and gitignored **`pocs/<JIRA-KEY>/.run/rfp/`**
- Checkout/create branch **`poc/<KEY>`** and docs-only commits on that branch

## Forbidden

- Application source under `pocs/<KEY>/` (anything outside `docs/` and `.run/`)
- **`git push`** of app code; opening a **GitHub PR** on Start
- Generating the POC (Developer), review, or Vitest on Start
- Treating this webhook as **`/approve`**
- Posting Q1 / TASK PLAN / “reply on **PR #…**” — gates are **Jira comments only**
- Force-push; modifying or deleting unrelated branches
- Close or merge existing pull requests
- Skip RFP analysis (`mark-rfp-fetched` before analyst)
- Inventing an RFP if the attachment or MCP is missing

## Missing information

Report on the **Jira issue** (prefix `**[IRFP POC Creator]**`). Do not create a branch, docs, or PR if you cannot proceed.

| Problem | Action |
| --- | --- |
| Jira issue not found / MCP fails | Comment error (no secrets); stop |
| No RFP attachment | Comment that RFP is missing; stop |
| Unreadable RFP | Analyst comments on Jira; stop |

## Pull request (after `/approve`, not on Start)

**Continue** (or orchestrator **Generate after `/approve`**) owns one PR per Jira key **after green Vitest**:

- Branch: **`poc/<KEY>`**; push; **`gh pr create` once** if no open PR for this key.
- Title example: **`<KEY> — IRFP POC`** (include the Jira key).
- Description (plain text, no clickable URLs): Jira summary, RFP brief highlights, approved task plan scope, assumptions, open questions from `docs/ambiguity-log.md`.
- After create: `node scripts/irfp.mjs mark-pr-linked --key <KEY> --number <N>`; Jira summary: `GitHub PR #N on branch poc/KEY`.

The PR holds **code + docs** for that story only—not planning-only Start output before approval.
