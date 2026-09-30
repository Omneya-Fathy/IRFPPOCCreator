---
name: irfp-setup
description: Wire the IRFP plugin to this host repo (.irfp/config.json + CLI shim). Run after installing the plugin.
---

You are running **IRFP setup** for a host workspace.

Read `docs/setup.md` §1–3. Follow `AGENTS.md`.

## Steps

1. `node scripts/irfp.mjs setup` (from the **plugin** checkout if this repo is the plugin source; from the host after the shim exists).
2. Confirm `.irfp/config.json` contains `pluginRoot` and `workspaceRoot`.
3. If the host is not the plugin source, `scripts/irfp.mjs` should be the thin shim that forwards to the plugin CLI.
4. Connect **Atlassian MCP** in Cursor for the host workspace.
5. Tell the operator to use `node scripts/irfp.mjs help` and `/irfp-orchestrator` for runs.

Do not generate POC app code during setup.
