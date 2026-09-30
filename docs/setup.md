# Operator setup



IRFP runs on a **host** git repository. This repo is the **plugin** (or dogfood both roles). POCs appear only after `/approve` on the Jira issue or `/irfp-approve` in Cursor.



## 1. Install the plugin



- **Local:** clone this repo and add it under Cursor **Customize → Plugins** (local / `~/.cursor/plugins/local/`), or symlink this folder there.

- **Later:** Integrant marketplace entry `irfp-poc-creator`.



Reload Cursor so `skills/`, `commands/`, `agents/`, `rules/`, and `hooks/` load from the plugin manifest.



## 2. Wire the host repo



Open the **host** workspace (the git repo where `pocs/<KEY>/` and PRs should land).



1. Run **`/irfp-setup`** in Cursor, or `node <plugin>/scripts/irfp.mjs setup`.

2. Confirm `.irfp/config.json` (gitignored) has `pluginRoot` and `workspaceRoot`.

3. On a separate host, `scripts/irfp.mjs` is a shim that forwards to the plugin CLI.



Dogfood (this repo only): `node scripts/irfp.mjs setup` once; plugin and workspace roots match.



## 3. Connect Jira MCP



On the **host** workspace: Atlassian MCP with comment write. Policy: `docs/mcp.md`. Do not add plugin `mcp.json` — use the user connector.



## 4. Cloud Automations (host GitHub repo)



Bind automations to the **host** repository (not a plugin-only checkout). See `automations/README.md`.



| Name | Event |

| --- | --- |

| IRFP — Start on Jira Ready | Ready + RFP attachment |

| IRFP — Continue on Jira comment | Human comment on the story |



Prompts: `automations/start.md`, `automations/continue.md`. Do not trigger on git push.



## 5. Slash commands and CLI



`docs/commands.md`. After setup:



```text

node scripts/irfp.mjs help

node scripts/irfp.mjs verify-structure

node scripts/irfp.mjs hooks-selftest

node scripts/irfp.mjs status --key PROJ-123

```



## 6. Smoke test



On a throwaway Jira issue: RFP attachment → Ready → `Q1` / `TASK PLAN` on Jira → human `/approve` → one PR on `poc/<KEY>` after green Vitest. See `docs/setup.md` §8 in `Readme.md` comment protocol.



Rules inventory: `docs/rules-audit.md`.


