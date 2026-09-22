# Generated POC (template)

Copy this folder into `pocs/<JIRA-KEY>/` with `node scripts/irfp.mjs scaffold-poc --key <JIRA-KEY>`.

Then replace the placeholder UI with the approved task list and RFP specs.

- Map brief **UI direction** onto `app/globals.css` `:root` tokens and the layout shell. Do not reinstall Tailwind.
- Reuse `components/ui/` (Button, Input, Card, Badge, Alert, Skeleton, EmptyState, PageHeader). Extend only if the plan names more (Select, Modal, table).
- `npm install` then `npm test` (Vitest) then `npm run dev`
- Local or fake data only
- No clickable `http(s)` links in UI or markdown
- System fonts only — no `next/font/google`, no CDNs
