# UI direction (POC Design Brief Generator)

Load from `.cursor/skills/analyze-rfp/SKILL.md` when writing `docs/ui-design-brief.md`, and from `.cursor/skills/frontend-development/SKILL.md` when implementing or when brief direction is thin. Always read **Tone → visual translation**, **First-glance appeal**, **Domain-relevant visual language**, **UI Innovation & Design Ideation**, and **Final visual QA**. Do not invent screens or business rules. Apply only to **approved** (or capability-derived) screens.

This file is a **design-generation system**, not a list of adjectives. Words such as modern, catchy, balanced, or beautiful are not a direction. Produce a product-specific concept **before** choosing components.

## Governing model

Score a concept as **Novelty × Relevance × Coherence × Delight**. Usability and approved scope are hard gates.

A UI feels innovative when it introduces something unexpected **that makes sense for the product** — not when it adds gradients, animation, or glassmorphism.

**Hard rule:** Never introduce visual novelty by randomly changing colors, gradients, border radii, shadows, or fonts. Novelty must originate from the product's domain, content model, layout, interaction, or metaphor.

## UI Innovation & Design Ideation

Do not begin implementation (or a design brief) by choosing generic UI components.

Before writing UI code, transform the RFP (explicit + derived UI requirements only) into a distinct visual and interaction concept.

The objective is not merely to produce a polished interface.
The objective is to produce a POC that feels intentionally designed for **this** product.

### 1. Extract the product's design opportunity

Identify:

- What is the product fundamentally about?
- Who is using it?
- What is the user's primary emotional goal?
- What is the user's primary functional goal?
- What makes this product different from a generic CRUD application?
- What real-world experience does this product resemble?
- What visual subjects naturally belong to this domain?
- What information deserves visual emphasis?

Do not design the interface until these questions have been considered. Do not invent capabilities to make the answers richer.

### 2. Establish a design concept

Create a concise design concept containing:

- Design metaphor
- Emotional tone
- Visual personality
- Typography personality
- Color strategy
- Layout strategy
- Interaction strategy
- Image/illustration strategy
- Signature UI element

The concept must be specific enough that another designer could recognize the product without seeing the product name.

Avoid generic concepts used alone:

- modern
- clean
- professional
- sleek
- minimal
- beautiful
- futuristic

These words may describe the result but are not a design direction.

Prefer concrete metaphors such as:

- editorial cookbook
- field notebook
- luxury catalog
- playful studio
- cinematic discovery
- digital workshop
- intelligent command center
- museum archive
- travel journal
- marketplace street guide

The metaphor must be appropriate to the RFP. Explicit brand or design-system specs win over inference.

### 3. Generate multiple design directions

Before implementation (Analyst: before posting the brief), consider **at least 3** substantially different directions.

For each direction record:

- visual metaphor
- composition
- typography
- imagery / media treatment
- interaction model
- emotional tone

Select the direction with the strongest relationship to the product (Novelty × Relevance × Coherence × Delight), then check usability, feasibility on the scaffold, media honesty, and scope safety.

Do not simply choose different color palettes.
The directions must differ in composition and interaction.

**Prescriptive instruction (weaker models):** Generate 3 different product-specific visual concepts. Each must differ in composition, metaphor, and interaction model. Select one. Identify its signature visual moment. Implement (or document) that concept consistently across the UI.

### 4. Avoid the generic SaaS template

Unless explicitly required by the RFP, do not default to:

- centered hero + three cards
- large empty whitespace with one CTA
- generic navbar + sidebar dashboard
- identical cards repeated in a grid
- excessive rounded rectangles
- arbitrary gradient backgrounds
- generic glassmorphism
- generic purple/blue AI styling
- huge headings followed by empty space
- placeholder-looking content

A POC should feel populated and intentional.

Whitespace is valuable only when it improves hierarchy or creates visual tension.
Do not use whitespace merely because "modern design" was requested.

### 5. Design around visual anchors

Every important screen should have one or more strong visual anchors.

Examples (use only if they fit approved content):

- hero / featured object
- editorial headline
- map or timeline (from UI primitives if no image files)
- progress visualization
- large product media (RFP file or user upload only)
- profile identity (initials / typographic tile)
- interactive preview
- data visualization
- prominent action
- contextual domain composition

Do not distribute visual weight evenly across every element.

Create hierarchy:

PRIMARY → SECONDARY → SUPPORTING → UTILITY.

### 6. Use the product's domain as a source of visual language

Do not use arbitrary decorative elements.

