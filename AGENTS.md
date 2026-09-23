# Agent operating instructions

This repository is the **IRFP POC Creator** orchestrator. Generated Proof of Concepts land in `pocs/<JIRA-KEY>/`. Full product rules: `Readme.md`. Reusable routing template: `templates/AGENTS.md`.

## Workspace

This is a **single-root** workspace. Open the repository root in the IDE. Orchestrator files live here; generated apps live only under `pocs/<JIRA-KEY>/`. There is no sibling repo that owns cross-cutting changes.

## Precedence

For IRFP runs in this repo, **IRFP hard rules** in `Readme.md` and `.cursor/rules/irfp.mdc` win over marketplace alwaysApply plugins (including ADLC, PO Elite Pipeline, and Architect). Skills hold procedure; they do not override those hard rules. Inventory: `docs/rules-audit.md`.

## MCP

Use **Jira MCP** only to read the issue and download the RFP attachment. Use `gh` and git for the GitHub PR. Never invent an RFP. Details: `docs/mcp.md`.

## Agent skills

- `.cursor/skills/irfp-orchestrator/SKILL.md` — entry point for start/continue
- `.cursor/skills/analyze-rfp/SKILL.md` — RFP Analyst
- `.cursor/skills/generate-tasks/SKILL.md` — Requirements Planner
- `.cursor/skills/frontend-development/SKILL.md` — Developer demo UI from brief UI direction + scaffold tokens/`components/ui` (not a greenfield Tailwind install). First-glance appeal and domain retokenize required; no extra screens.
- `.cursor/skills/backend-development/SKILL.md` — Developer minimal fake data (fixtures first)
- `.cursor/skills/irfp-code-review/SKILL.md` — Reviewer
- `.cursor/skills/unit-test/SKILL.md` — Tester

## Subagents

Project agents in `.cursor/agents/` (Task `subagent_type`):

| Q3 role | Subagent | Owns | Must not |
| --- | --- | --- | --- |
| Exploration | `rfp-analyst` | `docs/rfp-brief.md` (capabilities, UI requirements, UI direction) | Code, task list, approval, invented business rules |
| Exploration | `requirements-planner` | Questions, plan docs, `TASK PLAN` | Code; cannot skip `/approve` |
| Execution | `developer` | Demo POC under `pocs/<KEY>/` after `/approve` | Production architecture; orchestrator files; invented rules |
| Verification | `reviewer` | `docs/review-report.md` | Approving the original task list |
| Verification | `tester` | Vitest + `docs/test-report.md` + `mark-vitest` | Push on red; override a failed review |

Always start from **irfp-orchestrator**. Delegate each pipeline stage to the matching subagent. Do not jump to `developer` without `/approve` from the PR author (PR comment) or `/irfp-approve` (Cursor command).

## Slash commands

Catalog (arguments, defaults, safety notes): `docs/commands.md`. Files in `.cursor/commands/`. Type `/` in chat.

## How to work here

1. Follow the 15 hard rules in `Readme.md`. They are stop conditions.
2. Write application code and POC docs only under `pocs/<JIRA-KEY>/`.
3. Canonical artifacts: `pocs/<JIRA-KEY>/docs/*.md` (templates in `templates/poc-docs/`).
4. Gate stamps: `node scripts/irfp.mjs` (see `--help` via default usage string).
5. Gates: PR comments `Q1`/`A1`, `TASK PLAN`, `/approve`, `/revise`, **or** the matching Cursor commands. Only the PR author (or the human who ran the command) can approve.
6. Never force-push. Never open a second PR. Never commit secrets or RFP binaries.
7. Default stack when the RFP is silent: Next.js App Router + TypeScript, full-stack, local/fake data, Vitest.

## Hooks

Project hooks in `.cursor/hooks.json` fail closed. One-pagers: `docs/hooks/`.

- RFP Analyst cannot start until `mark-rfp-fetched`
- `git commit` of `pocs/<JIRA-KEY>/docs/**` is allowed before Vitest
- `git commit` / `git push` of POC **app** code cannot run until `mark-vitest --passed true`
- After generate phase, writes to orchestrator files are denied
- POC UI/markdown cannot contain `http(s)` URLs or `next/font/google`
- POC files cannot contain secret patterns (keys, tokens, private keys); values are not echoed

`approve-before-developer` is **unregistered** in `hooks.json` for now. `/approve` / `/irfp-approve` and `mark-approved` remain required by skills and the orchestrator. Script still at `.cursor/hooks/approve-before-developer.mjs`.
