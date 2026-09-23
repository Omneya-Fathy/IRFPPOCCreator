# Agent operating instructions

This repository is the **`<PRODUCT>`** orchestrator. Replace this file at the repo root as `AGENTS.md`. Keep it as a **routing page** — link to skills and rules; do not paste entire policies.

## Workspace

**Single-root product (this template as used by IRFP):** open the repository root. Generated work lives under a named folder (`pocs/<JIRA-KEY>/` for IRFP).

**Multi-repo workspaces:** document which folder to open in the IDE, which root wins for `AGENTS.md`, and which repo owns cross-cutting skills and MCP config. Do not leave two roots with conflicting MCP instructions.

## Precedence

Product hard rules in `Readme.md` (or equivalent) plus `.cursor/rules/` win over marketplace alwaysApply plugins **in this repo**. Skills hold procedure.

## MCP

Document which MCP is in use, who may call which operations, and when to use git/`gh` instead. IRFP example: `docs/mcp.md` (Jira read-only for the RFP).

## Agent skills

List paths under `.cursor/skills/`:

- `.cursor/skills/<entry-skill>/SKILL.md` — entry point
- Add one line per skill: when to load it

## Subagents

Table: Q3 role (exploration / execution / verification), `subagent_type`, owns, must not.

## Slash commands

Point at a single catalog (IRFP: `docs/commands.md`). Do not duplicate command tables in three files.

## Hooks

Point at `docs/hooks/` and `.cursor/hooks.json`. Keep rule text out of this page.
