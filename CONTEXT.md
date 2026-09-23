# Glossary

- **IRFP** — this orchestrator: Jira RFP attachment to generated POC.
- **POC** — Proof of Concept app under `pocs/<JIRA-KEY>/`.
- **Jira key** — first `PROJ-123` in the GitHub PR title, else the body.
- **PR author** — the only human who may answer ambiguities and comment `/approve` or `/revise` (or the matching Cursor commands `/irfp-answer`, `/irfp-approve`, `/irfp-feedback`).
- **TASK PLAN** — PR comment that must match `docs/task-plan.md`.
- **RFP brief** — `docs/rfp-brief.md`: capabilities, UI requirements (explicit vs derived), UI direction.
- **Orchestrator files** — everything outside `pocs/`. Developers must not edit them during a run.
