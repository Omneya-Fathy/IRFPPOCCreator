# Skill patch: user photo upload vs typographic cover

Run from repo root:

```bash
node pocs/SCRUM-12/docs/apply-product-media-skills-patch.mjs
```

## Policy (skills only — not a POC code change)

| Plan says | Developer / Tester |
| --- | --- |
| **User upload allowed** | File input on create/edit; in-memory `photoDataUrl`; show `<img>` when set |
| **No image yet** | `TypographicCover` with **title** + **subtitle** (metadata, not a fake photo) |
| **Typographic only** (Q1 default, e.g. SCRUM-12) | No file input; always typographic cover |

Planner (`generate-tasks`) must state which mode in Q1 or `technical-plan.md` POC defaults.

Does **not** change an already-approved SCRUM-12 plan (typographic-only) unless the human revises via `/revise` or A1.
