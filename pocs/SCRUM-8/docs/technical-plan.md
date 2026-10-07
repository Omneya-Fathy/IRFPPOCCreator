# Technical plan

- Jira key: SCRUM-8
- Stack (RFP named / Next.js default / PR-author override): RFP silent — **Next.js App Router + TypeScript**, demo UI, static fixtures + in-memory state (no real auth, email provider, or persistence).

## Resolved business rules (A1–A2)

| ID | Decision |
| --- | --- |
| **A1** | **No mandatory sign-in gate.** A **default demo actor** drives feed (followed cooks), publish, edit-own, and follow/unfollow. **Optional** `/sign-in` is a dummy persona switch only (not required to use the app). Attribution (author, follow actions) reflects the **active demo actor**. |
| **A2** | Recipe **photo** via **file input** on add/edit; persist in-memory as **`photoDataUrl`** (data URL string). Recipe views render `<img>` when `photoDataUrl` is set; otherwise **`TypographicCover`** (title + subtitle from servings/time or cook name). Vitest covers recipes with and without upload. |

## Screens and routes

From explicit + derived UI requirements in `rfp-brief.md`. No extra screens.

| Route | Purpose |
| --- | --- |
| `/` | Home feed of recipes from cooks the **active demo actor** follows (**A1**); Harvest Table cards with search entry in header. |
| `/search` | Search by recipe **title** and by **ingredient** (`?q=` and mode or dual fields per demo); results link to recipe pages. |
| `/recipes/[id]` | **Cook-from** recipe page: title, photo or typographic cover (**A2**), servings/time, tags, ingredients column, numbered steps with **terracotta step rail** (Sunday Supper Spread). Guest-readable without sign-in when opened directly. Edit affordance when active actor is author. |
| `/recipes/new` | Add-recipe form (all fields + **file upload** for photo **A2**); no login gate; attributes publish to active demo actor. |
| `/recipes/[id]/edit` | Edit own recipe (author = active demo actor); same fields and upload behavior as add. |
| `/cooks/[id]` | Cook profile: identity, sage **follow/unfollow** for active actor (**A1**), list of that cook’s recipes. |
| `/sign-in` | **Optional** dummy sign-in / persona picker to switch demo actor (**A1**); not required to access feed, publish, or follow. |

**Email notification** (capability, not a full screen): in-memory **demo stub** (e.g. log panel, toast, or “notifications” strip) when a followed cook publishes a new recipe—no SMTP, fictional cooks only.

## UI direction

Copy from `rfp-brief.md` (Developer uses this for theme only; do not restyle beyond tokens/layout).

- Source: explicit (Harvest Table) + inferred composition (Sunday Supper Spread — see design brief)
- Tone: Approachable, Editorial
- Context: Consumer-facing recipe-sharing for home cooks and their followers; warm, durable “recipe at home” feel rather than enterprise or marketplace chrome.
- Density: moderate
- Demo quality: modern, demo-impressive-within-restraint
- Notes: Recipe **cook-from** layout uses a two-zone editorial composition — ingredients and metadata in a supporting column, numbered steps in a primary reading column with a **terracotta step rail** (vertical progress marker tied to step numbers). Signature: the step rail on the cook-from recipe page, not a generic card grid. Restraint: Harvest Table tokens only; typographic covers for recipe photos when no upload files exist; no stock food photography, dark mode, or extra social features.
- Design brief: `docs/ui-design-brief.md`

First implementation step: map tone, density, and selected design-brief contract onto existing scaffold tokens in `app/globals.css` `:root` and the layout shell; do not reinstall Tailwind.

## UI design contract

Copy the **selected** concept from `docs/ui-design-brief.md`. Developer implements this; do not add screens to match the tone.

