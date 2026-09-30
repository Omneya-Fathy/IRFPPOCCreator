# Rules audit

Inventory of always-on instructions. Procedures live in skills, not in rules.

## Workspace rules

| Source | Scope | Notes |
| --- | --- | --- |
| `rules/irfp.mdc` | alwaysApply (plugin) | Short non-negotiables; wins over other marketplace plugins on IRFP runs. |
| `Readme.md` | Product | 15 hard rules (stop conditions). |
| `AGENTS.md` | Routing | Skills, subagents, commands, hooks, MCP pointer. |

## Skills (procedure, not always-on)

Loaded when the matching skill or subagent runs.

## Precedence (IRFP runs)

1. IRFP hard rules in `Readme.md`
2. `rules/irfp.mdc`
3. Plugin skills and subagents under `skills/`, `agents/`
4. Marketplace plugin alwaysApply rules — do not override the layers above
