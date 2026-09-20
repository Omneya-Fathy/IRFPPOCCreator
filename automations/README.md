# Cursor Cloud Agent setup

Create **two** automations on this GitHub repository. Do not combine them. Do not trigger on push.

| Name | Event | Ignore drafts | Tools | Instructions |
| --- | --- | --- | --- | --- |
| IRFP — Start on PR open | Pull request opened | Yes | PR comments, Jira MCP | `automations/start.md` |
| IRFP — Continue on PR comment | Comment added on a pull request | n/a | PR comments, Jira MCP | `automations/continue.md` |

Repo: `Omneya-Fathy/IRFPPOCCreator` (this repository).

Connect Jira MCP so the agent can list and download issue attachments.

Paste the markdown bodies from `start.md` and `continue.md` into the automation prompts.

Full operator checklist: `docs/setup.md`.
