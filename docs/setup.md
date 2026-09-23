# Operator setup

This repo is the orchestrator. A generated app appears only after `/approve` on a GitHub PR or `/irfp-approve` in Cursor.

## 1. Push the orchestrator

Commit and push `main` to GitHub so Cloud Agents can check out skills, hooks, and templates.

## 2. Connect Jira MCP in Cursor

Jira MCP policy (who, allowed tools, errors, golden-path checklist): `docs/mcp.md`.

If Jira MCP is missing or unauthenticated, the agent comments on the PR and stops. Do not invent an RFP.

## 3. Create two Cursor Cloud Automations

See `automations/README.md`. Do not combine them. Do not trigger on push (that would loop).

| Name | Event | Extra |
| --- | --- | --- |
| IRFP — Start on PR open | Pull request opened | Ignore drafts |
| IRFP — Continue on PR comment | Comment added | PR author only |

Tools: comment on PRs, Jira MCP, checkout of this repo’s PR branch.

## 4. How a run should start

1. Open a **ready** (not draft) PR whose title or body contains `PROJ-123`.
2. Attach the RFP on that Jira issue.
3. Start agent fetches the attachment, stamps `mark-rfp-fetched`, then launches `rfp-analyst`.
4. If several attachments exist, it comments the list and waits. After the PR author names a file, Continue runs `mark-selected-attachment`.

## 5. Cursor slash commands

Catalog: `docs/commands.md`. Type `/` in chat.

## 6. Local CLI

```text
node scripts/irfp.mjs help
node scripts/irfp.mjs status --key PROJ-123
node scripts/irfp.mjs verify-structure
node scripts/irfp.mjs hooks-selftest
```

## 7. Identity gate (Continue)

Only the **PR author** (or the human who ran the Cursor command) may:

- Answer `Q1` / `A1` (PR comment or `/irfp-answer`)
- Choose an attachment
- Comment `/approve` / `/revise`, or run `/irfp-approve` / `/irfp-feedback`

Ignore comments from anyone else and from the agent itself.

Rules inventory: `docs/rules-audit.md`.
