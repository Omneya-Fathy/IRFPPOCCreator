# Operator setup

This repo is the orchestrator. A generated app appears only after `/approve` on the **Jira issue** or `/irfp-approve` in Cursor. GitHub is for code delivery (one PR per Jira key after green Vitest).

## 1. Push the orchestrator

Commit and push `main` to GitHub so Cloud Agents can check out skills, hooks, and templates.

## 2. Connect Jira MCP in Cursor

Jira MCP policy (who, allowed tools, errors, golden-path checklist): `docs/mcp.md`.

If Jira MCP is missing or unauthenticated, the agent comments on the **Jira issue** (if the key is known) and stops. Do not invent an RFP. Enable **comment write** (`addOrEditJiraIssueComment`). Do not rely on GitHub PR comments as the gate channel.

## 3. Create two Cursor Cloud Automations

See `automations/README.md`. Do not combine them. Do not trigger on git push (that would loop).

| Name | Event | Extra |
| --- | --- | --- |
| IRFP — Start on Jira Ready | Webhook: status → Ready **and** attachment named RFP | Branch `poc/<KEY>`; Jira comments only |
| IRFP — Continue on Jira comment | Webhook: comment on the user story | Human comments only; ignore agent `accountId` and `**[IRFP POC Creator]**` |

Tools: **Jira MCP (read + comment)**, **git/gh** for branch `poc/<KEY>` and PR create-once after Vitest.

## 4. How a run should start

1. Attach an RFP file on the Jira issue (filename matching **RFP**).
2. Move the user story to **Ready**. The Start automation fetches the attachment, stamps `mark-rfp-fetched`, then launches `rfp-analyst`.
3. Start always downloads one RFP automatically: among RFP-named attachments (or all attachments if none match the name), it picks the **latest upload**. It does not wait for a human to choose a filename.
4. Code is not generated until a human comments `/approve` (or `/irfp-approve` in Cursor). After green Vitest the agent pushes `poc/<KEY>` and opens **one** GitHub PR.

## 5. Cursor slash commands

Catalog: `docs/commands.md`. Type `/` in chat. When `cloudId` and the issue key are known, mirror Q1 / TASK PLAN / summaries to Jira. Docs under `pocs/<KEY>/docs/` stay canonical.

## 6. Local CLI

```text
node scripts/irfp.mjs help
node scripts/irfp.mjs status --key PROJ-123
node scripts/irfp.mjs verify-structure
node scripts/irfp.mjs hooks-selftest
```

## 7. Identity gate (Continue)

Any **human** on the Jira issue (or the human who ran the Cursor command) may:

- Answer `Q1` / `A1` (Jira comment or `/irfp-answer`)
- Comment `/approve` / `/revise`, or run `/irfp-approve` / `/irfp-feedback`

Ignore comments from the connected MCP/automation Atlassian user and any body that starts with `**[IRFP POC Creator]**`.

## 8. Smoke test (after merge)

Confirm the Continue webhook sends **issue key**, **comment body**, and **author accountId**. Then on a throwaway issue:

1. Attach an RFP-named file, move the story to Ready → Start runs.
2. See `Q1` / `TASK PLAN` on the **Jira issue** (prefix `**[IRFP POC Creator]**`).
3. A human comments `/approve` (or answers then `/approve`).
4. Agent ignores its own follow-up Jira comments (same `accountId` and/or prefix).
5. After green Vitest, **one** GitHub PR exists for `poc/<KEY>`; Jira summary uses `GitHub PR #N on branch poc/KEY` with no `http(s)`.

Rules inventory: `docs/rules-audit.md`.
