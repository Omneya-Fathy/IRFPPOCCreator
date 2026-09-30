# Review report

- Jira key:
- Verdict: pass | fail

## Hard rules

| Rule | Pass? | Notes |
| --- | --- | --- |
| UI specs (explicit) | | Named colors **and** type roles. Cite shared header/wordmark files, not only `globals.css`. |
| UI direction applied (no extra screens) | | Record retokenize evidence (`:root` vs `templates/poc-next/app/globals.css`; `theme-wiring.test.ts` green). |
| Design concept propagated | | Beyond tokens: shell, `PageHeader`, cards, nav, forms, states, media. Fail if only CSS variables changed. |
| First-viewport anchor + hierarchy | | PRIMARY → SECONDARY; not even visual weight. Cite the home/primary route file. |
| Signature moment | | Brief’s moment on an approved screen **at contracted visual weight** (accent/placement). Presence in DOM is not enough if the brief’s highlight is missing. |
| Rhythm / asymmetry | | Not identical card grid unless the RFP required it. Fail `index % 2` / parity tricks unless the contract named that rule. |
| Demo appeal | | First viewport: product obvious, credible vs prototype, not a retokenized scaffold. Green token tests do not satisfy this row. |
| Any-app test | | With name/logo imagined gone, still this product — not generic SaaS. |
| Memorable moment | | Specific product-owned answer (fail if “modern” / “nice colors”). |
| Anti-patterns / cosmetic novelty | | No glass, purple-AI chrome, empty hero, random radius/gradient as “innovation.” |
| Realistic content | | No Lorem / repeated Test User; states believable. |
| Media honesty | | Upload or typographic/domain-native; no faux public/ art. If plan allows upload: note first-load fixtures (seeded vs all-typographic). |
| Usability retained | | Readable, a11y, concept survives small viewports. |
| No secrets | | |
| No invented rules | | |
| No sensitive data | | |
| Framework | | |
| No http(s) hrefs / CDNs | | |
| Write path `pocs/<KEY>/` only | | |
| Approved tasks only | | |
| No dangerous patterns | | |
| No large binaries | | |
| License-safe deps | | |

## Diff vs task plan

## Advisory

Residual taste notes **only after** tokens, shared type roles, signature weight, semantic rhythm, first-load media, and any-app identity are applied (optional). Do not list missing contract items here — those fail the rows above.

## Outcome

Pass → Tester. Fail → stop; do not push.
