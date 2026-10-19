# Hook: protect-orchestrator

## Purpose

After generate phase, deny writes to orchestrator files. POC work stays under `pocs/<JIRA-KEY>/`.

## Lifecycle

- Events: `preToolUse` (Write / StrReplace / Delete / EditNotebook), `afterFileEdit`
- Script: `.cursor/hooks/protect-orchestrator.mjs`
- `failClosed`: true

## Policy

If any run’s phase is in generate/review/test/push **and** `vitestPassed` is not true, refuse paths that are not under `pocs/<KEY>/` (orchestrator files at repo root, `.cursor/`, `scripts/`, `templates/`).

If no run is in those phases, or every generate-phase run already passed Vitest, allow (orchestrator maintenance after a delivered POC).

## Blocks

- Editing orchestrator files during a generated POC run

## Allows

- All writes when no generate-phase run exists (orchestrator maintenance)
- Writes under `pocs/<JIRA-KEY>/` during generate

## Failure behavior

- `permission: deny`
- Human message: generated-run agents may only edit `pocs/<JIRA-KEY>/`
- Agent message: hard rule 8

## Branch test

```text
node scripts/hooks-selftest.mjs
```
