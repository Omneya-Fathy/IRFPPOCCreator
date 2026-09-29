# IRFP POC Creator

## Goal

When a **Jira user story** is **Ready** and has an **RFP** attachment, a **Cursor Cloud Agent** fetches that file, resolves gaps with **humans in Jira comments**, generates a POC under `pocs/<JIRA-KEY>/`, runs **Vitest**, then **pushes branch `poc/<JIRA-KEY>/` and opens one GitHub PR**.

The agent must not invent business rules, must not ignore UI specs in the RFP, and must not push code when tests fail.

## What this repo is

This repository is both:

1. The **orchestrator** — agent instructions, skills, subagents, Cursor automations, and hooks.
2. The **POC drop zone** — generated apps live under `pocs/<JIRA-KEY>/` on branch `poc/<JIRA-KEY>`. Orchestrator files at the repo root stay untouched.

Each run produces one demo-quality POC from one RFP. It is not a production system.

## Implementation map

| Piece | Location |
| --- | --- |
| Operating rules | `AGENTS.md`, `.cursor/rules/irfp.mdc` |
| Orchestrator + skills | `.cursor/skills/` |
| Slash commands | `.cursor/commands/` — catalog `docs/commands.md` |
| Subagents | `.cursor/agents/` (`rfp-analyst`, `requirements-planner`, `developer`, `reviewer`, `tester`) |
| Fail-closed hooks | `.cursor/hooks.json`, `.cursor/hooks/` |
| Run CLI | `node scripts/irfp.mjs` (`help`, `scaffold-poc`, `verify-structure`, …) |
| Doc templates | `templates/poc-docs/` |
| Next.js + Vitest + Tailwind scaffold | `templates/poc-next/` (copied by `scaffold-poc`; includes `components/ui`) |
| Cloud Agent prompts | `automations/start.md`, `automations/continue.md` |
| Operator setup | `docs/setup.md` |
| POC drop zone | `pocs/<JIRA-KEY>/` |

Connect Jira MCP, then create the two Cloud Agent automations (`docs/setup.md` and `automations/README.md`). Do not trigger on git push.

## Locked decisions

| Topic | Decision |
| --- | --- |
| Conversation host | **Jira issue comments** (Q1, TASK PLAN, `/approve`, `/revise`) |
| Git host | GitHub Pull Request for **code only** (create once after green Vitest) |
| Which stories start a run | Status **Ready** plus an attachment whose name matches **RFP** |
| Jira key | `issue.key` from the Start webhook (or first `PROJECT-123` in a legacy PR title/body) |
| RFP source | File attached to that Jira issue |
| How a run starts | Cursor Cloud Agent on the Jira Ready webhook |
| Ambiguity + task approval | Comments on the **Jira issue** |
| Who may answer / approve | **Any human** on the issue except the connected automation account |
| Where code goes | Branch `poc/<JIRA-KEY>`, folder `pocs/<JIRA-KEY>/`, one PR per key |
| Default stack | Next.js App Router + TypeScript, demo UI, static/in-memory fake data |
| If the RFP names another framework | **RFP wins.** Rule 5 (Next.js) applies only when the RFP is silent |
| POC depth | Demo-quality UI with minimal fake data; server code only when the approved plan requires it (unless the RFP named another framework) |
| Unit tests | **Vitest.** Must pass before push |
| External links | No clickable `http(s)` links in the UI, POC markdown, or agent Jira comments. Local assets and npm packages are allowed |
| Approval commands | Humans use `/approve` or `/revise` in **Jira comments**, or `/irfp-approve` / `/irfp-feedback` in Cursor |
| Planning artifacts | **Canonical copies live in `pocs/<JIRA-KEY>/docs/`**. Jira comments are for Q&A and gates. |

## Trigger contract

A start run is valid only when all of the following are true:

1. The Jira user story is **Ready**.
2. The issue has at least one attachment whose name matches **RFP**.
3. The webhook (or chat) supplies the issue key (`PROJ-123`).
4. The **Start** Cloud Agent runs.

If any of those fail, the agent comments on the **Jira issue** with what is missing and **stops**. It does not generate code.

### Two Cloud Agent moments (keep them separate)

Mixing these events causes loops: the agent’s own Jira comments would restart Continue; a git push must not restart Start.

