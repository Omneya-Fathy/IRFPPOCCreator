# Hook: no-secrets-in-poc

## Purpose

Keep API keys, tokens, private keys, and real passwords out of the POC tree and git staging.

## Lifecycle

- Events: `preToolUse` (Write / StrReplace / EditNotebook), `afterFileEdit`, `beforeShellExecution`
- Script: `.cursor/hooks/no-secrets-in-poc.mjs`
- `failClosed`: true

## Policy

Narrow pattern checks only (no network, no secret store):

- AWS-style `AKIA…` access keys
- `BEGIN … PRIVATE KEY` blocks
- `Bearer` tokens
- `sk-` style tokens
- `api_key` / `password` / `secret` / `token` assignments with non-placeholder values
- `.env`-style `API_KEY=` / `PASSWORD=` / `SECRET=` / `TOKEN=` lines

Placeholders (`YOUR_…`, `CHANGE_ME`, `<token>`, `${…}`, `process.env…`) are allowed.

Skips `node_modules/`, `.next/`, `.run/`, and lockfiles.

On `git add` / `commit` / `push`, also scans staged (and, for add/`-a`, unstaged) paths under `pocs/`.

## Blocks

- File writes and git submit that match a secret pattern under `pocs/<JIRA-KEY>/`

## Allows

- `process.env.API_KEY` and documented placeholders
- Orchestrator files outside `pocs/`

## Failure behavior

- `permission: deny`
- Reports a pattern **id** and path only — never echoes the matched value
- Parse/runtime errors deny (fail closed)

## Branch test

```text
node scripts/hooks-selftest.mjs
```

Includes: fixture with `sk-` + 20+ chars → deny; `apiKey: process.env.API_KEY` → allow.
