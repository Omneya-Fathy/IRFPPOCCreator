# Policy hooks

Lightweight fail-closed checks. Policy only — no embedded secrets, no network.

| Hook | Forgets | Note | Registered |
| --- | --- | --- | --- |
| `rfp-before-analyst` | Analyzing without an RFP | [rfp-before-analyst.md](./rfp-before-analyst.md) | yes |
| `approve-before-developer` | Generating before `/approve` | [approve-before-developer.md](./approve-before-developer.md) | **no** (unregistered in `hooks.json` for now) |
| `vitest-before-submit` | Pushing on red tests | [vitest-before-submit.md](./vitest-before-submit.md) | yes |
| `protect-orchestrator` | Editing orchestrator files mid-generate | [protect-orchestrator.md](./protect-orchestrator.md) | yes |
| `no-external-urls` | Clickable `http(s)` in the POC | [no-external-urls.md](./no-external-urls.md) | yes |
| `no-secrets-in-poc` | Keys/tokens in fixtures or `.env` | [no-secrets-in-poc.md](./no-secrets-in-poc.md) | yes |

Test on a branch: `node scripts/hooks-selftest.mjs`
