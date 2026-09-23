# Jira MCP (system of record)

Jira is the only MCP this orchestrator uses. Full operator wiring: `docs/setup.md`.

## Who may invoke it

The **orchestrator** (Cloud Agent Start, or `/irfp-orchestrator` in Start mode) fetches the RFP. Other subagents consume files already under `pocs/<KEY>/.run/rfp/`. They do not call Jira themselves.

## Allowed operations

- Resolve an issue from a key (`PROJ-123`)
- List attachments
- Download the chosen RFP file into `pocs/<KEY>/.run/rfp/` (gitignored)

## Denied

- Inventing an RFP when MCP is missing, unauthenticated, or the issue has no attachment
- Writing or transitioning Jira issues
- Committing the RFP binary, secrets, or tokens

## Auth and errors

Connect Cursor **Atlassian MCP** so the agent can reach Jira. If MCP is missing, unauthenticated, or the issue is not found: comment on the PR (no secrets in the comment) and **stop**. Do not paste a substitute RFP.

Use **git** / **gh** for the GitHub PR. Do not use Jira MCP for PR comments, commits, or pushes.

## Golden-path checklist (Q3 MCP proof)

This is a proof that MCP works end-to-end. It is **not** one of the 15 IRFP hard rules.

1. Ready PR (or `/irfp-orchestrator`) names a Jira key.
2. Agent loads the issue via Jira MCP (not a pasted file).
3. Agent lists attachments, downloads the chosen RFP, `node scripts/irfp.mjs mark-rfp-fetched --key <KEY> --files <names>`.
4. `rfp-analyst` writes `pocs/<KEY>/docs/rfp-brief.md`.

**Status in this tree:** not yet proven. `pocs/` has no generated run.
