# Test report

- Jira key: SCRUM-12
- Command: `cd pocs/SCRUM-12 && npm test` (runs `vitest run`)
- Result: pass
- Counts: 1 test file, 16 tests passed, 0 failed

## Coverage vs task plan

| Task check | Test area |
| --- | --- |
| 1 Harvest Table tokens vs scaffold | `Harvest Table theme` |
| 3 Fixture required fields | `fixtures and loader` |
| 4 Auth for publish/follow | `demo auth` |
| 5 Home signature markers | `Harvest Table theme` (signature) |
| 6 Register/sign-in | `demo auth` |
| 7 Feed follows filter | `home feed` |
| 8 Ingredients/steps | `recipe content` |
| 9 Recipe form fields | `recipe forms` |
| 10 Author-only edit | `author-only edit` |
| 11 Unfollow removes from feed | `follow and feed` |
| 12 Search title/ingredient/tag | `search` |
| 13 Share minimal shell | `public share route contract` |
| 14 Email on publish | `publish email demo log` |

Task 2 (`npm run build`) is a build gate; review confirmed build success. Task 15 suite green.

## Failures

None.

## Gate

`node scripts/irfp.mjs mark-vitest --key SCRUM-12 --passed true --command "cd pocs/SCRUM-12 && npm test"`
