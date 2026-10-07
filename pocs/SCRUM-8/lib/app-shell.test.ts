import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("app shell", () => {
  it("includes RecipieHub wordmark and search entry", () => {
    const shell = readFileSync(resolve(__dirname, "../components/app-shell.tsx"), "utf8");
    expect(shell).toContain("RecipieHub");
    expect(shell).toContain("/search");
    expect(shell).toContain("/sign-in");
  });
});