| Moment | Event | What the agent may do | What it must not do |
| --- | --- | --- | --- |
| **Start** | Jira webhook: Ready + RFP attachment | Read issue key, fetch RFP via Jira MCP, analyze, post questions and a draft task plan as **Jira comments** | Generate app code, open a PR, treat as `/approve` |
| **Continue** | Jira webhook: comment added | If the comment is from a **human** (not the automation account / not `**[IRFP POC Creator]**`): record answers, revise the plan, or start generation after `/approve` | Treat the agent’s own comments as approval |

**Loop guard:** ignore the connected Atlassian `accountId` and bodies prefixed `**[IRFP POC Creator]**`. A push from the agent must not start a new analysis. Code generation runs only after a human approves the task list in a Jira comment (or `/irfp-approve`).

## End-to-end flow

```text
Jira story Ready + RFP attachment
  → Cloud Agent (start)
  → Resolve issue key from webhook
  → Branch poc/<JIRA-KEY>
  → Hook: RFP attachment exists?
  → Fetch attachment via Jira MCP
  → RFP Analyst: brief + gaps → write docs/rfp-brief.md
  → Requirements Planner: questions as Jira comments
  → Human replies on Jira → update docs/ambiguity-log.md
  → Planner posts the task list → write docs/technical-plan.md + docs/task-plan.md
  → Human comments /approve on Jira
  → Developer: app in pocs/<JIRA-KEY>/
       stack = RFP framework if named, else Next.js demo UI + fake data
  → Reviewer: diff vs RFP + hard rules
  → Tester: Vitest
  → Hook: tests pass?
  → Push poc/<JIRA-KEY>; gh pr create once if no open PR for this key
  → Jira summary: GitHub PR #N on branch poc/KEY
```

```mermaid
sequenceDiagram
  participant Human as Human_on_Jira
  participant Jira as Jira_issue
  participant Start as CloudAgent_Start
  participant Cont as CloudAgent_Continue
  participant GH as GitHub

  Human->>Jira: Ready_plus_RFP_attachment
  Jira->>Start: webhook
  Start->>Jira: Q1_and_TASK_PLAN
  Human->>Jira: A1_or_approve
  Jira->>Cont: comment_webhook
  Cont->>Jira: plan_or_status
  Cont->>GH: push_then_pr_create_once
  Cont->>Jira: PR_number_plain_text
```

## Actors

| Actor | Role |
| --- | --- |
| Human on the Jira issue | Answers questions. Approves the task list. Any human except the automation account. |
| Operator (Cursor) | Same gates via `/irfp-answer`, `/irfp-approve`, `/irfp-feedback`. |
| Cloud Agent (orchestrator) | Routes steps, enforces gates, comments on Jira, pushes only after Vitest passes. |
| RFP Analyst | Reads the RFP attachment. Extracts capabilities, UI requirements (explicit vs derived), UI direction, and gaps. |
| Requirements Planner | Turns the brief into questions, a technical plan, and a task list. Owns the approval gate. |
| Developer | Implements only the approved tasks under `pocs/<JIRA-KEY>/`. |
| Reviewer | Checks the generated code against the RFP, brief UI requirements/direction, approved tasks, and hard rules. Independent of the Developer. |
| Tester | Writes and runs Vitest. Blocks push on failure. |

## Hard rules (stop conditions)

