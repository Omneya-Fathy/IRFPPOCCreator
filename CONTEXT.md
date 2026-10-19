# Glossary

- **IRFP** — this orchestrator: Jira RFP attachment to generated POC.
- **POC** — Proof of Concept app under `pocs/<JIRA-KEY>/`.
- **Jira key** — `issue.key` from the Ready for POC webhook, or first `PROJ-123` in a legacy PR title/body.
- **Ready for POC / In Review** — Jira statuses for the Cloud status loop (PO wakes agent; agent waits for answers).
- **run-state.json** — durable pipeline state at `pocs/<KEY>/docs/run-state.json` (`qaLoopCount`, approval stamps).
- **Human on the Jira issue** — any human commenter except the connected MCP/automation account; may answer ambiguities and comment `/approve` or `/revise` (or the matching Cursor commands `/irfp-answer`, `/irfp-approve`, `/irfp-feedback`).
- **Operator** — the human who ran a Cursor slash command (same gate as a Jira human).
- **TASK PLAN** — Jira comment that must match `docs/task-plan.md`.
- **RFP brief** — `docs/rfp-brief.md`: capabilities, UI requirements (explicit vs derived), UI direction (compatibility summary).
- **UI design brief** — `docs/ui-design-brief.md`: three candidate directions, selected concept, signature moment, implementation contract. Canonical visual/interaction concept for new runs.
- **Orchestrator files** — everything outside `pocs/`. Developers must not edit them during a run.
