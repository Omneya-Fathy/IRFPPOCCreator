# Agent operating instructions

This repository is the **IRFP POC Creator** orchestrator. Generated Proof of Concepts land in `pocs/<JIRA-KEY>/`. Full product rules: `Readme.md`. Reusable routing template: `templates/AGENTS.md`.

## Workspace

This is a **single-root** workspace. Open the repository root in the IDE. Orchestrator files live here; generated apps live only under `pocs/<JIRA-KEY>/`. There is no sibling repo that owns cross-cutting changes.

## Precedence

For IRFP runs in this repo, **IRFP hard rules** in `Readme.md` and `.cursor/rules/irfp.mdc` win over marketplace alwaysApply plugins (including ADLC, PO Elite Pipeline, and Architect). Skills hold procedure; they do not override those hard rules. Inventory: `docs/rules-audit.md`.

## MCP

Use **Jira MCP** to read the issue, download the RFP attachment, **comment on the issue** (`addOrEditJiraIssueComment`), and **transition to In Review** only. Use `gh` / git / Open Pull Request for the GitHub branch and one PR after Vitest. Never invent an RFP. Details: `docs/mcp.md`.

## Agent skills

- `.cursor/skills/irfp-orchestrator/SKILL.md` — entry point for Ready for POC / Desktop slash commands
- `.cursor/skills/analyze-rfp/SKILL.md` — RFP Analyst (brief + `docs/ui-design-brief.md`)
- `.cursor/skills/generate-tasks/SKILL.md` — Requirements Planner
- `.cursor/skills/frontend-development/SKILL.md` — Developer demo UI from approved tasks + selected UI design brief + brief UI requirements (scaffold tokens/`components/ui`, not a greenfield Tailwind install). First-glance appeal, domain retokenize, and concept propagation required; no extra screens.
- `.cursor/skills/backend-development/SKILL.md` — Developer minimal fake data (fixtures first)
- `.cursor/skills/irfp-code-review/SKILL.md` — Reviewer
- `.cursor/skills/unit-test/SKILL.md` — Tester

## Subagents

Project agents in `.cursor/agents/` (Task `subagent_type`):

| Q3 role | Subagent | Owns | Must not |
| --- | --- | --- | --- |
| Exploration | `rfp-analyst` | `docs/rfp-brief.md` + `docs/ui-design-brief.md` (capabilities, UI requirements, UI direction, selected design concept) | Code, task list, approval, invented business rules |
| Exploration | `requirements-planner` | Questions, plan docs, `TASK PLAN` | Code; cannot skip `/approve` |
| Execution | `developer` | Demo POC under `pocs/<KEY>/` after `/approve` | Production architecture; orchestrator files; invented rules |
| Verification | `reviewer` | `docs/review-report.md` | Approving the original task list |
| Verification | `tester` | Vitest + `docs/test-report.md` + `mark-vitest` | Push on red; override a failed review |

Always start from **irfp-orchestrator**. Delegate each pipeline stage to the matching subagent. Do not jump to `developer` without `/approve` from a human on the Jira issue or `/irfp-approve` (Cursor command).

## Slash commands

Catalog (arguments, defaults, safety notes): `docs/commands.md`. Files in `.cursor/commands/`. Type `/` in chat.

## How to work here

1. Follow the 15 hard rules in `Readme.md`. They are stop conditions.
2. Write application code and POC docs only under `pocs/<JIRA-KEY>/`.
3. Canonical artifacts: `pocs/<JIRA-KEY>/docs/*` including durable `run-state.json` (templates in `templates/poc-docs/`).
4. Gate stamps: `node scripts/irfp.mjs` (see `--help` via default usage string). On each Ready for POC wake: `ensure-run` (start if no `docs/run-state.json`, else resume). Commit/push `docs/run-state.json` on `poc/<KEY>` after each Q&A round.
5. Gates: Jira status **Ready for POC** wakes Cloud; after questions the agent transitions to **In Review** and stops. PO answers and moves back to Ready for POC to run again. Comments `Q1`/`A1`, `TASK PLAN`, `/approve`, `/revise`, **or** the matching Cursor commands. Any human on the issue (or the human who ran the command) may approve; ignore the automation account. Max **3** question rounds (`qaLoopCount`).
6. Never force-push. Never open a second PR for the same Jira key. Never commit secrets or RFP binaries.
7. Default stack when the RFP is silent: Next.js App Router + TypeScript, full-stack, local/fake data, Vitest.

## Hooks

Project hooks in `.cursor/hooks.json` fail closed. One-pagers: `docs/hooks/`.

- RFP Analyst cannot start until `mark-rfp-fetched`
- `git commit` of `pocs/<JIRA-KEY>/docs/**` is allowed before Vitest
- `git commit` / `git push` of POC **app** code cannot run until `mark-vitest --passed true`
- After generate phase, writes to orchestrator files are denied
- POC UI/markdown cannot contain `http(s)` URLs or `next/font/google`
- Root `pocs/<JIRA-KEY>/app/layout.tsx` must keep `import "./globals.css"`; `app/globals.css` must keep `@tailwind` layers (`poc-tailwind-wired` hook)
- POC files cannot contain secret patterns (keys, tokens, private keys); values are not echoed

`approve-before-developer` is registered in `hooks.json` (`subagentStart` matcher `developer`, and `preToolUse` on writes). `/approve` / `/irfp-approve` and `mark-approved` remain required by skills and the orchestrator. Script: `.cursor/hooks/approve-before-developer.mjs`.