1. **UI specs win.** If the RFP includes layout, components, copy, or interaction notes, generated UI must match them. Do not “improve” or swap in a design system the RFP did not specify. If the RFP is silent on visuals, apply the **UI direction** in `docs/rfp-brief.md` as theme only — do not invent extra screens or business rules.
2. **No secrets in code.** No API keys, tokens, passwords, or connection strings in source, comments, logs, or GitHub PR text. Env placeholders only. Never commit a `.env` file that contains values.
3. **No invented business rules.** If a rule is missing, conflicting, or vague, comment on the **Jira issue** and wait. Do not guess and proceed.
4. **No sensitive data in the POC.** Do not copy real customer records, credentials, or confidential annexes into fixtures or sample payloads. Use clearly fake data.
5. **Framework.** If the RFP names a framework, use it. If the RFP is silent, use Next.js (App Router + TypeScript). A human may still override in a Jira comment. Do not switch stacks silently when the RFP is silent.
6. **Tests are a gate.** Vitest must pass. If tests fail, do not push. Fix or stop and comment the failures on **Jira**.
7. **No clickable external links.** The POC UI and markdown must not contain `http://` or `https://` hrefs (or equivalent clickable URLs). Local assets, in-app routes, and npm packages are allowed. Do not load fonts, images, or scripts from a CDN URL in the generated UI. `next/font/google` and remote `<img src="https://…">` are forbidden; use local files. Agent Jira comments must not include `http(s)` either.
8. **Write path only.** All generated code, tests, and POC docs live under `pocs/<JIRA-KEY>/`. Do not modify orchestrator files at the repo root (`.cursor/`, `Readme.md`, hooks, automations). If a change is needed outside that folder, comment on **Jira** and stop.
9. **One POC per Jira key.** Use the resolved issue key as the folder name (`pocs/PROJ-123/`) and git branch `poc/PROJ-123`. Do not reuse, rename, or split across sibling folders in the same run.
10. **Approved tasks only.** Implement exactly what a human approved in the task list—no extra screens, APIs, or libraries. Visual quality of those screens (theme from UI direction, responsive layout, loading/empty/error states) is required, not optional polish. **POC visual standard:** approved screens must look **modern** and **demo-impressive within restraint** (domain-specific tokens, first-viewport focal point, obvious primary CTA). No extra features. Typographic covers unless the RFP supplies real image files. If new **functional** work is needed, post a revised `TASK PLAN` on Jira and wait; do not ship scope creep.
11. **No force-push.** Push commits onto `poc/<JIRA-KEY>` (the PR for that key). Never force-push. After Vitest, **`gh pr create` once** if no open PR exists for this key; never open a **second** PR for the same Jira key; never rewrite unrelated PR title/body/commits.
12. **Minimal dependencies.** Add npm packages only when required by an approved task or a named RFP constraint. Do not pull in UI kits, ORMs, or SDKs the RFP did not ask for.
13. **No dangerous patterns.** No `eval`, `new Function`, or unsanitized `dangerouslySetInnerHTML` with user- or RFP-sourced strings. Treat fixture and form input as untrusted at API boundaries.
14. **No large binaries.** Do not commit `node_modules`, build output, or multi‑MB assets. RFP-required attachments belong outside git or as clearly documented placeholders—not bloated blobs in the POC tree.
15. **License-safe dependencies.** Only use npm packages with permissive OSS licenses suitable for a client demo. No GPL or other copyleft deps unless the RFP or a human on the issue explicitly allows them.

## Pipeline (gated)

Each step has a required input, an owner, an output, and a gate. A failed gate stops the run and comments on **Jira**.

| # | Step | Owner | Input | Output | Gate |
| --- | --- | --- | --- | --- | --- |
| 0 | Pre-check | Hook + Start agent | Jira webhook | Issue key; issue reachable | Missing key → stop and comment. |
| 1 | Fetch RFP | Orchestrator + Jira MCP | Jira issue | RFP attachment bytes + story fields | **Hook: RFP attachment exists before analyst.** Zero attachments → stop. Multiple RFP matches → ask a human which file(s) to use. |
| 2 | Analyze RFP | RFP Analyst | RFP file(s) | `docs/rfp-brief.md` + Jira summary comment | Brief covers description, capabilities, UI requirements (explicit vs derived), and UI direction. Blocking gaps are business rules/conflicts only — missing branding is filled as inferred direction. File committed under `pocs/<JIRA-KEY>/docs/`. |
| 3 | Resolve ambiguities | Requirements Planner | Brief | Numbered questions on **Jira** + `docs/ambiguity-log.md` | Every blocking gap has a reply from a **human**. Log updated after each reply. No silent defaults for business rules. |
| 4 | Plan technical requirements | Requirements Planner | Brief + answers | `docs/technical-plan.md` + Jira summary comment | Stack (RFP or Next.js), screens, routes, local data, Vitest checks. Still no app code. |
| 5 | Generate tasks | Requirements Planner | Technical plan | `docs/task-plan.md` + Jira `TASK PLAN` comment | **A human must comment `/approve`.** No generation until then. On `/revise`, update the files and wait again. |
| 6 | Generate code | Developer | Approved tasks + brief UI requirements/direction | App under `pocs/<JIRA-KEY>/` | Tasks map 1:1 to changes. No extra features. Theme follows UI direction when explicit design is absent. Persistence is local/fake unless the RFP named a real backend **and** it can run without secrets in git. Do not edit orchestrator files outside `pocs/<JIRA-KEY>/`. |
| 7 | Code review | Reviewer | Diff + RFP + rules | `docs/review-report.md` + Jira summary comment | Fail the run on any hard-rule violation (UI drift, secrets, clickable external URLs, scope creep, dangerous patterns, bad deps/licenses, large binaries, writes outside `pocs/<JIRA-KEY>/`, and so on). Return to Developer or Planner. |
| 8 | Generate unit tests | Tester | Code + task checks | Vitest files in the POC | Tests cover the approved checks, not a generic template. |
| 9 | Execute unit tests | Tester + Hook | `vitest` in the POC directory | `docs/test-report.md` + Jira summary comment | **Hook: tests must pass before submit.** Fail → no push; comment the output. |
| 10 | Push / PR | Orchestrator | Passing tree | Commits on `poc/<JIRA-KEY>` + one GitHub PR | Push the full `pocs/<JIRA-KEY>/` tree (app + `docs/`). Create a PR only if none exists for this key. Never force-push. |

