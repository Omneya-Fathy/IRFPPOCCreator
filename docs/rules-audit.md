# Rules audit

Inventory of always-on instructions for this repo. Procedures live in skills, not in rules.

## Workspace rules

| Source | Scope | Notes |
| --- | --- | --- |
| `.cursor/rules/irfp.mdc` | alwaysApply | Short non-negotiables. Points to `Readme.md` and `AGENTS.md`. |
| `Readme.md` | Product | 15 hard rules (stop conditions). Not a Cursor rule file; agents must follow it. |
| `AGENTS.md` | Routing | Skills, subagents, commands, hooks, MCP pointer. Keep thin. |

## Skills (procedure, not always-on)

Loaded when the matching skill or subagent runs. Do not paste full skill text into rules.

## Overlaps and collisions

| Source | Risk |
| --- | --- |
| User rules (git commit / PR / browser verify) | Apply in this session. They must not override IRFP hard rules 6, 8, 11 (Vitest gate, write path, no force-push). |
| ADLC plugin alwaysApply | MCP-first / `.adlc/` policy. Not this product. Ignore for IRFP runs. |
| PO Elite Pipeline alwaysApply | LCD / phase gates. Not this product. Ignore for IRFP runs. |
| Architect plugin alwaysApply | Greenfield scaffolder. Do not scaffold outside `pocs/<KEY>/` on an IRFP run. |

## Precedence (IRFP runs)

1. IRFP hard rules in `Readme.md`
2. `.cursor/rules/irfp.mdc`
3. Project skills and subagents under `.cursor/`
4. Marketplace plugin alwaysApply rules — **do not override** the layers above in this repo
