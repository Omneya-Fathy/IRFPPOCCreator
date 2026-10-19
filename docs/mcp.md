# Jira MCP (system of record)

Jira is the only MCP this orchestrator uses. Full operator wiring: `docs/setup.md`.

## Who may invoke it

The **orchestrator** (Cloud Agent on **Ready for POC**, or `/irfp-orchestrator`) fetches the RFP, posts gate comments, lists comments on resume, and transitions to **In Review**. Other subagents consume files already under `pocs/<KEY>/.run/rfp/` and docs under `pocs/<KEY>/docs/`. They do not call Jira themselves unless the orchestrator is posting a stop/summary on their behalf.

## Allowed operations

- Resolve an issue from a key (`PROJ-123`)
- `getAccessibleAtlassianResources` (cache `cloudId`) and `atlassianUserInfo` (filter agent comments from the human thread)
- List attachments
- Download the chosen RFP file into `pocs/<KEY>/.run/rfp/` (gitignored). When several attachments qualify, choose the **latest** upload; do not wait for human confirmation. Re-download on each Cloud run if the local file is missing.
- `addOrEditJiraIssueComment` for Q1, TASK PLAN, max-loop stop, errors, review/test/push summaries (markdown; prefix `**[IRFP POC Creator]**`)
- **`listJiraIssueComments`** on every **Ready for POC resume** — if not a primary MCP tool, `discover` then `executeRead` (`cloudId` top-level). Paginate (`startAt` until `isLast`); merge `A1`… and honor `/approve` / `/revise` (see orchestrator skill)
- **`listJiraIssueTransitions`** (same: `discover` + `executeRead` if needed) + **`transitionJiraIssue`** only to destination status **In Review**. Use after posting questions or the max-loop stop comment. Never transition to Ready for POC.

## Denied

- Inventing an RFP when MCP is missing, unauthenticated, or the issue has no attachment
- Transitions to **Ready for POC** or any status other than **In Review**
- Arbitrary field edits (except via the allowed transition above)
- Committing the RFP binary, secrets, or tokens
- `http(s)` URLs in agent-written Jira comment bodies (use `GitHub PR #N on branch poc/KEY`)

## Auth and errors

Connect Cursor **Atlassian MCP** so the agent can reach Jira. If MCP is missing, unauthenticated, or the issue is not found: comment on the **Jira issue** if the key is known (no secrets in the comment) and **stop**. Do not paste a substitute RFP.

Use **git** / **gh** (or Cursor **Open Pull Request**) for the GitHub branch and PR. Do not use Jira MCP for commits or pushes.

## Golden-path checklist (Q3 MCP proof)

This is a proof that MCP works end-to-end. It is **not** one of the 15 IRFP hard rules.

1. Status **Ready for POC** (or `/irfp-orchestrator`) names a Jira key; webhook or chat supplies it.
2. Agent loads the issue via Jira MCP (not a pasted file).
3. Agent lists attachments, downloads the chosen RFP, `node scripts/irfp.mjs mark-rfp-fetched --key <KEY> --files <names>`.
4. `rfp-analyst` writes `pocs/<KEY>/docs/rfp-brief.md` and `pocs/<KEY>/docs/ui-design-brief.md`.
5. Orchestrator posts `Q1` / `TASK PLAN` with `addOrEditJiraIssueComment`, stamps `mark-qa-round`, commits `docs/run-state.json`, transitions to **In Review**.

**Status in this tree:** not yet proven for the Ready-for-POC loop.
