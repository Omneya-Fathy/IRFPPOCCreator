# Task plan

Comment this same checklist on the PR as `TASK PLAN`. Wait for the PR author to comment `/approve` or run `/irfp-approve` **after** `A1`–`A6` are answered.

- Jira key: SCRUM-9
- Status: waiting-for-approve

**Blocking:** Q1–Q6 open in `ambiguity-log.md`. Task checks reference **A1–A6**; lock decisions in `technical-plan.md` when answered, then PR author may `/approve`.

## TASK PLAN

1. [ ] Map brief **Harvest Table** UI direction onto scaffold tokens (`app/globals.css` `:root`) and layout shell (Approachable + Premium, moderate density)—check: Vitest asserts primary/muted/card (and sage/terracotta/cream/ink cues) **differ from scaffold defaults** and match expected token map; no Tailwind reinstall.
2. [ ] Scaffold POC app from `templates/poc-next` if missing (`scaffold-poc`)—check: `npm run build` succeeds in `pocs/SCRUM-9/`.
3. [ ] Fictional fixtures: cooks, recipes (title, servings, time, ingredients, numbered steps, optional tags), follow relationships, and notification log seed—check: fixture loader returns required fields and at least two cooks with multiple recipes.
4. [ ] In-memory session + fake auth per **A2** (sign-in, register, sign-out)—check: Vitest confirms publish and follow actions fail without session; succeed after sign-in with demo credentials.
5. [ ] Harvest Table **sign-in** and **register** routes (`/sign-in`, `/register`)—check: pages render; registration collects fields defined in **A2** only.
6. [ ] App shell: cream paper shell, serif titles, sage primary actions, terracotta highlights; nav to home, search, add-recipe when signed in, sign-out—check: shell present on all in-scope routes; no sixth marketing screen.
7. [ ] Home feed `/` showing followed cooks’ recipes (cards or rows)—check: feed excludes non-followed authors; ordering stable for demo (e.g. newest first).
8. [ ] Empty home feed behavior per **A6**—check: Vitest or render test matches PR-author rule (empty state copy, seeded follows, etc.).
9. [ ] Search `/search?q=` across title, ingredient, and tags—check: Vitest cases for each match type; signed-out access matches **A1**.
10. [ ] Cook profile `/cooks/[id]` with recipe list and follow/unfollow control—check: toggle updates follow state; **A5** (self-follow, counts) enforced; anonymous profile access per **A1**.
11. [ ] Recipe page `/recipes/[id]` cooking-from layout (meta, ingredients, numbered steps as first-viewport focal point)—check: structure matches UI direction Notes signature pattern; terracotta section accents where specified.
12. [ ] Shared recipe link: same URL viewable without sign-in—check: Vitest confirms unsigned read on recipe route; copy/share affordance on page for signed-in author.
13. [ ] Add-recipe `/recipes/new` (title, photo, servings, time, ingredients, numbered steps, optional tags)—check: **A3** required/optional photo behavior; placeholder tile when no photo.
14. [ ] Author edit flow per **A4**—check: only recipe author sees edit entry; update persists in memory and reflects on profile and feed.
15. [ ] Simulated email notifications on publish: in-memory log per follower—check: Vitest asserts one simulated notification per follower when author publishes; no SMTP calls.
16. [ ] Vitest suite for all checks above; **Demo appeal** and **Hierarchy** documented in `review-report.md` if not unit-testable—check: `npm test` green; `mark-vitest` eligible after review pass.

## Out of scope

Do not implement anything not listed above or marked non-goals in `rfp-brief.md` (comments, meal plans, video, ingredient sales, paid feed boost, in-app alerts, dark/alternate themes, restaurant/grocery positioning, self-build platform, real SMTP).
