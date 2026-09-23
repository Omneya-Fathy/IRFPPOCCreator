# UI direction notes (POC)

Load from `.cursor/skills/frontend-development/SKILL.md` when UI direction is **insufficient**, or (always) for **Tone → visual translation**, **First-glance appeal**, **Domain-relevant visual language**, and **Final visual QA**. Do not invent screens or business rules. Apply only to **approved** screens.

## Tone → visual translation

Apply the brief’s tone (explicit or inferred). If two labels are given, combine them (e.g. Modern SaaS + Structured). Tone controls spacing, proportions, image treatment, cards, hierarchy, CTA emphasis, motion, radius, shadow, and density — not merely a color palette.

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

Retokenize scaffold `:root` (`--background`, `--foreground`, `--muted`, `--border`, `--primary`, `--primary-foreground`, `--card`, `--card-foreground`, `--radius`, `--shadow-sm`). Do not leave default template colors if the brief named a tone.

## Inference examples (guidance only — infer from the actual brief)

| Context | Typical direction |
| --- | --- |
| Enterprise workflow | Modern SaaS + Professional; moderate density; structured, trustworthy; subtle cards/borders; neutral base + one accent; strong page titles and primary actions |
| AI / productivity | Modern SaaS + Technical/Premium; moderate density; clean, focused; restrained accent; subtle interactive states; strong content hierarchy |
| Books / content / media | Editorial + Modern; stronger imagery; generous whitespace; prominent covers/thumbnails; balanced card composition; readable metadata hierarchy |
| Finance | Trustworthy, structured, data-focused; clear status and tabular presentation |
| Healthcare | Calm, accessible, information-first |
| Logistics | Operational clarity, status visibility, compact information |
| Education | Approachable content hierarchy |
| Developer tools | Technical, dense, precise interface |

## Components (extend scaffold, do not replace)

Reuse scaffold `components/ui`: `Button`, `Input`, `Card`, `Badge`, `Alert`, `Skeleton`, `EmptyState`, `PageHeader`. Then extend, then create. Add `Select`/`Textarea`, table wrappers, `Modal`/`Dialog` only if the plan names them. Tailwind + tokens only unless the brief named a library. No full UI kit npm package.

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
- Does the page have a clear visual rhythm?

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

## First-glance appeal

POCs should be visually memorable, not childish or overloaded.

Use tastefully where appropriate: strong hero/content focal point, clear accent color, restrained but interesting card composition, subtle hover elevation, meaningful status badges, visual grouping and progressive disclosure, attractive empty states, subtle transitions, clear primary CTA, strong imagery when relevant, meaningful iconography, contextual microcopy.

Avoid: excessive gradients, glassmorphism, random blobs, unnecessary animations, neon without justification, excessive shadows, decorative elements that compete with content, generic AI-looking interfaces, emoji as UI decoration.

The UI should feel intentionally designed for **this** product, not generated from a generic dashboard template.

## Domain-relevant visual language

Reflect the product being demonstrated. Do not reuse the same visual treatment for every POC. The RFP/domain determines the final direction (see inference examples above). Retokenize the scaffold; do not ship default template colors as the product look.

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
| **Hierarchy** | Primary content and action obvious? Secondary information subdued? |
| **Balance** | Screen evenly weighted? Images and text proportional? Cards consistent? Whitespace intentional? |
| **Consistency** | Repeated components, buttons, badges, radii, shadows, and colors match? |
| **Demo appeal** | Product obvious in the **first viewport** (first-glance appeal)? Credible vs prototype? Clear focal point? Tokens retokenized (not unchanged scaffold)? Domain-relevant? |
| **Media honesty** | No faux photos or decorative “cover art” SVGs? Typographic covers or real supplied assets only? No empty/broken images? |
