# Ready for POC automation (operator + Cloud Agent delivery)

Single Cloud automation on Jira status **Ready for POC**. There is no separate Continue automation or comment-created webhook.

**Instructions to paste into Cursor:** copy the full body of [`automations/start.md`](../automations/start.md) into the **IRFP — Ready for POC** automation. Workflow steps live in [`.cursor/skills/irfp-orchestrator/SKILL.md`](../.cursor/skills/irfp-orchestrator/SKILL.md) — not in this file.

Operator checklist: [`docs/setup.md`](setup.md) §3. Catalog: [`automations/README.md`](../automations/README.md).

## Tools to enable (Cursor automation UI)

| Tool | Ready for POC automation |
| --- | --- |
| **Atlassian** | Required — Jira read, attachments, `addOrEditJiraIssueComment`, transitions to **In Review**. |
| **Open Pull Request** | Required after `/approve` — publish `poc/<KEY>` and open **one** PR per Jira key when shell `gh` is not authenticated. |
| **Comment on Pull Request** | Optional — IRFP summaries still go to **Jira** only; do not use PR comments for `/approve` or Q1. |
| **Memories** | Optional — do not store pipeline state (`qaLoopCount`) here. |

Repo must be **IRFPPOCCreator** with GitHub **write** on the automation.

## Durable state

- Commit and push `pocs/<KEY>/docs/run-state.json` on `poc/<KEY>` after every Q&A round and after `mark-*` that must survive the next Cloud clone.
- RFP binaries stay in gitignored `pocs/<KEY>/.run/rfp/`.

## Cloud Agent delivery

Use this **with** orchestrator **Generate after `/approve`** in `.cursor/skills/irfp-orchestrator/SKILL.md`. Never skip developer/reviewer/tester when the app is not built and `vitestPassed` is false.

**Never skip code generation because push or `gh` might fail.** Run GitHub delivery only after the POC exists, Vitest is green, and you have committed on `poc/<KEY>`—except **resume** below.

### Resume (delivery-only retry)

After `node scripts/irfp.mjs mark-approved --key <KEY>`, `git fetch`, checkout `poc/<KEY>`, and `node scripts/irfp.mjs status --key <KEY>`:

- If `vitestPassed` is true and `pocs/<KEY>/` has a full app (`package.json`, `app/`, tests), **skip** generate/review/test and go to **Delivery** below.

### Generate (when not resuming)

Follow the skill: developer → reviewer → tester → `mark-vitest --passed true` → commit all of `pocs/<KEY>/` on `poc/<KEY>`. Never `--force`.

### Delivery (required when generate finished or resume applies)

You must get commits onto GitHub and ensure **one open PR** per Jira key. Do not stop after Jira comments until delivery succeeded or you reported a concrete error.

Branch: `poc/<KEY>` (or `state.branch`). Base: `main`.

**A. Prefer Cursor GitHub tools (when enabled on this automation)**

1. Check for an existing open PR for this key (`gh pr list`, `state.prNumber`, or GitHub UI).
2. If **no** open PR: use **Open Pull Request** with head `poc/<KEY>`, base `main`, title containing `<KEY>` (e.g. `<KEY> — IRFP POC`), body with Jira summary + Vitest passed (plain text, no clickable `http(s)` URLs).
3. If a PR **already** exists: push/update that head branch only; never open a **second** PR for the same key.
4. `node scripts/irfp.mjs mark-pr-linked --key <KEY> --number <N> --branch poc/<KEY>`.

**B. Fallback (shell)**

If **Open Pull Request** is unavailable or fails: `gh auth setup-git` when `gh` is authenticated, then `git push -u origin poc/<KEY>`, then `gh pr create` once (same title/body rules as the skill).

**If all delivery paths fail:** Keep local commits and app code. Comment on **Jira** (prefix `**[IRFP POC Creator]**`): Vitest status, branch, short SHA, error summary. Ask the operator to enable **Open Pull Request** and repo write, then comment **`/approve` again** and move status to **Ready for POC** when `vitestPassed` is true.

**Success Jira line (no `http(s)`):** `GitHub PR #N on branch poc/KEY`.

### Forbidden

- Skipping developer/reviewer/tester on `/approve` when the app is not built and `vitestPassed` is false.
- Checking `gh auth` or pushing **before** generate completes (unless resume applies).
- Ending the run with “done” when `pocs/<KEY>/` has only `docs/` and no app.
- Force-push; second PR for the same key.
- Treating a git push webhook or comment-created webhook as the primary Cloud trigger.
