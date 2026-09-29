# Glossary

- **IRFP** — this orchestrator: Jira RFP attachment to generated POC.
- **POC** — Proof of Concept app under `pocs/<JIRA-KEY>/`.
- **Jira key** — `issue.key` from the Start webhook, or first `PROJ-123` in a legacy PR title/body.
- **Human on the Jira issue** — any human commenter except the connected MCP/automation account; may answer ambiguities and comment `/approve` or `/revise` (or the matching Cursor commands `/irfp-answer`, `/irfp-approve`, `/irfp-feedback`).
- **Operator** — the human who ran a Cursor slash command (same gate as a Jira human).
- **TASK PLAN** — Jira comment that must match `docs/task-plan.md`.
- **RFP brief** — `docs/rfp-brief.md`: capabilities, UI requirements (explicit vs derived), UI direction.
- **Orchestrator files** — everything outside `pocs/`. Developers must not edit them during a run.