### Approval contract

- Ambiguity answers happen **before** the task list is finalized.
- Task-list approval happens **before** any POC app code is written.
- The agent posting “looks reasonable” is not approval.
- Only a **human** Jira comment (or Cursor `/irfp-approve`) counts. Ignore the automation account.
- Task-list approval is **`/approve`** only. **`/revise`** sends the Planner back to update `docs/task-plan.md` (and related docs) without generating code.
- Jira comments announce changes; **`pocs/<JIRA-KEY>/docs/` is the source of truth** for brief, plan, and logs.
- If a new ambiguity appears during coding, the Developer **stops and comments on Jira**. It does not decide locally.

## Skills and subagents

Skills are capabilities. Subagents own a stage. One subagent must not skip another’s gate.

| Skill | Used by | Does | Does not |
| --- | --- | --- | --- |
| Analyze RFP | RFP Analyst | Extract capabilities, UI requirements, UI direction, framework, constraints, blocking gaps; write `docs/rfp-brief.md` | Invent missing business rules; skip UI direction |
| Generate tasks | Requirements Planner | Produce ordered, checkable tasks; copy UI direction into `docs/technical-plan.md`; write `docs/task-plan.md`; post `TASK PLAN` on **Jira** | Start coding; re-infer a different visual tone |
| Frontend development | Developer | UI from approved tasks + brief UI requirements/direction | Restyle away from explicit specs; re-analyze the RFP; add screens for polish |
| Backend development | Developer | Server/local persistence the approved plan named | Add APIs the RFP did not need; call real internet services; put secrets in git |
| Code review | Reviewer | Diff vs RFP, rules, approved tasks, folder boundary | Approve the original task list |
| Unit test | Tester | Generate and run Vitest for the checks | Push on red tests |

### Subagent boundaries

Defined as Cursor project subagents in `.cursor/agents/`. The orchestrator launches them with Task; it does not do their jobs itself.

1. **RFP Analyst** (`rfp-analyst`) — read-only on the RFP. Output is a brief + gap list.
2. **Requirements Planner** (`requirements-planner`) — owns questions, technical plan, task list, and the approval gate.
3. **Developer** (`developer`) — implements only approved tasks under `pocs/<JIRA-KEY>/`. New gaps → comment on Jira and wait.
4. **Reviewer** (`reviewer`) — independent of the Developer. Can reject back to Developer or Planner. Cannot approve the original task list.
5. **Tester** (`tester`) — owns Vitest generation and execution. Cannot override a review failure.

## Runtime wiring

### Cursor Cloud Agent (Jira webhooks)

Needed tools on the automations:

- Jira MCP (fetch issue + download attachment + **comment**)
- Git checkout of this repo; create/push branch `poc/<KEY>`
- `gh` for one PR after Vitest

Automations:

1. **IRFP — Start on Jira Ready**
   - Event: webhook (Ready + RFP attachment)
   - Prompt: resolve issue key → fetch attachment → analyze → comment questions/plan on **Jira**
   - Do not write app code
