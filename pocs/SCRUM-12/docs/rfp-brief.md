# RFP brief

- Jira key: SCRUM-12
- Attachments used: RecipieHub-RFP.docx
- Extracted at: 2026-09-29

## Description

RecipieHub is a website where home cooks publish their own recipes and other people follow the cooks they trust. Accounts are required to publish a recipe and to follow a cook; someone without an account can open a shared recipe link to read that recipe without signing in. The home feed shows recipes from followed cooks. Search covers recipe titles, ingredients, and optional tags entered by the cook. Email notifies followers when a followed cook publishes a new recipe. The product is explicitly not a restaurant directory, grocery shop, or self-build platform for cooks to assemble themselves.

## Core capabilities

- User registration and sign-in (accounts required to publish and to follow).
- Recipe creation, editing, and viewing; authors edit their own recipes.
- Recipe fields: title, photo, servings, time, ingredient list, and numbered steps.
- Recipe page designed for cooking from.
- Cook profiles showing that cook's recipes, with follow and unfollow control on the profile.
- Home feed of recipes from followed cooks.
- Search by recipe title, by ingredient, and by optional free-text tags typed by the cook.
- Shared recipe link so someone without an account can read that recipe without signing in.
- Email notification when a followed cook publishes a new recipe (email is the notification channel; in-app alerts are out of scope).
- Harvest Table visual theme on every in-scope screen (light theme only).

## UI requirements

### Explicit

- In-scope screens named in the RFP: sign-in, home feed, recipe page, add-recipe form, and cook profile (wireframes or equivalent expected in discovery; screens are named for implementation).
- Harvest Table UI theme on all in-scope screens: cream paper background, sage green for primary actions and follow, terracotta for highlights, ink-brown body text, serif titles; light, cookbook-style presentation.
- Light theme only; no dark mode; no alternate theme for cooks to choose.
- Follow control on the cook profile (explicit placement).
- Recipe page oriented toward cooking from the published content.

### Derived (from capabilities)

- Registration flow alongside sign-in (capability: user registration and sign-in).
- Add-recipe and edit-recipe form with fields for title, photo, servings, time, ingredient list, and numbered steps (capability: recipe creation, editing, and field list).
- Recipe detail view reachable when signed in and via shared public link without sign-in (capability: recipe viewing and shared recipe link).
- Cook profile recipe list/grid for that cook's published recipes (capability: cook profiles showing that cook's recipes).
- Follow and unfollow affordance reflected in feed or profile state after use on profile (capability: follow and unfollow a cook).
- Home feed list or cards of recipes from followed cooks only (capability: home feed).
- Search entry and results across title, ingredient, and optional tags (capability: search and discovery).
- Primary actions and follow actions styled per Harvest Table sage green (capability: Harvest Table theme and follow control).
- Public shared-link recipe layout without account chrome where appropriate (capability: public recipe viewing without sign-in).

## UI direction

- Source: explicit
- Tone: Approachable, Premium (cookbook editorial)
- Context: Consumer-facing recipe-sharing website for home cooks and followers who want trusted, durable recipes rather than transient group-chat shares; light, cookbook-style presentation throughout.
- Density: moderate
- Demo quality: modern, demo-impressive-within-restraint
- Notes: Persistent light shell with cream paper background; each in-scope screen leads with content-first layout (feed cards, recipe steps, or profile recipe grid) rather than marketing hero blocks. Signature: serif display titles on recipe and profile headers with sage green primary/follow buttons and terracotta accent highlights on key metadata (time, servings). Restraint: Harvest Table palette only—no dark mode, no second theme, no fake stock lifestyle photography beyond a single recipe photo field; keep ink-brown body text readable and uncluttered.

## Framework

Silent — default Next.js App Router + TypeScript

## Non-goals

- Comments on a recipe.
- Selling ingredients.
- Meal plans.
- Shopping list tied to a supermarket.
- Video cooking lessons or other video features.
- Paying to boost a cook in the feed.
- Dark mode or an alternate theme.
- In-app alerts (email is the notification channel for this engagement).
- Restaurant directory or grocery-shop positioning; not a self-build platform for cooks.

## Blocking gaps

None identified. Capabilities, account rules, public shared-link viewing, notification channel (email), and visual theme are stated consistently. Future-scope items are explicitly excluded.

## Sensitive data

The RFP describes home cooks, followers, recipes, and email notifications in generic terms. Do not use real people, emails, or personal recipe content in the POC; use fictional cooks, followers, and sample recipes only.
