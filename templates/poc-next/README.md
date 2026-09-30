# Generated POC (template)

Copy this folder into `pocs/<JIRA-KEY>/` with `node scripts/irfp.mjs scaffold-poc --key <JIRA-KEY>`.

Then replace the placeholder UI with the approved task list and RFP specs.

- Map the design brief onto `app/globals.css` `:root` and `lib/theme-tokens.ts` first. Keep `import "./globals.css"` on root `app/layout.tsx`. `lib/theme-wiring.test.ts` fails until tokens leave scaffold defaults.
- Reuse `components/ui/` (Button, Input, Card, Badge, Alert, Skeleton, EmptyState, PageHeader, **TypographicCover** for product/cover tiles when no real image files are supplied). Extend only if the plan names more (Select, Modal, table). Do not add faux cover-art SVGs under `public/`.
- `npm install` then `npm test` (Vitest) then `npm run dev`
- Local or fake data only
- No clickable `http(s)` links in UI or markdown
- System fonts only — no `next/font/google`, no CDNs
