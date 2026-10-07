# Hook: poc-tailwind-wired

Blocks App Router POCs saved without Tailwind wired.

- Events: `preToolUse` (Write / StrReplace / EditNotebook), `afterFileEdit`
- Script: `.cursor/hooks/poc-tailwind-wired.mjs`
- `failClosed`: true

Scans only `pocs/<KEY>/app/layout.tsx` and `pocs/<KEY>/app/globals.css`.

- Root layout must import `./globals.css`
- `globals.css` must keep `@tailwind` base, components, and utilities

Nested layouts are allowed. Token retokenize is Vitest (`lib/theme-wiring.test.ts`), not this hook.

```text
node scripts/hooks-selftest.mjs
```