Instead, derive visual elements from the product domain.

Examples:

Cooking:

- recipe cards
- ingredients
- handwritten/editorial typography
- food photography **only** if RFP files or approved upload exist; otherwise typographic recipe sheets
- cooking progress
- pantry / chopping-board metaphors in layout and tokens

Travel:

- maps (primitives, not remote tiles)
- tickets
- stamps
- itinerary timelines
- destination photography only if files exist
- location markers

Finance:

- statements
- portfolio composition
- market movement
- transaction streams
- financial charts

Education:

- lessons
- progress
- notebooks
- achievements
- learning paths

Healthcare:

- patient journeys
- clinical timelines
- records
- vitals
- care plans

The visual language should reinforce the product rather than decorate it.

### 7. Introduce one signature interaction or moment

Every POC should have at least one memorable moment.

If a **named capability** supports it, prefer a signature **interaction** such as:

- drag to organize
- interactive filtering
- progressive disclosure
- hover reveals
- expandable cards
- timeline navigation
- live preview
- step-by-step transformation
- contextual actions
- animated state transitions
- interactive comparison

If no capability supports a new interaction, define a **signature visual/compositional moment** on an approved screen (featured object, editorial cover tile, status-forward header, command-strip, etc.).

The interaction or moment should improve understanding or usability.
Do not add animation simply to demonstrate animation.
Do not add screens or workflows to host the moment.

### 8. Design for density, not emptiness

A POC should look convincingly populated.

Prefer realistic representative content over:

- Lorem ipsum
- empty cards
- placeholder rectangles
- excessive empty containers
- repeated identical items

When the RFP does not provide enough content, create plausible **fake** demo content consistent with the domain (no real customer data).

Populate the interface with:

- realistic names
- meaningful labels
- representative media (honest: upload, RFP file, or typographic/domain-native)
- realistic numbers
- meaningful statuses
- varied content lengths
- realistic states

The goal is to demonstrate what the finished product could feel like.

### 9. Create visual rhythm

Do not make every section structurally identical.

Vary:

- section heights
- card sizes
- content density
- image / media ratios
- typography scale
- alignment
- grouping
- whitespace
- visual emphasis

Use rhythm such as:

large → compact → visual → dense → interactive → large

rather than:

card → card → card → card → card.

### 10. Use controlled asymmetry

Perfectly symmetrical grids often produce generic interfaces.

When appropriate, introduce intentional asymmetry:

- featured card larger than supporting cards
- offset imagery / media
- overlapping elements (keep contrast and hit targets)
- varied card sizes
- editorial layouts
- unexpected alignment
- large/small content relationships

Asymmetry must remain usable, keyboard-accessible, and intentional.

### 11. Make images first-class UI elements (when honest)

When imagery is relevant **and** assets are allowed (RFP-named files or approved user upload), do not treat images as tiny thumbnails.

Use:

- large editorial imagery
- image-led cards
- image overlays
- contextual cropping
- varied aspect ratios
- focal-point positioning

Always center/focal-align images appropriately inside their containers.

When no real files exist, treat **typographic covers**, initials tiles, and data visualizations as first-class media — not as broken photo slots.

Images and media should contribute to hierarchy rather than merely fill space.

### 12. Motion with purpose

Use subtle motion to communicate:

- state change
- hierarchy
- navigation
- progress
- cause and effect
- spatial relationships

Prefer meaningful transitions over decorative animation.
Do not animate every component.
Respect `prefers-reduced-motion`.

### 13. The "memorable moment" test

Before implementation is considered complete (and before a design brief is approved), identify:

"What will the user remember 10 seconds after seeing this POC?"

If the answer is "the colors were nice" or "it looked modern",
the design concept is insufficient.

Introduce one distinctive visual or interaction concept
that belongs specifically to this product.

### 14. The "could this be any app?" test

Ask:

"If I removed the logo and product name, could this UI belong to almost any SaaS product?"

If yes, redesign the visual language around the product domain. Do not add features to pass the test.

### 15. Preserve usability

Innovation must not compromise:

- readability
- accessibility
- navigation
- responsive behavior
- interaction discoverability
- visual hierarchy
- performance

Do not introduce novelty merely for novelty's sake.

The best innovation makes the product easier to understand,
more memorable, or more enjoyable to use.

## Generated artifact schema

Analysts fill `templates/poc-docs/ui-design-brief.md` → `pocs/<KEY>/docs/ui-design-brief.md`. Required sections:

