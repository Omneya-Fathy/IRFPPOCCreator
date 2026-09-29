import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { THEME_TOKENS } from "./theme-tokens";

const SCAFFOLD_DEFAULTS = {
  background: "#f6f6f6",
  primary: "#1f2937",
  muted: "#6b7280",
  card: "#ffffff",
};

describe("theme tokens", () => {
  it("maps Modern SaaS + Premium tokens in globals.css", () => {
    const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");
    expect(css).toContain(`--background: ${THEME_TOKENS.background}`);
    expect(css).toContain(`--primary: ${THEME_TOKENS.primary}`);
    expect(css).toContain(`--muted: ${THEME_TOKENS.muted}`);
    expect(css).toContain(`--card: ${THEME_TOKENS.card}`);
    expect(css).toContain(`--radius: ${THEME_TOKENS.radius}`);
  });

  it("differs from scaffold defaults", () => {
    expect(THEME_TOKENS.background).not.toBe(SCAFFOLD_DEFAULTS.background);
    expect(THEME_TOKENS.primary).not.toBe(SCAFFOLD_DEFAULTS.primary);
    expect(THEME_TOKENS.muted).not.toBe(SCAFFOLD_DEFAULTS.muted);
    expect(THEME_TOKENS.card).not.toBe(SCAFFOLD_DEFAULTS.card);
  });
});
