# Operator setup

This repo is the orchestrator. A generated app appears only after `/approve` on the **Jira issue** or `/irfp-approve` in Cursor. GitHub is for code delivery (one PR per Jira key after green Vitest).

## 1. Push the orchestrator

Commit and push `main` to GitHub so Cloud Agents can check out skills, hooks, and templates.

## 2. Connect Jira MCP in Cursor

Jira MCP policy (who, allowed tools, errors, golden-path checklist): `docs/mcp.md`.

If Jira MCP is missing or unauthenticated, the agent comments on the **Jira issue** (if the key is known) and stops. Do not invent an RFP. Enable **comment write** (`addOrEditJiraIssueComment`) and **transitions** to **In Review**. Do not rely on GitHub PR comments as the gate channel.

## 3. Create one Cursor Cloud Automation

See `automations/README.md`. Do not trigger on git push or on every comment.

| Name | Event | Extra |
| --- | --- | --- |
| IRFP — Ready for POC | Webhook: status → **Ready for POC** (+ RFP attachment when your Jira rule can check) | Agent → **In Review** after questions; PO returns to Ready for POC after answers |

**Instructions:** paste [`automations/start.md`](../automations/start.md) into the automation UI. Workflow = [orchestrator skill](../.cursor/skills/irfp-orchestrator/SKILL.md) → **Ready for POC**. **Tools / delivery:** [`docs/automation-ready-for-poc.md`](automation-ready-for-poc.md). Prefer **Open Pull Request** over shell `gh` when the CLI is not authenticated.

### Jira board statuses (exact names)

| Status | Who moves | Meaning |
| --- | --- | --- |
| **Ready for POC** | PO | Wakes the Cloud Agent (first time + after answers) |
| **In Review** | Agent (after questions or max-loop stop) | PO answers in comments; then PO returns to Ready for POC |

Q&A round-trips are capped at **3** (`qaLoopCount` in `pocs/<KEY>/docs/run-state.json`). After that the agent leaves **In Review** with a human-review comment.

## 4. How a run should start

1. Attach an RFP file on the Jira issue (filename matching **RFP**).
2. Move the user story to **Ready for POC**. The automation fetches the attachment, stamps `mark-rfp-fetched`, launches `rfp-analyst` / planner, posts Q1 / TASK PLAN, stamps `mark-qa-round`, commits `docs/run-state.json`, transitions to **In Review**.
3. PO answers in comments (`A1`…) and moves status back to **Ready for POC** to resume (repeat up to 3 question rounds).
4. Code is not generated until a human comments `/approve` (or `/irfp-approve` in Cursor) while the agent can run (Ready for POC). After green Vitest the agent pushes `poc/<KEY>` and opens **one** GitHub PR.

## 5. Cursor slash commands

Catalog: `docs/commands.md`. Type `/` in chat. Cloud path is status **Ready for POC**; Desktop commands call the same orchestrator skill. When `cloudId` and the issue key are known, mirror Q1 / TASK PLAN / summaries to Jira. Docs under `pocs/<KEY>/docs/` stay canonical (including `run-state.json`).

## 6. Local CLI

```text
node scripts/irfp.mjs help
node scripts/irfp.mjs ensure-run --key PROJ-123
node scripts/irfp.mjs status --key PROJ-123
node scripts/irfp.mjs mark-qa-loop --key PROJ-123 --count 0
node scripts/irfp.mjs verify-structure
node scripts/irfp.mjs hooks-selftest
```

## 7. Identity gate (human thread)

Any **human** on the Jira issue (or the human who ran the Cursor command) may:

- Answer `Q1` / `A1` (Jira comment or `/irfp-answer`)
- Comment `/approve` / `/revise`, or run `/irfp-approve` / `/irfp-feedback`

Ignore comments from the connected MCP/automation Atlassian user and any body that starts with `**[IRFP POC Creator]**`.

## 8. Smoke test (after merge)

Confirm the Ready for POC webhook sends the **issue key**. Then on a throwaway issue:

1. Attach an RFP-named file, move the story to **Ready for POC** → agent runs.
2. See `Q1` / `TASK PLAN` on the **Jira issue**; status becomes **In Review**; `docs/run-state.json` is on branch `poc/<KEY>` with `qaLoopCount: 1`.
3. A human comments answers, moves status to **Ready for POC** again; then `/approve` when ready.
4. Agent ignores its own follow-up Jira comments when building the human thread.
5. After green Vitest, **one** GitHub PR exists for `poc/<KEY>`; Jira summary uses `GitHub PR #N on branch poc/KEY` with no `http(s)`.

Rules inventory: `docs/rules-audit.md`.