- Product identity
- Explicit RFP constraints
- Design opportunity
- Three candidate directions (metaphor, composition, interaction differ)
- Selected direction + scoring
- Design metaphor, emotional target, visual personality (3–5 concrete traits)
- Composition, visual hierarchy, imagery/media, interaction concept, signature moment
- Content density, visual rhythm, controlled asymmetry
- Responsive behavior, component direction, anti-patterns
- Acceptance tests (memorable moment + any-app test)

`docs/rfp-brief.md` **UI direction** remains a short compatibility summary (Tone, Density, Context, Notes, Demo quality). The design brief is the canonical concept.

## Tone → visual translation

Apply the brief’s tone (explicit or inferred). If two labels are given, combine them (e.g. Modern SaaS + Structured). Tone controls spacing, proportions, image treatment, cards, hierarchy, CTA emphasis, motion, radius, shadow, and density — not merely a color palette. Map the **selected design brief** onto these tokens; do not leave scaffold defaults.

| Tone | Layout | Type / color | Surfaces | Composition notes |
| --- | --- | --- | --- | --- |
| **Professional** / **Structured** | App shell: header + main; predictable page header; tables/lists over marketing heroes | Neutral + one primary; high contrast; `text-sm` body | Cards with border + `shadow-sm`; tight radius | Strong L1 headers; subdued metadata; aligned grids |
| **Modern SaaS** | Clear nav; content `max-w-6xl` | Clean hierarchy; restrained primary | Rounded-lg cards; generous padding | Obvious primary CTA; moderate motion |
| **Minimal** | Fewer chrome elements; more whitespace | Limited palette; no decorative icons | Light borders; almost no shadow | Hierarchy through spacing, not decoration |
| **Data-focused** | Dense tables, filters, status columns; sticky header | Tabular figures; muted secondary text | Compact rows; badges for status | Status visible at a glance; scannable rows |
| **Approachable** | Softer page titles; helpful empty copy | Warmer neutrals; slightly larger body | Friendlier cards; still not playful illustration | Welcoming empty states; readable metadata |
| **Technical** | Monospace for IDs/codes only; otherwise system UI | Cool gray + one accent | Sharp-ish radius; status as text + badge | Precise alignment; compact information |
| **Premium** | Generous spacing; fewer competing actions | Darker neutrals or refined single accent | Subtle shadow; no loud gradients | Restrained emphasis; one focal point per screen |
| **Enterprise** (qualifier) | Persistent nav; status visualization; forms with labels | Conservative primary (blue/slate, not neon) | Structured, not consumer storefront | Trustworthy density; clear sectioning |
| **Editorial** (qualifier) | Content-forward; imagery-led grids | Strong typographic hierarchy | Generous media areas; balanced whitespace | Prominent covers/thumbnails; centered media containers |

Density: **low** → more whitespace, fewer columns; **high** → compact tables, still readable; **moderate** → default SaaS spacing (`p-4`/`p-6`, `gap-4`).

Retokenize scaffold `:root` (`--background`, `--foreground`, `--muted`, `--border`, `--primary`, `--primary-foreground`, `--card`, `--card-foreground`, `--radius`, `--shadow-sm`). Do not leave default template colors if the brief named a tone or a design brief exists.

## Inference examples (guidance only — infer from the actual brief)

| Context | Typical direction |
| --- | --- |
| Enterprise workflow | Modern SaaS + Professional; moderate density; structured, trustworthy; subtle cards/borders; neutral base + one accent; strong page titles and primary actions |
| AI / productivity | Modern SaaS + Technical/Premium; moderate density; clean, focused; restrained accent; subtle interactive states; strong content hierarchy |
| Books / content / media | Editorial + Modern; stronger imagery (honest media); generous whitespace; prominent covers/thumbnails; balanced card composition; readable metadata hierarchy |
| Finance | Trustworthy, structured, data-focused; clear status and tabular presentation |
| Healthcare | Calm, accessible, information-first |
| Logistics | Operational clarity, status visibility, compact information |
| Education | Approachable content hierarchy |
| Developer tools | Technical, dense, precise interface |

Use these as **starting hints**, then run the 3-direction ideation procedure. Do not stop at the table row.

## Components (extend scaffold, do not replace)

Reuse scaffold `components/ui`: `Button`, `Input`, `Card`, `Badge`, `Alert`, `Skeleton`, `EmptyState`, `PageHeader`. Then extend, then create. Add `Select`/`Textarea`, table wrappers, `Modal`/`Dialog` only if the plan names them. Tailwind + tokens only unless the brief named a library. No full UI kit npm package.