- Selected direction (name): **A — Sunday Supper Spread**
- Design metaphor: Sunday supper spread — ingredients and serving context sit to the side like bowls on the table; recipe steps run down the center where the cook’s attention lives.
- Emotional target: Calm readiness — “I can cook this tonight” — with connection to the cook you follow.
- Visual personality (3–5 traits): Cream paper surfaces; serif recipe titles; sage for affirmative actions (publish, follow, optional sign-in submit); terracotta reserved for highlights and cook-from step rail; ink-brown body for ingredients and steps.
- First-viewport visual anchor: On feed, alternating **large typographic cover card → compact row**; on cook-from page, hero title/cover band then step column with **terracotta step rail**.
- Hierarchy (PRIMARY → SECONDARY → SUPPORTING → UTILITY): PRIMARY — recipe title + current cooking step (cook-from); feed card title + cook. SECONDARY — ingredients, servings/time, tags. SUPPORTING — cook name, tag chips. UTILITY — nav, search, edit, optional sign-in, unfollow.
- Signature moment: **Terracotta vertical step rail** beside numbered steps on cook-from layout; active step highlighted (static highlight acceptable for POC).
- Visual rhythm / controlled asymmetry: Feed alternates large cover-led card and compact text-forward row; cook-from ~35/65 ingredients vs steps on desktop; one featured card slightly wider per fixture set.
- Media strategy (RFP files / upload / typographic or domain-native): **A2** user upload → `photoDataUrl`; else **TypographicCover** (title + subtitle). Cook avatars: initials tile. No stock food photography.
- Content density and fixture notes: 4–6 recipes per featured cook; ingredients 8–12 items; steps 5–8; varied title lengths; fictional cooks only (no real emails).
- Responsive adaptation of the concept: Below `md`, cook-from stacks; step rail becomes left border or inline terracotta marker per step (rail identity preserved). Feed single column; search in header.
- Anti-patterns to avoid: Generic SaaS purple/blue; dark mode; comments/likes/commerce; identical card grids without cook-from focal layout; faux food photos; glassmorphism; terracotta on every button.
- Memorable-moment answer: User remembers **where they are in the recipe** via the terracotta step rail, not generic green buttons.
- Any-app test (why this is not generic SaaS): Harvest Table serif+cream+sage+terracotta, follow-based feed, cook-from step rail, and typographic/upload recipe covers are specific to home recipe sharing—not generic CRUD or admin UI.

## Local data

- **Demo actors** (`lib/` or `data/`): 2–3 fictional cooks with ids, display names, initials; one **default active actor** on load (**A1**). Optional `/sign-in` sets active actor in client or in-memory session (no real credentials).
- **Recipes fixtures** + **in-memory store**: title, servings, time, ingredients[], steps[], optional tags[], `authorId`, `photoDataUrl` optional (**A2**). New/edited recipes append or update store; uploads read via `FileReader` → data URL (POC-only, not for production size limits).
- **Follow graph**: which cook ids the active actor follows; toggle on profile (**A1**, no gate).
- **Feed**: recipes whose `authorId` is in followed set for active actor, sorted by recency (fixture timestamps).
- **Search**: filter in-memory recipes by title substring and ingredient substring (case-insensitive).
- **Author edit rule**: edit routes allowed when `recipe.authorId === activeActor.id`.
- **Guest recipe view**: `/recipes/[id]` readable without switching actor; publish/follow CTAs use active actor without forcing visit to `/sign-in`.
- **Email stub**: on publish, if any other demo actor follows the author, append a fictional notification record (cook name + recipe title)—display in a small demo panel or dismissible banner; no real addresses.

## Server/API

Prefer **fixtures + in-memory module store** (`lib/store.ts` or equivalent). Optional minimal Route Handlers only if needed for Vitest or upload size:

- `POST /api/recipes` — create with optional `photoDataUrl` (**A2**).
- `PATCH /api/recipes/[id]` — update own recipe + photo.
- `POST /api/follow` — toggle follow for active actor (**A1**).

No OAuth, sessions, or database.

## Vitest checks (must match task plan)

- `app/layout.tsx` imports `./globals.css`.
- Theme tokens (primary/muted/card) differ from scaffold defaults and reflect Harvest Table / Approachable Editorial tone.
- `TypographicCover` renders title + subtitle when `photoDataUrl` absent; recipe with upload shows image source from data URL (**A2**).
- Default demo actor present; feed and publish work **without** visiting `/sign-in` (**A1**).
- Persona switch on `/sign-in` changes attribution for new publish/follow (at least one Vitest or store unit test).
- Cook-from page includes numbered steps and step-rail structure (DOM/class or data attributes).
- `isAuthor` / edit gate: only active actor’s recipes editable.
- Search matches title and ingredient cases from fixtures.
- Follow toggle updates feed contents for active actor.
- Email stub records notification when followed cook publishes (in-memory).
- Fixtures: no `Lorem`, no repeated “Test User”; realistic recipe copy.
- No clickable `http(s)` links in UI; no secret patterns in POC files.
