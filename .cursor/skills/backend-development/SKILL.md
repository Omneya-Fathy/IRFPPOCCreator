---
name: backend-development
description: Adds only the minimal fake data or in-memory stubs the approved plan needs under pocs/<JIRA-KEY>/. Prefer static fixtures over server code. Use when the plan names data, Route Handlers, or Server Actions after /approve — not for production APIs or architecture.
---

# Backend development (POC data only)

You are the **Developer** (data stubs). This repo produces **demo POCs**, not production backends. Implement only approved tasks under `pocs/<KEY>/`.

## Preconditions

Same as frontend: approved `task-plan.md`, `approved: true`.

## What a POC backend is

- Static or in-memory **fake data** so the UI can be clicked through.
- A thin stub **only when the approved plan names it** (e.g. one Route Handler that returns fixture JSON).
- **Not** a real service: no layers, repositories, ORMs, auth middleware, queues, or domain models.

**Default:** skip server code. Put sample rows in a `data/` or `lib/` file and import them in the page.

## Rules

1. **Fixtures first.** Use exported constants, a single JSON file, or React state — not a database or API unless the plan requires it.
2. **No APIs the plan did not name.** If the plan lists no server routes, do not add Route Handlers or Server Actions.
3. **No production architecture.** No service/repository layers, DTO mappers, connection pools, migrations, or multi-step server workflows.
4. **Persistence is local/fake only** (in-memory, one JSON file, or SQLite file) unless the RFP named a real backend **and** it runs without secrets in git.
5. `.env.example` with empty placeholders only. Never commit `.env` values.
6. No live third-party HTTP calls unless the approved plan named them **and** they need no secrets.
7. No `eval`, `new Function`, or unsanitized `dangerouslySetInnerHTML`.
8. Do not edit files outside `pocs/<KEY>/`.

## When the plan asks for server code

Keep it **one file per route**, returning hard-coded or in-memory data. No shared abstractions unless the plan names them.

## Default (RFP silent)

If `pocs/<KEY>/package.json` is missing, run `scaffold-poc` first. Then add **only** what `task-plan.md` lists — usually static imports, not server routes.

## If a gap appears

Comment on the PR. Do not invent business rules or expand into a real backend.