Style these primitives to express the selected metaphor. Do not install a new kit to look innovative.

## Data-driven states

| State | Expectation |
| --- | --- |
| **Loading** | Skeleton or concise label — never a blank page |
| **Empty** | Contextual, domain-relevant empty state |
| **Error** | User-facing message; no stack traces |
| **Success** | Inline alert or banner after submit; state change easy to notice |

Fake delays only if the plan demos async.

## Forms / tables / icons / motion

- Forms: labels, field-level errors, disable submit while processing when the plan shows submit, preserve values, keyboard order.
- Tables: headers, padding, loading/empty, pagination only if planned; card layout on small screens when density is not “high.”
- Icons: local inline SVG in `components/icons/`. No emoji-as-icons. No CDN icon packs.
- Motion: short transitions on hover, focus, open/close, loading only. Respect `prefers-reduced-motion`.
- A11y: sufficient contrast, visible focus, semantic HTML, keyboard access, labels, status not by color alone.

## UI/UX design review (before each approved screen)

### Pre-code concept checkpoint

Before selecting components for a screen, write (internally or in the design brief) answers for:

- Focal point (visual anchor)
- Primary action
- Signature moment on this screen (or how the global moment appears)
- Domain visual language in use
- Density and rhythm
- How the concept adapts on a small viewport

### Hierarchy

- What is the first thing the user should notice?
- What is the primary action?
- What information is secondary?
- Is the hierarchy obvious without reading everything?

Use four levels consistently:

| Level | Role |
| --- | --- |
| **1** | Page purpose / primary content |
| **2** | Sections and important actions |
| **3** | Supporting information |
| **4** | Metadata and low-priority details |

Use font size, weight, spacing, contrast, surface treatment, and positioning — not equal visual weight on every element.

### Composition

- Are elements visually balanced?
- Are cards aligned?
- Are images correctly positioned and proportioned?
- Are large empty areas intentional?
- Are dense areas broken into readable groups?
- Does the page have a clear visual rhythm (not identical repeated blocks)?

### Spacing

Use a consistent spacing scale. Avoid random margins, inconsistent card padding, elements touching container edges, excessive whitespace from poor alignment, and cramped content. Use whitespace deliberately to separate hierarchy.

### Alignment

Repeated elements share consistent alignment: card contents, headings, metadata, buttons, icons, images, grid columns, form fields. Do not allow awkward misalignment because the HTML technically works.

## POC product media (covers, thumbnails, avatars)

IRFP POCs rarely include licensed product photography. **Do not simulate photos** with generated SVGs, clip-art, gradient blobs, or repeated decorative files under `public/` — they read as broken or “placeholder bugs” in demos.

| Requirement in brief | Default POC treatment |
| --- | --- |
| “Cover image,” “thumbnail,” “product photo,” “avatar” (no files supplied) | **`TypographicCover`** (or equivalent): title/metadata on theme tokens, fixed aspect ratio (e.g. `aspect-[3/4]` for books), `role="img"` + descriptive `aria-label`. Satisfies the requirement without pretending to be a photograph. |
| Real files named in RFP/plan or attached to Jira | Local files in the POC only; normalize container + `object-contain` or intentional `object-cover`. |
| User/profile with no photo | Initials badge or typographic tile — not a fake face illustration. |
| Domain “imagery” with no files | Honest domain-native composition: typographic covers, charts, timelines, ticket/statement layouts — not stock art. |

Scaffold ships `components/ui/typographic-cover.tsx`. Extend it (accent stripe, genre chip) before inventing new image assets.

**Planner / task-plan wording:** prefer “cover tile” or “typographic cover” over “cover image assets” when no files are supplied.

## Image and media composition

When real images are used, they must look intentionally designed, not merely inserted into a container.

**Key rule:** Normalize the media container, then center the media inside it. Use `object-contain` when the complete image matters; use `object-cover` when cropping is intentional.

For every image/card, determine treatment based on content:

- Center images inside their visual container when not edge-to-edge (`flex items-center justify-center`, `grid place-items-center`, or equivalent).
- Preserve aspect ratio. Avoid distorted images.
- Give image containers predictable dimensions/aspect ratios.
- Keep image content visually balanced within cards.
- Do not allow covers, products, avatars, thumbnails, or illustrations to appear randomly offset.
- Maintain consistent image sizing across repeated cards.
- If image dimensions vary, normalize the visual container rather than allowing uneven cards.
- Use `overflow-hidden` only when cropping is intentional.

