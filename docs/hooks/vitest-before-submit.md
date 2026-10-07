# Hook: vitest-before-submit

## Purpose

Block `git commit` / `git push` of POC app code until Vitest passed. Docs-only commits are allowed.

## Lifecycle

- Events: `beforeShellExecution`
- Script: `.cursor/hooks/vitest-before-submit.mjs`
- `failClosed`: true

## Policy

On `git commit` or `git push`, require Vitest only for **Jira keys in scope** for that operation (paths in the commit or in commits being pushed, plus branch `poc/<KEY>` on push). Other folders under `pocs/` are not checked.

If a scoped key is in generate/review/test/push (or has app code) and the operation includes non-docs files under that key, require `state.json` `vitestPassed: true` or `pocs/<JIRA-KEY>/.run/vitest-pass.json` with `"ok": true`.

Run Vitest from that POC directory only (`cd pocs/<JIRA-KEY>`), not across the whole repo.

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
