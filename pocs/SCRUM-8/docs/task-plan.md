# Task plan

Human commented `/approve` on Jira 2026-09-30. **Do not re-post** `TASK PLAN` to Jira for this revision; checklist below is the source of truth for Developer / Reviewer / Tester.

- Jira key: SCRUM-8
- Status: approved

**Decisions locked:** **A1** no mandatory sign-in; default demo actor for feed, publish, follow; optional `/sign-in` persona switch. **A2** file upload on add/edit → in-memory `photoDataUrl`; typographic fallback when no image.

## TASK PLAN

1. [ ] Map brief UI direction and **Sunday Supper Spread** design contract onto scaffold tokens (`app/globals.css` `:root`) and layout shell (Harvest Table: cream paper, sage primary/follow, terracotta highlights, ink-brown body, serif titles)—check: Vitest asserts primary/muted/card CSS variables **differ from scaffold defaults** and match expected Harvest Table map; `app/layout.tsx` imports `./globals.css`; no Tailwind reinstall.
2. [ ] Scaffold POC app from `templates/poc-next` if missing (`scaffold-poc`)—check: `npm run build` succeeds in `pocs/SCRUM-8/`.
3. [ ] Add fictional cooks and recipes fixtures (realistic titles, ingredients 8–12, steps 5–8, optional tags; no `Lorem` / “Test User”) plus in-memory store module—check: loader returns expected cooks/recipes and required fields.
4. [ ] Implement **default demo actor** and active-actor context (**A1**): feed, publish, follow, and edit use this actor without mandatory login—check: Vitest confirms default actor id set and feed/publish helpers work with no `/sign-in` visit.
5. [ ] Optional `/sign-in` dummy persona switch (**A1**): form or list to change active demo actor for attribution—check: Vitest or store test that switching actor changes `authorId` on new recipe or follow state.
6. [ ] App shell: top nav (RecipieHub serif wordmark, search entry, sign-in/account label for active actor)—check: layout renders on `/` with Harvest Table styling.
7. [ ] Home feed `/`: recipes from followed cooks for active actor; alternating **large typographic cover card → compact row** rhythm—check: feed renders multiple cards; at least one cover-led and one compact variant from fixtures.
8. [ ] Search `/search`: query by title and by ingredient—check: Vitest title match and ingredient match; results link to recipe ids.
9. [ ] `TypographicCover` component (title + subtitle from servings/time or cook)—check: Vitest renders expected text when no `photoDataUrl`.
10. [ ] Add recipe `/recipes/new` and edit `/recipes/[id]/edit`: all fields, **file input** → `photoDataUrl` in store (**A2**); sage submit; no login gate—check: Vitest recipe without upload uses typographic path; with mocked data URL stores and displays image.
11. [ ] Cook-from recipe page `/recipes/[id]`: two-zone layout (ingredients/metadata column + steps column), **terracotta step rail** with active step highlight, photo or `TypographicCover` (**A2**); guest-readable—check: Vitest step list + rail marker present; image vs typographic branch.
12. [ ] Author-only edit affordance on recipe page when `authorId` matches active actor—check: Vitest denies edit link for non-author fixture.
13. [ ] Cook profile `/cooks/[id]`: cook header, sage follow/unfollow (**A1**), recipe list with typographic/upload thumbnails—check: follow toggle updates store; feed reflects follow change.
14. [ ] Email notification **demo stub** when a followed cook publishes (in-memory log/banner; fictional names only)—check: Vitest appends notification record on publish when follower relationship exists.
15. [ ] Responsive: cook-from stacks below `md` with rail as left border or inline terracotta per step—check: Reviewer documents in `review-report.md` if not unit-testable; optional Vitest on responsive class hooks.
16. [ ] Final visual QA (Reviewer): **Demo appeal**, **Hierarchy**, **Memorable moment** (step rail), **Any-app test** per `ui-design-brief.md` acceptance tests—check: documented in `review-report.md`.
17. [ ] Vitest suite for all checks above; `npm test` green—check: `mark-vitest` eligible after review pass.

## Out of scope

Do not implement anything not listed above or marked non-goals in `rfp-brief.md` (restaurant/grocery directory, comments, video lessons, paid boost, dark mode, in-app alerts, real SMTP/OAuth, mandatory login gate, committed stock food assets under `public/`, persistence beyond in-memory POC store).
