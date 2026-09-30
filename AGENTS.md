# Agent operating instructions

This repository packages **IRFP POC Creator** as a **Cursor Plugin**. Generated POCs land in the **host** git repo under `pocs/<JIRA-KEY>/`. Product hard rules: plugin `Readme.md` and `rules/irfp.mdc`. Routing template for other hosts: `templates/AGENTS.md`.

## Workspace

- **Plugin source:** this repo (`.cursor-plugin/plugin.json`, `skills/`, `hooks/`, `scripts/`, `templates/`).
- **Host repo:** any git root where you run IRFP; open the host in Cursor, install the plugin, run `/irfp-setup`, then `node scripts/irfp.mjs` (shim) or the plugin CLI.

When this repo is both plugin and host (dogfood), `pluginRoot` and `workspaceRoot` are the same after `node scripts/irfp.mjs setup`.

## Precedence

On IRFP runs, **IRFP hard rules** in `Readme.md` and `rules/irfp.mdc` win over marketplace alwaysApply plugins. Skills hold procedure. Inventory: `docs/rules-audit.md`.

## MCP

Use **Jira MCP** on the host workspace to read issues, download RFP attachments, and comment (`addOrEditJiraIssueComment`). Use `gh` and git on the **host** for branch `poc/<KEY>` and one PR after Vitest. Never invent an RFP. Details: `docs/mcp.md`.

## Agent skills

- `skills/irfp-orchestrator/SKILL.md` — entry point for start/continue
- `skills/analyze-rfp/SKILL.md` — RFP Analyst
- `skills/generate-tasks/SKILL.md` — Requirements Planner
- `skills/frontend-development/SKILL.md` — Developer UI
- `skills/backend-development/SKILL.md` — Developer fake data
- `skills/irfp-code-review/SKILL.md` — Reviewer
- `skills/unit-test/SKILL.md` — Tester

## Subagents

Plugin agents in `agents/` (`subagent_type`):

| Role | Subagent | Owns |
| --- | --- | --- |
| Exploration | `rfp-analyst` | `docs/rfp-brief.md`, `docs/ui-design-brief.md` |
| Exploration | `requirements-planner` | Questions, plan docs, `TASK PLAN` |
| Execution | `developer` | POC under `pocs/<KEY>/` after `/approve` |
| Verification | `reviewer` | `docs/review-report.md` |
| Verification | `tester` | Vitest + `docs/test-report.md` |

Start from **irfp-orchestrator**. Do not jump to `developer` without `/approve` or `/irfp-approve`.

## Slash commands

Catalog: `docs/commands.md`. Files: `commands/`. Include `/irfp-setup` after plugin install on a host.

## Hooks

Plugin hooks: `hooks/hooks.json` (fail closed). One-pagers: `docs/hooks/`.
