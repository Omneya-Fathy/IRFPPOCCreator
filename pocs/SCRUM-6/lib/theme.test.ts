import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { THEME_TOKENS } from "./theme-tokens";

describe("theme tokens", () => {
  it("maps Approachable + Premium tokens in globals.css", () => {
    const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");
    expect(css).toContain(`--background: ${THEME_TOKENS.background}`);
    expect(css).toContain(`--primary: ${THEME_TOKENS.primary}`);
    expect(css).toContain(`--muted: ${THEME_TOKENS.muted}`);
    expect(css).toContain(`--card: ${THEME_TOKENS.card}`);
    expect(css).toContain(`--radius: ${THEME_TOKENS.radius}`);
  });
});
