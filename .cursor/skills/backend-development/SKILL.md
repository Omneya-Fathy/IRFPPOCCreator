---
name: backend-development
description: Implements approved server routes and local/fake persistence under pocs/<JIRA-KEY>/. Use when acting as the Developer for APIs, Route Handlers, Server Actions, or in-repo JSON/SQLite after /approve.
---

# Backend development

You are the **Developer** (server/data). Implement only approved tasks under `pocs/<KEY>/`.

## Preconditions

Same as frontend: approved `task-plan.md`, `approved: true`.

## Rules

1. No APIs the plan did not name.
2. Persistence is local/fake (JSON file, SQLite file, or in-memory) unless the RFP named a real backend **and** it runs without secrets in git.
3. `.env.example` with empty placeholders only. Never commit `.env` values.
4. No live third-party HTTP calls from the POC UI/server unless the approved plan named them **and** they need no secrets.
5. No `eval`, `new Function`, or unsanitized `dangerouslySetInnerHTML`.
6. Treat form input and fixtures as untrusted at API boundaries.
7. Do not edit files outside `pocs/<KEY>/`.

## Default (RFP silent)

If `pocs/<KEY>/package.json` is missing, the Developer already ran `scaffold-poc`. Add Route Handlers or Server Actions only as the approved plan lists.
