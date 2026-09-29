# Ambiguity log

- Jira key: SCRUM-12

## Open questions

### Q1 — POC demo defaults (confirmation)

- Asked: 2026-09-29 (Requirements Planner)
- Question: The RFP is clear on product rules and Harvest Table theme; please confirm these **POC-only** defaults (reply on this issue before `/approve`, or comment `/approve` if you accept them as-is):
  1. **Authentication:** Fictional cooks only—sign-in and registration use in-memory fixture accounts (e.g. pick or create a demo cook with a display name and fake email). No real identity provider, password hashing, or verification emails.
  2. **Followers email on new recipe:** When a signed-in cook publishes a recipe, represent “email notified followers” as an on-screen demo affordance only (e.g. a short list or log of fictional follower emails that would have been notified). No SMTP or outbound mail.
  3. **Recipe photos:** Use a typographic/placeholder cover tile for the recipe photo field (no image upload storage or stock photography).
  4. **Public shared recipe link:** Use a dedicated public route (e.g. `/share/[recipeId]`) with minimal chrome—recipe content only, no signed-in nav—while the signed-in recipe view stays on `/recipes/[recipeId]`.
- Answer (Jira / operator):
- Status: open

## Answered

## Ignored comments

Comments from the automation account or bodies prefixed `**[IRFP POC Creator]**` (do not use for gates).
