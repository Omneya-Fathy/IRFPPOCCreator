# Hook: vitest-before-submit

## Purpose

Block `git commit` / `git push` of POC app code until Vitest passed. Docs-only commits are allowed.

## Lifecycle

- Events: `beforeShellExecution`
- Script: `.cursor/hooks/vitest-before-submit.mjs`
- `failClosed`: true

## Policy

On `git commit` or `git push`, if the run is in generate/review/test/push (or the POC has app code), require `state.json` `vitestPassed: true` or `pocs/<JIRA-KEY>/.run/vitest-pass.json` with `"ok": true`.

Also denies force-push (`-f`, `--force`, `--force-with-lease`).

## Blocks

- Commit or push of app files when Vitest has not passed
- Force-push always

## Allows

- Non-git shell
- Docs-only commits (`pocs/<JIRA-KEY>/docs/**`)
- Commit/push after `mark-vitest --passed true`

## Failure behavior

- `permission: deny`
- Human message: Vitest has not passed for the key
- Agent message: hard rule 6; stamp `mark-vitest` before submit

## Branch test

```text
node scripts/hooks-selftest.mjs
```
