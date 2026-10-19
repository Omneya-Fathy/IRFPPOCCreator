# POC drop zone

Each generated Proof of Concept lives in `pocs/<JIRA-KEY>/`.

- Orchestrator files stay at the repository root. Do not modify them during a POC run.
- Canonical planning files go in `pocs/<JIRA-KEY>/docs/` (`ensure-run` copies `templates/poc-docs/`, skip existing).
- Durable pipeline state: `pocs/<JIRA-KEY>/docs/run-state.json` (commit on `poc/<KEY>`). Cloud resume reads this file only.
- Mirror + RFP bytes: `pocs/<JIRA-KEY>/.run/` (gitignored). Not enough to resume a new Cloud clone.
- Cloud: `ensure-run` — if `run-state.json` is missing, **start** (`init-run`); else **resume**. Never `bootstrap-state`.
- App scaffold (`templates/poc-next`) is copied by `scaffold-poc` **after** `/approve`, not at start.
