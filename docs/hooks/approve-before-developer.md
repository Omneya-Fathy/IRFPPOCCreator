# Hook: approve-before-developer

## Purpose

Stop POC app generation until the PR author approves the TASK PLAN.

## Lifecycle

- Events: `subagentStart`, `preToolUse` (Write / StrReplace / EditNotebook)
- Script: `.cursor/hooks/approve-before-developer.mjs`
- `failClosed`: true

## Policy

Requires `state.json` `approved: true` or `pocs/<JIRA-KEY>/.run/approved.json` with `"ok": true` (written by `node scripts/irfp.mjs mark-approved --key <KEY>`).

## Blocks

- Launching the `developer` subagent (or a prompt that says “You are the Developer” / the UI or data skill names) when no run is approved
- Writes to app files under `pocs/<JIRA-KEY>/` outside `docs/` and `.run/`

File **contents** that mention those skill names are not a developer launch.

## Registered

**No.** Unregistered in `.cursor/hooks.json` for now. The script remains; skills still require `/approve` and `mark-approved`.

## Allows

- RFP Analyst, Requirements Planner, Reviewer, Tester
- Docs-only edits under `pocs/<JIRA-KEY>/docs/`
- App writes after `mark-approved`

## Failure behavior

- `permission: deny`
- Human message: TASK PLAN is not approved
- Agent message: stamp with `mark-approved` only after `/approve` or `/irfp-approve`

## Branch test

```text
node scripts/hooks-selftest.mjs
```

Includes: developer launch without stamp → deny; after `mark-approved` → allow; docs write without approval → allow; Write payload that only mentions the UI skill in file contents → allow.
