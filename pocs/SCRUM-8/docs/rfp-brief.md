# RFP brief

- Jira key: SCRUM-8
- Attachments used: RFP.html
- Extracted at: 2026-09-30

## Description

RecipieHub is a recipe-sharing website for home cooks. Cooks publish recipes (title, photo, servings, time, ingredients, numbered steps, optional free-text tags) and may edit their own work. Signed-in users follow cooks, see a home feed of recipes from followed cooks, search by title and ingredient, and receive email when a followed cook publishes. Anyone can open a recipe from a shared link without an account; publishing and following require an account. The product is not a restaurant directory or grocery shop. Every in-scope screen uses the **Harvest Table** presentation system: cream paper background, sage green for primary actions and follow, terracotta for highlights, ink-brown body text, serif titles; light theme only.

## Core capabilities

- Publish a recipe with title, photo, servings, time, ingredient list, numbered steps, and optional free-text tags (cook-defined, not a fixed taxonomy).
- Edit own recipes (author only).
- View recipe pages, including **cook-from** use of numbered steps.
- Open a recipe from a shared link without an account (read-only access to that recipe).
- Sign-in and accounts; account required to publish and to follow/unfollow a cook.
- Follow and unfollow a cook.
- Home feed of recipes from cooks the signed-in person follows.
- Cook profile showing that cook’s recipes and a follow control.
- Search by recipe title and by ingredient.
- Email notification when a followed cook publishes a new recipe.
- **Harvest Table** on sign-in, feed, recipe page, add-recipe form, and cook profile (cream paper, sage primary/follow, terracotta highlights, ink-brown body, serif titles; light theme only; no dark mode; no alternate theme).

## UI requirements

### Explicit

- Named design system: **Harvest Table** on every in-scope screen — cream paper background, sage green for primary actions and follow, terracotta for highlights, ink-brown body text, serif titles; light theme only; no dark mode; no second theme.
- In-scope screens named: sign-in, home feed, recipe page (cook-from), add-recipe form, cook profile.
- Recipe content fields on publish/view: title, photo, servings, time, ingredient list, numbered steps; optional free-text tags.
- Cook profile includes that cook’s recipes and a follow control.
- Social interaction limited to follow/unfollow (no comments in this engagement).

### Derived (from capabilities)

- **Sign-in screen** — entry for account-gated actions (publish, follow); maps to accounts capability.
- **Home feed** — scrollable list or grid of recipe entries from followed cooks with enough metadata to choose a recipe (title, cook, servings/time/tags as available); maps to home feed capability.
- **Recipe detail / cook-from layout** — prominent recipe title and metadata, ingredient list, numbered steps suitable for step-by-step cooking; photo display; maps to viewing recipes and cook-from capability.
- **Add / edit recipe form** — fields for title, photo, servings, time, ingredients, numbered steps, optional tags; author edit affordance on own recipes; maps to publish and edit capabilities.
- **Cook profile** — cook identity, follow/unfollow control, list of that cook’s recipes; maps to cook profile and follow capabilities.
- **Search UI** — query by title and by ingredient (mode or fields as implied by dual search capability); results leading to recipe pages.
- **Follow / unfollow affordances** — sage-styled primary/follow actions per Harvest Table; on profile and wherever follow state is shown.
- **Guest recipe view** — recipe page reachable without sign-in when opened from a shared link; no publish/follow without account.
- **Email notification** — not a screen; POC may surface a demo stub or log for “new recipe from followed cook” per email capability.

## UI direction

- Source: explicit (Harvest Table) + inferred composition (Sunday Supper Spread — see design brief)
- Tone: Approachable, Editorial
- Context: Consumer-facing recipe-sharing for home cooks and their followers; warm, durable “recipe at home” feel rather than enterprise or marketplace chrome.
- Density: moderate
- Demo quality: modern, demo-impressive-within-restraint
- Notes: Recipe **cook-from** layout uses a two-zone editorial composition — ingredients and metadata in a supporting column, numbered steps in a primary reading column with a **terracotta step rail** (vertical progress marker tied to step numbers). Signature: the step rail on the cook-from recipe page, not a generic card grid. Restraint: Harvest Table tokens only; typographic covers for recipe photos when no upload files exist; no stock food photography, dark mode, or extra social features.
- Design brief: `docs/ui-design-brief.md`

## Framework

Silent — default Next.js App Router + TypeScript.

## Non-goals

- Restaurant directory or grocery shop.
- Comments on recipes.
- Selling ingredients, meal plans, shopping lists tied to supermarkets.
- Video cooking lessons.
- Paying to boost a cook in the feed.
- Dark mode or a second theme (cook-selectable or otherwise).
- In-app alerts (email only for new recipes from followed cooks).

## Blocking gaps

- **Sign-in / account mechanism** — RFP requires sign-in and accounts but does not name authentication method (e.g. email/password, magic link, OAuth). Planner should confirm POC stub vs. specific flow.
- **Recipe photo source** — RFP requires a photo on recipes but does not specify upload constraints or storage; POC should use honest typographic/upload demo per IRFP media rules once confirmed.

Missing visual branding is **not** blocking — Harvest Table and `ui-design-brief.md` define presentation.

## Sensitive data

RFP describes home cooks and email notifications; do not use real emails, phone numbers, or identifiable people in fixtures. Use fictional cooks and recipes only.
