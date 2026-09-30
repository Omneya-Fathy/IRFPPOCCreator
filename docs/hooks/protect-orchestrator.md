# Hook: protect-orchestrator

## Purpose

After generate phase, deny writes outside `pocs/<JIRA-KEY>/` in the **host** workspace.

## Lifecycle

- Events: `preToolUse` (Write / StrReplace / Delete / EditNotebook), `afterFileEdit`
- Script: `hooks/protect-orchestrator.mjs`
- `failClosed`: true

## Policy

If any run’s phase is in generate/review/test/push, allow **only** paths under `pocs/<KEY>/` for active generating keys. Deny writes anywhere else (including host `src/`, plugin paths if visible, etc.).

If no run is in those phases, allow.

## Branch test

```text
node scripts/irfp.mjs hooks-selftest
```
