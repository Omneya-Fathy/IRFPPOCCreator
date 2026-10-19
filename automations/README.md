# Cursor Cloud Agent setup

Create **one** automation on this repository. Do not trigger on git push or on every Jira comment.

| Name | Event | Tools | Agent instructions |
| --- | --- | --- | --- |
| IRFP — Ready for POC | Webhook: status → **Ready for POC** (your Jira rule; prefer RFP attachment present) | Atlassian (incl. transitions), git, **Open Pull Request** | Paste [`automations/start.md`](start.md) |

Repo: **IRFPPOCCreator** (this repository).

## How instructions relate to the repo

| Artifact | Role |
| --- | --- |
| [`automations/start.md`](start.md) | **Paste into** the Cursor Automation **Instructions** field (thin router). |
| [`.cursor/skills/irfp-orchestrator/SKILL.md`](../.cursor/skills/irfp-orchestrator/SKILL.md) | **Canonical workflow** (Ready for POC First fetch / Resume / Generate). |
| [`.cursor/commands/`](../.cursor/commands/) | **Desktop chat only** — same skill; automations do not invoke slash commands. |
| [`docs/automation-ready-for-poc.md`](../docs/automation-ready-for-poc.md) | Tool checklist + Cloud delivery (Open PR, resume). |

Cursor does not auto-load `automations/start.md` from git into the UI — **copy** the file (or keep the UI text in sync when `main` changes).

## Jira Automation

On transition **to Ready for POC** → POST the Cursor webhook URL. The agent moves the issue to **In Review** after questions; the PO answers in comments and moves status back to Ready for POC to wake the agent again (max 3 question rounds).

Connect Jira MCP so the agent can list/download attachments, **write comments**, and **transition to In Review**.

Full operator checklist: [`docs/setup.md`](../docs/setup.md).
