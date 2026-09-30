/** Frozen scaffold `:root` — keep for Vitest. Do not ship as the product theme. */
export const SCAFFOLD_THEME_TOKENS = {
  background: "#f6f6f6",
  foreground: "#111111",
  muted: "#6b7280",
  border: "#e5e7eb",
  primary: "#1f2937",
  primaryForeground: "#ffffff",
  card: "#ffffff",
  cardForeground: "#111111",
  radius: "0.5rem",
} as const;

/**
 * Product tokens. Must match `app/globals.css` `:root` and differ from SCAFFOLD_THEME_TOKENS
 * (see `lib/theme-wiring.test.ts`).
 */
export const THEME_TOKENS = { ...SCAFFOLD_THEME_TOKENS };