2. **IRFP — Continue on Jira comment**
   - Event: comment added on the user story
   - Prompt: ignore the automation account and `**[IRFP POC Creator]**`; apply answers; update `pocs/<JIRA-KEY>/docs/`; on `/approve`, generate → review → Vitest → push / create PR once

Do **not** attach a “code pushed” trigger to the Start flow.

### Cursor slash commands (local / chat)

Same gates as Cloud Agent Continue. Type `/` in Cursor chat. Catalog: `docs/commands.md`.

The human who runs the command is the operator. Mirror comments to Jira when the issue key and MCP are available. Docs under `pocs/<KEY>/docs/` stay canonical.

### Cursor project hooks

| Hook intent | Event | Behaviour |
| --- | --- | --- |
| RFP exists before analyst | `subagentStart` | Deny if no `mark-rfp-fetched` stamp |
| TASK PLAN approved before Developer | Skills + `mark-approved` | Required before generate. Hook script exists but is **unregistered** in `hooks.json` for now. |
| Unit tests pass before submit | `beforeShellExecution` on `git commit` / `git push` | Deny unless Vitest passed; docs-only commits allowed |
| Protect orchestrator files | `preToolUse` / `afterFileEdit` | Deny writes outside `pocs/<JIRA-KEY>/` after generate phase |
| No external URLs in POC | `preToolUse` / `afterFileEdit` | Deny `http(s)` and `next/font/google` in POC UI/markdown |
| No secrets in POC | `preToolUse` / `afterFileEdit` / `beforeShellExecution` | Deny secret patterns; do not echo matches |

Named gates fail **closed** (missing proof = block). One-page notes: `docs/hooks/`. Branch test: `node scripts/hooks-selftest.mjs`.

### Jira MCP

Who, allowlist, errors, golden-path checklist: `docs/mcp.md`.

Must be able to:

- Resolve the issue from the key
- List attachments
- Download the chosen RFP file
- Comment on the issue (`addOrEditJiraIssueComment`)

If the attachment is not plain text (PDF, DOCX, and so on), the analyst still extracts description, capabilities, UI requirements, and UI direction. If it cannot read the file, it comments on Jira and stops.

## POC technical defaults

Apply when the RFP is silent. If the RFP names a different framework or UI kit, follow the RFP. All agents follow `AGENTS.md`.

- Next.js App Router + TypeScript at `pocs/<JIRA-KEY>/`.
- Demo UI wired to static or in-memory fake data by default.
- Route Handlers or Server Actions only when the approved plan requires server round-trips.
- Persistence: fixtures and in-memory state first; local JSON only if refresh must keep data; SQLite only if the RFP required it. Not a hosted database.
- No auth vendor unless the approved plan names one **and** it can run with fake/local users.
- UI follows the RFP spec; no extra component library unless the RFP or a human on the issue names one.
- Package installs via npm/pnpm are allowed. Runtime fetch of `https://` URLs in the UI is not.
- Fonts and images: files in the POC folder only. Product/cover photos: use typographic cover tiles (`TypographicCover`) unless the RFP supplies real image files — no decorative placeholder art (see `frontend-development` skill).
- Secrets: `.env.example` with empty placeholders only. No real `.env` values.
- Tests: Vitest, run from the POC directory before push.

## Repo layout

```text
/                                    orchestrator (Readme, agent config, hooks, automations)
/.cursor/                            project hooks, skills, agents, slash commands
/.cursor/commands/                   see `docs/commands.md`
/pocs/PROJ-123/                      generated app for that Jira key
/pocs/PROJ-123/docs/rfp-brief.md     extracted capabilities, UI requirements, UI direction, framework, non-goals
/pocs/PROJ-123/docs/ambiguity-log.md questions + human answers (updated as replies arrive)
/pocs/PROJ-123/docs/technical-plan.md stack, screens, routes, local data, Vitest checks
/pocs/PROJ-123/docs/task-plan.md     ordered task list (must match approved `/approve` comment)
/pocs/PROJ-123/docs/review-report.md pass/fail vs hard rules
/pocs/PROJ-123/docs/test-report.md   Vitest command, counts, failures
/pocs/PROJ-123/…                     app source + Vitest files
```