Example: a book card should have a fixed visual area where the cover is centered horizontally and vertically — not aligned to one edge.

Never fix alignment with arbitrary pixel offsets unless there is a strong visual reason.

## Card composition

Cards should have deliberate internal structure:

1. visual/media area
2. title
3. supporting metadata
4. optional description
5. primary/secondary action

Not every card requires all sections. Maintain consistent internal padding, image area height, title line-height, metadata spacing, action alignment, and card height in grids when appropriate.

When content lengths differ, prevent chaotic grids with `flex flex-col`, `mt-auto`, consistent media aspect ratios, and controlled line clamping when appropriate. Do not force equal heights when it damages content.

Vary card **roles** (featured vs supporting) when the design brief calls for rhythm or asymmetry.

## First-glance appeal

POCs should be visually memorable, not childish or overloaded.

Use tastefully where appropriate: strong hero/content focal point, clear accent color, restrained but interesting card composition, subtle hover elevation, meaningful status badges, visual grouping and progressive disclosure, attractive empty states, subtle transitions, clear primary CTA, strong imagery when relevant and honest, meaningful iconography, contextual microcopy.

Avoid: excessive gradients, glassmorphism, random blobs, unnecessary animations, neon without justification, excessive shadows, decorative elements that compete with content, generic AI-looking interfaces, emoji as UI decoration.

The UI should feel intentionally designed for **this** product, not generated from a generic dashboard template.

## Domain-relevant visual language

Reflect the product being demonstrated. Do not reuse the same visual treatment for every POC. The RFP/domain and `docs/ui-design-brief.md` determine the final direction. Retokenize the scaffold; do not ship default template colors as the product look.

Propagate the concept through tokens, shell, cards, navigation, forms, states, media, typography, composition, and interaction feedback — not through color alone.

## POC demo psychology

Optimize approved screens for someone seeing the product for the first time. They should quickly understand:

1. What this screen is.
2. What matters most.
3. What they can do.
4. What changed after an interaction.
5. Why the product is useful.

For click-through POCs: make the primary action visually obvious; make state changes easy to notice; use realistic-looking demo data; avoid placeholder-looking content (`Lorem ipsum`, repeated “Test User”); use meaningful labels; make empty/success/error states believable; ensure the initial viewport contains useful content; avoid requiring unnecessary scrolling to understand the screen.

Do not invent business behavior to achieve this.

## Demo data presentation

POC data should visually demonstrate the product. Prefer realistic names, titles, statuses, dates, and believable descriptions with varied but controlled data. Avoid arbitrary random values and visually noisy fake data. Data should support the story of the screen.

## Final visual QA (before finishing each screen)

Run this table even when UI direction was sufficient. Fix visual issues before moving to the next screen or `npm run build`.

| Check | Questions |
| --- | --- |
| **Alignment** | Images centered where appropriate? Cards, headings, actions, grids consistent? |
| **Spacing** | Consistent scale? Sections breathing? No unexplained gaps or cramped clusters? |
| **Hierarchy** | Primary content and action obvious? PRIMARY → SECONDARY → SUPPORTING → UTILITY? |
| **Balance** | Screen evenly weighted? Images and text proportional? Cards consistent? Whitespace intentional? |
| **Consistency** | Repeated components match? Concept propagated beyond tokens? |
| **Rhythm / asymmetry** | Not card → card → card? Featured vs supporting where the brief asked? |
| **Demo appeal** | Product obvious in the **first viewport**? Credible vs prototype? Clear focal point? Tokens retokenized? Domain-relevant? |
| **Memorable moment** | Specific product-owned moment (not “nice colors” / “modern”)? |
| **Any-app test** | With name/logo removed, would this still look like *this* product? |
| **Signature** | Brief’s signature interaction or visual moment present on an approved screen? |
| **Anti-patterns** | No generic SaaS template, glassmorphism, purple/blue AI chrome, empty hero, cosmetic-only novelty? |
| **Tailwind wired** | Does root `app/layout.tsx` import `./globals.css`? Do utility classes (e.g. `bg-background`) render with theme colors in dev? |
| **Media honesty** | No faux photos or decorative “cover art” in `public/`? User-uploaded images only when the plan allows upload; otherwise typographic cover or domain-native primitives? No empty/broken `<img>`? |
| **Usability** | Readable, keyboard-accessible, contrast OK, concept survives small viewports? |
