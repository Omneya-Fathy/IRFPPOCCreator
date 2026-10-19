# Slash commands

Type `/` in Cursor chat. Files: `.cursor/commands/`. The human who runs a command is the operator (same gate as a human on the Jira issue).

**Cloud path:** a single automation on Jira status **Ready for POC** (see `automations/README.md`). Slash commands are **Desktop** entry points into the same orchestrator skill; they do not replace the status webhook.

| Command | Arguments | Default | Does | Safety |
| --- | --- | --- | --- | --- |
| `/irfp-orchestrator` | Jira key, PR URL, or mode hint | Infer key from branch / newest `pocs/` folder | First fetch or Resume (status-loop rules) | No app code until `/irfp-approve`. Max 3 Q rounds. Commit `docs/run-state.json`. |
| `/irfp-answer` | `A1: …` text | Map unnumbered answers in order | Record answers; update plan docs | Do not invent unanswered rules. Not approval. |
| `/irfp-feedback` | Revision notes | Require an existing brief/plan | Revise task/technical plan | Do not `mark-approved`. Do not generate. |
| `/irfp-approve` | Optional Jira key | Infer key as orchestrator does | Stamp approval; generate → review → Vitest → push | Only the human who invoked it. Never force-push. No push if Vitest failed. |
| `/irfp-status` | Optional Jira key | Infer key as orchestrator does | Print `node scripts/irfp.mjs status` (incl. `qaLoopCount`) and the next command | Read-only. No code generation. |

If no Jira key can be resolved, ask for `PROJ-123` and stop.
