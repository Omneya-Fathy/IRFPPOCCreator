# Hook: rfp-before-analyst

## Purpose

Stop the RFP Analyst until a Jira RFP has been fetched for this run.

## Lifecycle

- Events: `subagentStart`
- Script: `.cursor/hooks/rfp-before-analyst.mjs`
- `failClosed`: true

## Policy

Requires `state.json` `rfpFetched: true` or `pocs/<JIRA-KEY>/.run/rfp-fetched.json` (written by `node scripts/irfp.mjs mark-rfp-fetched --key <KEY> --files <names>`).

## Blocks

- Launching `rfp-analyst` (or a prompt that says RFP Analyst / analyze-rfp) when no fetch stamp exists

## Allows

- Non-analyst subagents
- Analyst after `mark-rfp-fetched`

## Failure behavior

- `permission: deny`
- Human message: no Jira RFP attachment has been fetched
- Agent message: init-run, download attachment, then `mark-rfp-fetched`

## Branch test

```text
node scripts/hooks-selftest.mjs
```
