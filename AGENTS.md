# Agent operating instructions

This repository is the **IRFP POC Creator** orchestrator. Generated Proof of Concepts land in `pocs/<JIRA-KEY>/`. Full product rules: `Readme.md`.

## Agent skills

- `.cursor/skills/irfp-orchestrator/SKILL.md` — entry point for start/continue
- `.cursor/skills/analyze-rfp/SKILL.md` — RFP Analyst
- `.cursor/skills/generate-tasks/SKILL.md` — Requirements Planner
- `.cursor/skills/frontend-development/SKILL.md` — Developer demo UI
- `.cursor/skills/backend-development/SKILL.md` — Developer minimal fake data (fixtures first)
- `.cursor/skills/irfp-code-review/SKILL.md` — Reviewer
- `.cursor/skills/unit-test/SKILL.md` — Tester

## Subagents

Project agents in `.cursor/agents/` (Task `subagent_type`):

| Subagent | Owns | Must not |
| --- | --- | --- |
| `rfp-analyst` | `docs/rfp-brief.md` | Code, task list, approval |
| `requirements-planner` | Questions, plan docs, `TASK PLAN` | Code; cannot skip `/approve` |
| `developer` | Demo POC under `pocs/<KEY>/` after `/approve` | Production architecture; orchestrator files; invented rules |
| `reviewer` | `docs/review-report.md` | Approving the original task list |
| `tester` | Vitest + `docs/test-report.md` + `mark-vitest` | Push on red; override a failed review |

Always start from **irfp-orchestrator**. Delegate each pipeline stage to the matching subagent. Do not jump to `developer` without `/approve` from the PR author.

## How to work here

1. Follow the 15 hard rules in `Readme.md`. They are stop conditions.
2. Write application code and POC docs only under `pocs/<JIRA-KEY>/`.
3. Canonical artifacts: `pocs/<JIRA-KEY>/docs/*.md` (templates in `templates/poc-docs/`).
4. Gate stamps: `node scripts/irfp.mjs` (see `--help` via default usage string).
5. PR comments: `Q1`/`A1`, `TASK PLAN`, `/approve`, `/revise`. Only the PR author can approve.
6. Never force-push. Never open a second PR. Never commit secrets or RFP binaries.
7. Default stack when the RFP is silent: Next.js App Router + TypeScript, full-stack, local/fake data, Vitest.

## Hooks

Project hooks in `.cursor/hooks.json` fail closed:

- RFP Analyst cannot start until `mark-rfp-fetched`
- `git commit` of `pocs/<JIRA-KEY>/docs/**` is allowed before Vitest
- `git commit` / `git push` of POC **app** code cannot run until `mark-vitest --passed true`
- After generate phase, writes to orchestrator files are denied