The Developer writes only under `pocs/<JIRA-KEY>/`. Merging a PR may leave that folder on `main`. A later run for another key uses a sibling folder.

## Artifacts each run must leave

**Canonical location:** every artifact below is a committed file under `pocs/<JIRA-KEY>/docs/`. Jira comments are summaries and gates only—they do not replace these files.

| File | Owner step | Contents |
| --- | --- | --- |
| `docs/rfp-brief.md` | Analyze RFP | Capabilities, UI requirements, UI direction, chosen framework, explicit non-goals |
| `docs/ambiguity-log.md` | Resolve ambiguities | Questions, human answers, timestamps |
| `docs/technical-plan.md` | Plan technical requirements | Stack, screens, local data, APIs |
| `docs/task-plan.md` | Generate tasks | Ordered task list + checks (must match the `/approve` comment) |
| `docs/review-report.md` | Code review | Pass/fail vs hard rules |
| `docs/test-report.md` | Execute unit tests | Vitest command, counts, failures |
| App + Vitest under `pocs/<JIRA-KEY>/` | Generate code / tests | POC source; pushed only after tests pass |

## In scope / out of scope

**In scope:** Jira Ready + RFP attachment → analyze → Jira-comment Q&A with a human → approve → generate under `pocs/<JIRA-KEY>/` → review → Vitest → push `poc/<JIRA-KEY>` and open **one** GitHub PR.

**Out of scope unless you add it:**

- Hosting or deploying the POC.
- E2E tests, visual regression, or production CI beyond Vitest.
- Rewriting the Jira story or the RFP.
- Opening a second PR for the same Jira key.
- Pixel-perfect recreation of an unspecified brand. Infer UI direction in the brief; implement it as a consistent demo theme, not a custom design-system product.
- Calling real third-party APIs that need live secrets.
- Clickable documentation or marketing URLs inside the POC.

## Failure behaviour

| Failure | Required behaviour |
| --- | --- |
| No Jira key in the webhook | Stop. Comment if a key can still be resolved. |
| Issue not found / Jira MCP fails | Stop. Comment the error without leaking secrets. |
| No RFP attachment | Stop. Hook blocks the analyst. |
| Several RFP attachments, none chosen | Comment the file list on Jira. Wait for a human. |
| Blocking ambiguity, no human reply | Do not generate tasks or code. |
| Task list not approved by a human | Do not generate code. |
| Review finds any hard-rule violation (UI drift, secrets, `http(s)` hrefs, scope creep, dangerous patterns, disallowed deps/licenses, large binaries, writes outside `pocs/<JIRA-KEY>/`, and so on) | Do not push. Comment findings on Jira. Return to Developer or Planner. |
| Vitest fails | Do not push. Comment the report on Jira. |
| RFP names a non-Next.js framework | Use that framework. Note it on Jira. Still apply rules 1–4, 6–15. |

## Comment protocol (locked)

**Jira comments** drive the conversation and gates. The agent **also commits** the matching markdown under `pocs/<JIRA-KEY>/docs/` at each step. Agent posts start with `**[IRFP POC Creator]**`.

| From | Text | Meaning | Agent action |
| --- | --- | --- | --- |
| Agent | numbered `Q1`, `Q2`, … | Blocking questions | Update `docs/ambiguity-log.md` |
| Human | `A1: …` or a threaded reply | Answer | Append to `docs/ambiguity-log.md`; revise plan files if needed |
| Agent | `TASK PLAN` + checklist | Waiting for approval | Ensure `docs/technical-plan.md` and `docs/task-plan.md` match the comment |
| Human | `/approve` | Permission to generate code | Proceed to Developer only after this exact token from a human |
| Human | `/revise` + notes | Change the plan; do not generate | Update `docs/task-plan.md` (and related docs); post revised `TASK PLAN`; wait for `/approve` |
| Automation account or `[IRFP POC Creator]` prefix | anything | Ignore for gates | No file or workflow changes |

## What we are not assuming

These are still allowed to change later; they are not blockers for the first build:

- Exact Cursor Cloud Agent model.
- Package manager (npm vs pnpm vs yarn) inside the generated POC — follow the RFP, else the template (`npm` in `templates/poc-next`).

Operator wiring (Jira MCP, Cloud Automations, identity gate): `docs/setup.md`.
