# Jira MCP (system of record)

Jira is the only MCP this orchestrator uses. Full operator wiring: `docs/setup.md`.

## Who may invoke it

The **orchestrator** (Cloud Agent Start / Continue, or `/irfp-orchestrator`) fetches the RFP and posts gate comments. Other subagents consume files already under `pocs/<KEY>/.run/rfp/` and docs under `pocs/<KEY>/docs/`. They do not call Jira themselves unless the orchestrator is posting a stop/summary on their behalf.

## Allowed operations

- Resolve an issue from a key (`PROJ-123`)
- `getAccessibleAtlassianResources` (cache `cloudId`) and `atlassianUserInfo` (Continue loop guard)
- List attachments
- Download the chosen RFP file into `pocs/<KEY>/.run/rfp/` (gitignored). If HTML and DOCX are both attached, download the HTML only.
- `addOrEditJiraIssueComment` for Q1, TASK PLAN, errors, review/test/push summaries (markdown; prefix `**[IRFP POC Creator]**`)
- Optional `listJiraIssueComments` only to detect duplicates

## Denied

- Inventing an RFP when MCP is missing, unauthenticated, or the issue has no attachment
- Issue transitions and field edits
- Committing the RFP binary, secrets, or tokens
- `http(s)` URLs in agent-written Jira comment bodies (use `GitHub PR #N on branch poc/KEY`)

## Auth and errors

Connect Cursor **Atlassian MCP** so the agent can reach Jira. If MCP is missing, unauthenticated, or the issue is not found: comment on the **Jira issue** if the key is known (no secrets in the comment) and **stop**. Do not paste a substitute RFP.

Use **git** / **gh** for the GitHub branch and PR. Do not use Jira MCP for commits or pushes.

## Golden-path checklist (Q3 MCP proof)

This is a proof that MCP works end-to-end. It is **not** one of the 15 IRFP hard rules.

1. Ready Jira story (or `/irfp-orchestrator`) names a Jira key; Start webhook or chat supplies it.
2. Agent loads the issue via Jira MCP (not a pasted file).
3. Agent lists attachments, downloads the chosen RFP, `node scripts/irfp.mjs mark-rfp-fetched --key <KEY> --files <names>`.
4. `rfp-analyst` writes `pocs/<KEY>/docs/rfp-brief.md`.
5. Orchestrator posts `Q1` / `TASK PLAN` with `addOrEditJiraIssueComment`.

**Status in this tree:** not yet proven. `pocs/` has no generated run.
