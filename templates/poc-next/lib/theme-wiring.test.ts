import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SCAFFOLD_THEME_TOKENS, THEME_TOKENS } from "./theme-tokens";

describe("theme wiring", () => {
  it("wires Tailwind (root layout import + layers) and retokenizes away from scaffold", () => {
    const layout = readFileSync(resolve(__dirname, "../app/layout.tsx"), "utf8");
    const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");

    expect(layout).toMatch(/import\s+["']\.\/globals\.css["']/);
    expect(css).toMatch(/@tailwind\s+base\b/);
    expect(css).toMatch(/@tailwind\s+components\b/);
    expect(css).toMatch(/@tailwind\s+utilities\b/);

    expect(css).toContain(`--background: ${THEME_TOKENS.background}`);
    expect(css).toContain(`--primary: ${THEME_TOKENS.primary}`);
    expect(css).toContain(`--muted: ${THEME_TOKENS.muted}`);
    expect(css).toContain(`--card: ${THEME_TOKENS.card}`);

    expect(THEME_TOKENS.primary).not.toBe(SCAFFOLD_THEME_TOKENS.primary);
    expect(THEME_TOKENS.background).not.toBe(SCAFFOLD_THEME_TOKENS.background);
  });
});
