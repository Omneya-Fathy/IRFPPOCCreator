# Task plan

Comment this same checklist on the Jira issue as `TASK PLAN`. Wait for a human to comment `/approve` or run `/irfp-approve`.

- Jira key: SCRUM-12
- Status: waiting-for-approve

**POC defaults:** Pending Q1 confirmation (demo auth, email log, typographic recipe photo, `/share/[id]` public route). Plan assumes acceptance unless operator revises via A1 or `/revise`.

## TASK PLAN

1. [ ] Map brief UI direction onto scaffold tokens (`app/globals.css` `:root`) and layout shell (Approachable + Premium cookbook editorial, moderate density, Harvest Table palette)—check: Vitest asserts primary/muted/card (and accent) CSS variables **differ from scaffold defaults** and match cream/sage/terracotta/ink-brown intent; no Tailwind reinstall.
2. [ ] Scaffold POC app from `templates/poc-next` if missing (`scaffold-poc`)—check: `npm run build` succeeds in `pocs/SCRUM-12/`.
3. [ ] Add fictional cooks, recipes, tags, and follow relationships as fixtures plus in-memory store—check: fixture loader returns required fields (title, servings, time, ingredients, steps, tags, author id).
4. [ ] Implement demo registration and sign-in (in-memory session; fictional emails only)—check: Vitest confirms publish and follow actions require signed-in user.
5. [ ] Harvest Table app shell: cream paper background, ink-brown body, nav to feed, search, add recipe, profile/sign-in—check: primary route implements Notes **signature pattern** (serif display titles, sage primary actions, terracotta metadata accents).
6. [ ] `/sign-in` registration and sign-in UI—check: new demo cook can register and sign in; redirects to feed or prior intent.
7. [ ] `/` home feed: cards/list of recipes from **followed cooks only**—check: Vitest feed filter excludes recipes from cooks the user does not follow.
8. [ ] `/recipes/[id]` recipe page oriented for cooking (ingredients + numbered steps, servings/time with terracotta accent metadata)—check: step list and ingredients render from fixture; typographic cover for photo field.
9. [ ] `/recipes/new` add-recipe form with all RFP fields—check: Vitest or component test validates required fields present in submitted recipe object.
10. [ ] `/recipes/[id]/edit` edit own recipe only—check: Vitest rejects edit when current user is not author.
11. [ ] `/cooks/[id]` cook profile with recipe grid and sage green follow/unfollow control on profile—check: follow toggles in-memory state; unfollow removes author recipes from feed filter.
12. [ ] `/search?q=` search across title, ingredient, and optional tags—check: Vitest cases for title match, ingredient match, and tag match.
13. [ ] `/share/[id]` public shared recipe view without signed-in account chrome—check: route renders recipe content; Vitest or route test confirms minimal shell (no feed nav) and access without session.
14. [ ] On publish, demo “email notified followers” affordance (fictional follower emails; no SMTP)—check: Vitest asserts notification list updates when followed cook publishes.
15. [ ] Vitest suite for all checks above; `npm test` green—check: `mark-vitest` eligible after review pass.

## Out of scope

Do not implement anything not listed above or marked non-goals in `rfp-brief.md` (comments, selling ingredients, meal plans, supermarket shopping list, video lessons, paid feed boost, dark mode, in-app alerts, restaurant/grocery directory, self-build platform for cooks, real SMTP, real auth provider, image upload CDN, stock lifestyle photography).
