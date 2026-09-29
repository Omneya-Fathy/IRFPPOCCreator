# Technical plan

- Jira key: SCRUM-9
- Stack (RFP named / Next.js default / PR-author override): RFP silent — **Next.js App Router + TypeScript**, demo UI, static fixtures + in-memory session/state (no real SMTP, no production auth).

## Resolved business rules (pending A1–A6)

Blocking answers will be recorded here after PR-author `A1`–`A6` (see `ambiguity-log.md`). The task plan checks reference these IDs; do not implement conflicting behavior before answers land.

| ID | Topic | Status |
| --- | --- | --- |
| **A1** | Signed-out access to search, cook profiles, and discovery vs shared-recipe-link only | pending |
| **A2** | Registration fields and sign-in validation for fake auth | pending |
| **A3** | Recipe photo required vs optional + placeholder treatment | pending |
| **A4** | Author edit flow (shared form route vs inline vs other) | pending |
| **A5** | Self-follow, follower/follow counts on profiles | pending |
| **A6** | Home feed when user follows no cooks | pending |

**POC defaults (not business rules — do not override A1–A6 without PR author):**

- **Email notifications**: when a followed cook publishes a recipe, append a **simulated** notification record (e.g. in-memory log or dev-only list) with fictional follower emails—no SMTP, no real addresses.
- **Data**: fictional cooks, recipes, ingredients, steps, and tags only.
- **Harvest Table**: explicit in RFP; no alternate theme or dark mode.

## Screens and routes

From explicit + derived UI requirements in `rfp-brief.md`. No extra screens beyond minimal auth/registration affordances paired with sign-in.

| Route | Purpose |
| --- | --- |
| `/sign-in` | Sign-in; entry to registration affordance (**A2**). |
| `/register` | Registration UI paired with sign-in capability (**A2**). |
| `/` | Home feed of recipes from followed cooks; empty state per **A6**. |
| `/search` | Search by recipe title, ingredient, and cook tags (`?q=`); visibility for signed-out users per **A1**. |
| `/recipes/[id]` | Recipe page optimized for cooking-from (title, meta, ingredients, numbered steps); author edit entry per **A4**; shareable URL for anonymous read via same route when link is opened (**A1** governs other anonymous browsing). |
| `/recipes/new` | Add-recipe form: title, photo, servings, time, ingredients, numbered steps, optional tags (**A3**). |
| `/recipes/[id]/edit` | Author edit form (if **A4** selects shared form pattern—adjust route if PR author chooses otherwise). |
| `/cooks/[id]` | Cook profile: that cook’s recipes, follow/unfollow control; anonymous access per **A1**; counts per **A5**. |

App shell (derived): light Harvest Table chrome with sign-in/sign-out, navigation to home and search, add-recipe when signed in, and session indicator—no screens beyond the five named plus auth routes.

**Share link**: same recipe page URL (or stable public id) copyable from the recipe view; unsigned visitors may open it without sign-in per RFP.

## UI direction

Copy from `rfp-brief.md` (Developer uses this for theme only; do not restyle beyond tokens/layout).

- Source: explicit
- Tone: Approachable, Premium (Harvest Table cookbook aesthetic for consumer home cooks)
- Context: Consumer recipe-sharing website for home cooks and followers; warm trusted-cook discovery rather than enterprise tooling.
- Density: moderate
- Demo quality: modern, demo-impressive-within-restraint
- Notes: Persistent light shell on cream paper with serif display titles and sage primary actions; recipe detail uses a document-centric column (title, meta, ingredients, numbered steps) as the first-viewport focal point for cooking-from. Signature: terracotta accent on key highlights (e.g. follow state, section labels) with sage green primary buttons—not a generic SaaS blue palette. Restraint: no dark mode, no alternate theme, no stock hero photography required—use placeholder or simple recipe photo treatment; no extra chrome beyond the five in-scope screens plus minimal auth/registration affordances derived from capabilities.

First implementation step: map tone + density onto existing scaffold tokens in `app/globals.css` `:root` and the layout shell (cream paper, sage primary, terracotta highlights, ink-brown body, serif titles); do not reinstall Tailwind.

## Local data

- **Users/cooks fixtures**: fictional accounts (id, display name, email for notification simulation only).
- **Recipes**: title, optional photo reference or empty (**A3**), servings, time, ingredient list, numbered steps, optional tags, `authorId`.
- **Follows**: in-memory map of follower → followed cook ids (**A5** rules).
- **Session**: in-memory or cookie-backed demo session for “current user” after fake sign-in (**A2**).
- **Feed helper**: recipes whose `authorId` is in the current user’s followed set, ordered for demo (e.g. newest first).
- **Search helper**: match query against title, any ingredient string, and tag list; respect **A1** for who may call it.
- **Notifications**: on publish (create recipe), for each follower of the author, push `{ cookId, recipeId, followerEmail, simulatedAt }` to an in-memory queue/list—surface optionally in dev UI or test assertions only; not a separate marketing screen.
- **Photos**: if brief supplies no image files, use **typographic or neutral placeholder tiles** on cards and recipe header per **A3** and UI direction Notes—not generated art under `public/` unless author uploads in demo.

## Server/API

Prefer fixtures + in-memory module store (`lib/store.ts` or scaffold equivalent). Add minimal Route Handlers only if needed for Vitest or mutations:

- Optional `POST /api/auth/sign-in`, `POST /api/auth/register`, `POST /api/auth/sign-out` — fake auth per **A2**.
- Optional `POST /api/recipes`, `PATCH /api/recipes/[id]` — create/update with author check.
- Optional `POST /api/cooks/[id]/follow` — toggle follow per **A5**.
- Optional `GET /api/search?q=` — if server-side search simplifies tests; else pure lib function.

No real email provider; notification simulation stays in store layer.

## Vitest checks (must match task plan)

- Harvest Table tokens: primary/muted/card (and terracotta/sage/ink/cream cues) differ from scaffold defaults and align with brief tone.
- Primary recipe route implements Notes **signature pattern** (document-centric cooking-from column, terracotta accents on key highlights, sage primary actions).
- Fake auth sign-in/register/sign-out per **A2**; publish and follow require session.
- Home feed lists only followed cooks’ recipes; empty feed behavior per **A6**.
- Search matches title, ingredient, and tag; signed-out access per **A1**.
- Cook profile lists author recipes; follow/unfollow on profile; **A5** rules enforced in tests.
- Recipe page renders ingredients and numbered steps; shared URL readable without session; author-only edit affordance per **A4**.
- Add-recipe enforces **A3** photo rules; optional tags stored and searchable.
- On publish, simulated email notifications created for each follower (count/assertion on in-memory log).
- No clickable `http(s)` links in UI; no secret patterns in POC files.
