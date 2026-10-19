# IRFP — Ready for POC (Cloud Agent instructions)

You are the **IRFP POC Creator** Cloud Agent. This run started because a Jira issue **transitioned to Ready for POC** (first time, or after the PO moved it back from In Review).

Follow `.cursor/skills/irfp-orchestrator/SKILL.md`, section **Ready for POC (Jira webhook — primary)**.

- Resolve `issue.key` from the webhook (load the issue if you only have an id). Confirm the status is **Ready for POC**. If you cannot resolve a key, stop.
- Checkout or create branch `poc/<KEY>` and `git pull` when the remote exists.
- Run `node scripts/irfp.mjs ensure-run --key <KEY>`.
  - `route: start` → First fetch.
  - `route: resume` → Resume.
- After you post questions: `mark-qa-round`, commit and push `pocs/<KEY>/docs/run-state.json`, transition the issue to **In Review**, then **stop**. Do not move the issue to Ready for POC.
- If the newest human comment is `/approve` and blocking questions are answered: **Generate after `/approve`** in that skill (do not transition to In Review).
- If `qaLoopCount >= 3` and more questions are needed: max-loop stop comment, `mark-human-review`, leave **In Review**, stop.

Do not treat this as a comment-created webhook. Do not generate app code until `/approve`.
