# RFP brief

- Jira key: SCRUM-9
- Attachments used: RecipieHub-RFP.html (primary), RecipieHub-RFP.docx (cross-check)
- Extracted at: 2026-09-29

## Description

RecipieHub is a consumer website where home cooks publish recipes and other users follow cooks they trust. Accounts are required to publish recipes and to follow a cook; a visitor without an account may open a shared recipe link to read that recipe without signing in. The home feed surfaces recipes from followed cooks. Search spans recipe titles, ingredients, and optional cook-entered tags. Email notifies followers when a followed cook publishes a new recipe. All in-scope screens use the named **Harvest Table** visual theme (light, cookbook-style). The engagement delivers the full website—not a self-build platform—and excludes restaurant/grocery features, comments, meal plans, paid feed boosts, in-app alerts, and dark or alternate themes.

## Core capabilities

- User registration and sign-in (required to publish a recipe and to follow a cook)
- Recipe creation, editing, and viewing by the author; recipe fields: title, photo, servings, time, ingredient list, numbered steps
- Recipe page designed for cooking from (signed-in viewing and via shared link)
- Shared recipe link allowing public recipe viewing without sign-in
- Cook profiles showing that cook’s recipes, with follow and unfollow control on the profile
- Home feed of recipes from followed cooks
- Search by recipe title, by ingredient, and by optional free-text tags entered by the cook
- Email notification when a followed cook publishes a new recipe (email is the sole in-scope notification channel)
- **Harvest Table** UI theme on every in-scope screen: sign-in, home feed, recipe page, add-recipe form, and cook profile—cream paper background, sage green for primary actions and follow, terracotta for highlights, ink-brown body text, serif titles; light theme only

## UI requirements

### Explicit

- In-scope screens (named): sign-in; home feed; recipe page; add-recipe form; cook profile
- **Harvest Table** theme on all in-scope screens: cream paper background; sage green for primary actions and follow; terracotta for highlights; ink-brown body text; serif titles; light, cookbook-style presentation
- No dark mode and no alternate theme for users to choose
- Follow control on the cook profile
- Recipe page oriented toward cooking from (layout/copy implied by capability, not wireframed)
- Phase 1 reference: wireframes or equivalent with Harvest Table applied to every in-scope screen listed above

### Derived (from capabilities)

- Registration flow UI (capability: user registration and sign-in)—paired with sign-in screen
- Sign-out or session affordance for signed-in users (capability: sign-in and accounts)
- Add-recipe / edit-recipe form with fields for title, photo, servings, time, ingredient list, numbered steps, and optional tags (capabilities: recipe creation/editing; optional tags; author edits own recipes)
- Author-only edit entry for their recipes (capability: author edits their own recipes)
- Mechanism to copy or share a recipe link for public viewing (capability: shared recipe link)
- Feed cards or list rows showing followed cooks’ recipes (capability: home feed)
- Search input and results presentation covering title, ingredient, and tag matches (capability: search and discovery)
- Follow/unfollow state indicators beyond the profile (e.g. on feed or search) where follow actions are implied—primary control remains on cook profile per RFP
- Empty or onboarding states when the feed has no followed cooks yet (capability: home feed of followed cooks)—behavior not specified in RFP
- Email notification is backend/channel capability; POC may surface a non-production stub or settings placeholder only if the approved plan requires visible acknowledgment—not a separate marketing screen in the RFP

## UI direction

- Source: explicit
- Tone: Approachable, Premium (Harvest Table cookbook aesthetic for consumer home cooks)
- Context: Consumer recipe-sharing website for home cooks and followers; warm trusted-cook discovery rather than enterprise tooling.
- Density: moderate
- Demo quality: modern, demo-impressive-within-restraint
- Notes: Persistent light shell on cream paper with serif display titles and sage primary actions; recipe detail uses a document-centric column (title, meta, ingredients, numbered steps) as the first-viewport focal point for cooking-from. Signature: terracotta accent on key highlights (e.g. follow state, section labels) with sage green primary buttons—not a generic SaaS blue palette. Restraint: no dark mode, no alternate theme, no stock hero photography required—use placeholder or simple recipe photo treatment; no extra chrome beyond the five in-scope screens plus minimal auth/registration affordances derived from capabilities.

## Framework

Silent — default Next.js App Router + TypeScript

## Non-goals

- Comments on recipes
- Selling ingredients or supermarket-linked shopping lists
- Meal plans
- Video cooking lessons or other video features
- Paying to boost a cook in the feed
- In-app alerts (email only for new-recipe notifications in scope)
- Dark mode or an alternate user-selectable theme
- Restaurant directory or grocery shop positioning
- Self-build platform where cooks assemble the site themselves
- Future-scope items listed in the RFP (meal plans, shopping lists, video, in-app alerts, ingredient sales, paid boost, themes)—not part of this engagement

## Blocking gaps

- **Anonymous access vs search and profiles**: Public viewing without sign-in is explicitly limited to opening a shared recipe link. Unclear whether signed-out users may use search, browse discovery results, or view cook profiles without an account.
- **Registration and sign-in details**: Accounts are required for publish and follow, but the RFP does not specify registration fields, email verification, password rules, or sign-in method—needed to implement auth flows consistently.
- **Recipe photo rules**: Photo is listed as a recipe field; unclear whether a photo is required to publish, acceptable formats, or placeholder behavior when omitted.
- **Author edit flow**: Editing is in scope, but the RFP names an add-recipe form screen without a separate edit screen—unclear whether edit reuses that form, inline edit on the recipe page, or another entry point.
- **Follow edge cases**: Not stated whether a cook can follow themselves, unfollow behavior on empty feed, or visibility of follow counts.

## Sensitive data

The RFP contains no real customer records, credentials, or live personal data—only product description and requirements. The POC must use fictional cooks, recipes, and email addresses only.
