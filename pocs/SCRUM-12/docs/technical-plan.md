# Technical plan

- Jira key: SCRUM-12
- Stack (RFP named / Next.js default / PR-author override): RFP silent — **Next.js App Router + TypeScript**, demo UI, static fixtures + in-memory session/follow state (no real auth provider, SMTP, or file storage).

## POC defaults (pending Q1 confirmation)

Unless the operator answers Q1 with different rules before `/approve`, implement:

| Topic | Default |
| --- | --- |
| Auth | In-memory demo registration and sign-in for fictional cooks only. |
| Email notifications | Demo panel/log of fictional follower emails “notified” on publish—no outbound email. |
| Recipe photo | `TypographicCover` / placeholder tile for the photo field—no uploads. |
| Public share | `/share/[recipeId]` minimal layout; signed-in cooking view at `/recipes/[recipeId]`. |

## Screens and routes

From explicit + derived UI requirements in `rfp-brief.md`. No extra screens.

| Route | Purpose |
| --- | --- |
| `/sign-in` | Registration and sign-in (accounts required to publish and follow). |
| `/` | Home feed: recipes from followed cooks only (signed-in); appropriate empty state when not signed in or not following anyone. |
| `/recipes/[id]` | Recipe page for cooking from content (signed-in shell with Harvest Table nav). |
| `/share/[id]` | Public shared recipe link—read recipe without account; minimal chrome per derived requirement. |
| `/recipes/new` | Add-recipe form: title, photo placeholder, servings, time, ingredients, numbered steps. |
| `/recipes/[id]/edit` | Edit own recipe (same fields; author-only). |
| `/cooks/[id]` | Cook profile: that cook’s recipes (grid/list) and **follow / unfollow** control (explicit profile placement). |
| `/search` | Search entry and results matching title, ingredient, and optional cook-entered tags (`?q=`). |

## UI direction

Copy from `rfp-brief.md` (Developer uses this for theme only; do not restyle beyond tokens/layout).

- Source: explicit
- Tone: Approachable, Premium (cookbook editorial)
- Context: Consumer-facing recipe-sharing website for home cooks and followers who want trusted, durable recipes rather than transient group-chat shares; light, cookbook-style presentation throughout.
- Density: moderate
- Demo quality: modern, demo-impressive-within-restraint
- Notes: Persistent light shell with cream paper background; each in-scope screen leads with content-first layout (feed cards, recipe steps, or profile recipe grid) rather than marketing hero blocks. Signature: serif display titles on recipe and profile headers with sage green primary/follow buttons and terracotta accent highlights on key metadata (time, servings). Restraint: Harvest Table palette only—no dark mode, no second theme, no fake stock lifestyle photography beyond a single recipe photo field; keep ink-brown body text readable and uncluttered.

First implementation step: map tone, density, and Harvest Table palette onto existing scaffold tokens in `app/globals.css` `:root` and the layout shell; do not reinstall Tailwind.

## Local data

- **Cooks fixtures:** fictional display names, fake emails, ids; in-memory “current user” session after sign-in/register.
- **Recipes fixtures:** title, servings, time, ingredient list, numbered steps, optional tags, author cook id, photo represented as typographic cover metadata (no binary assets).
- **Follow graph:** in-memory follow/unfollow edges (current user → cook); feed filters recipes to authors the user follows.
- **Search:** client or shared helper filtering fixtures by title substring, ingredient substring, and tag match.
- **Publish / edit:** in-memory mutations for demo (append/update recipe for current cook); on publish, append demo “email sent to followers” entries for cooks who follow the author.
- **Sensitive data:** no real people, emails, or personal recipe content—fictional samples only per brief.

## Server/API

Prefer fixtures + in-memory module store (`lib/store.ts` or equivalent). Add Route Handlers **only** if the approved task plan names them for Vitest or mutations; default is static imports and client/server components with shared store module.

## Vitest checks (must match task plan)

- Harvest Table theme tokens (cream paper, sage primary/follow, terracotta accent, ink-brown text) differ from scaffold defaults; primary route reflects Notes signature pattern (serif titles, sage primary, terracotta metadata accents).
- Demo auth: cannot publish or follow without signed-in session; registration + sign-in flows update current user.
- Home feed shows only recipes from followed cooks; excludes unfollowed and non-followed authors.
- Recipe page renders numbered steps and ingredient list for cooking-from layout.
- Add and edit recipe forms include all RFP fields; author-only edit enforcement.
- Cook profile lists author’s recipes; follow/unfollow on profile updates follow state and feed eligibility.
- Search matches by title, ingredient, and tag cases in fixtures.
- Public share route renders recipe without signed-in account chrome; reachable without session.
- On publish, demo email-notification affordance lists fictional follower emails (no SMTP).
- No clickable `http(s)` links in UI; no secret patterns in POC files.
