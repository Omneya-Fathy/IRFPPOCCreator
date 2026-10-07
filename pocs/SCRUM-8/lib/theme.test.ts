import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SCAFFOLD_DEFAULTS, THEME_TOKENS } from "./theme-tokens";

describe("Harvest Table theme", () => {
  it("maps tokens in globals.css and differs from scaffold defaults", () => {
    const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");
    expect(css).toContain(`--background: ${THEME_TOKENS.background}`);
    expect(css).toContain(`--primary: ${THEME_TOKENS.primary}`);
    expect(css).toContain(`--muted: ${THEME_TOKENS.muted}`);
    expect(css).toContain(`--card: ${THEME_TOKENS.card}`);
    expect(THEME_TOKENS.primary).not.toBe(SCAFFOLD_DEFAULTS.primary);
    expect(THEME_TOKENS.background).not.toBe(SCAFFOLD_DEFAULTS.background);
    expect(THEME_TOKENS.muted).not.toBe(SCAFFOLD_DEFAULTS.muted);
    expect(THEME_TOKENS.card).not.toBe(SCAFFOLD_DEFAULTS.card);
  });

  it("root layout imports globals.css", () => {
    const layout = readFileSync(resolve(__dirname, "../app/layout.tsx"), "utf8");
    expect(layout).toContain('import "./globals.css"');
  });
});
