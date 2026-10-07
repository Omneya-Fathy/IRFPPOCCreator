# Hook: no-external-urls

## Purpose

Keep clickable `http(s)` URLs, remote images, and `next/font/google` out of generated POC UI and markdown.

## Lifecycle

- Events: `preToolUse` (Write / StrReplace / EditNotebook), `afterFileEdit`
- Script: `.cursor/hooks/no-external-urls.mjs`
- `failClosed`: true

## Policy

Scans files under `pocs/<JIRA-KEY>/` with UI/markdown extensions (`.tsx`, `.ts`, `.jsx`, `.js`, `.md`, `.css`, `.html`, `.svg`, …).

Skips `node_modules/`, `.next/`, `.run/`, and lockfiles (npm registry URLs are not UI links).

Flags:

- `http://` or `https://`
- `next/font/google`

## Blocks

- Saving or editing a scanned POC file that contains those patterns

## Allows

- In-app routes (`/orders`), local assets, package names
- Orchestrator files outside `pocs/`
- Lockfiles and `package.json` (not scanned)

## Failure behavior

- `permission: deny`
- Names the relative path and the rule (hard rule 7)
- Does not print the URL back to the agent

## Branch test

```text
node scripts/hooks-selftest.mjs
```

Includes: `href="https://example.com"` in a `.tsx` payload → deny; local `/about` → allow.
