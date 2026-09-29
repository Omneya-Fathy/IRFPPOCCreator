# Cursor Cloud Agent setup

Create **two** automations on this repository. Do not combine them. Do not trigger on git push.

| Name | Event | Ignore drafts | Tools | Instructions |
| --- | --- | --- | --- | --- |
| IRFP — Start on Jira Ready | Webhook: story status → Ready **and** attachment named RFP | n/a | Jira MCP (read + comment), git/gh | `automations/start.md` |
| IRFP — Continue on Jira comment | Webhook: comment added on the user story | n/a | Jira MCP (read + comment), git/gh | `automations/continue.md` |

Repo: `Omneya-Fathy/IRFPPOCCreator` (this repository).

Connect Jira MCP so the agent can list and download issue attachments and **write comments** (`addOrEditJiraIssueComment`).

Paste the markdown bodies from `start.md` and `continue.md` into the automation prompts.

Full operator checklist: `docs/setup.md`.
