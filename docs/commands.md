# Slash commands

Type `/` in Cursor chat. Files: `commands/` (plugin). The human who runs a command is the operator (same gate as a human on the Jira issue).

| Command | Arguments | Default | Does | Safety |
| --- | --- | --- | --- | --- |
| `/irfp-setup` | none | — | Write `.irfp/config.json` + host CLI shim | No POC code |
| `/irfp-orchestrator` | Jira key, PR URL, or mode hint | Infer key from branch / newest `pocs/` folder | Start or continue the pipeline | No app code until `/irfp-approve` |
| `/irfp-answer` | `A1: …` text | Map unnumbered answers in order | Record answers; update plan docs | Not approval |
| `/irfp-feedback` | Revision notes | Require an existing brief/plan | Revise task/technical plan | Do not `mark-approved` |
| `/irfp-approve` | Optional Jira key | Infer key as orchestrator does | Stamp approval; generate → review → Vitest → push | Only the human who invoked it |
| `/irfp-status` | Optional Jira key | Infer key as orchestrator does | Print `node scripts/irfp.mjs status` | Read-only |

If no Jira key can be resolved, ask for `PROJ-123` and stop.
