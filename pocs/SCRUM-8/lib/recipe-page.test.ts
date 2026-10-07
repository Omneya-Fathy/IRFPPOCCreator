import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("cook-from recipe page", () => {
  it("includes step rail and step list components", () => {
    const detail = readFileSync(resolve(__dirname, "../components/recipe-detail.tsx"), "utf8");
    const rail = readFileSync(resolve(__dirname, "../components/step-rail-list.tsx"), "utf8");
    expect(detail).toContain("StepRailList");
    expect(rail).toContain('data-testid="step-rail"');
    expect(rail).toContain("step-rail-active");
  });

  it("recipe cover branches on photoDataUrl", () => {
    const cover = readFileSync(resolve(__dirname, "../components/recipe-cover.tsx"), "utf8");
    expect(cover).toContain("photoDataUrl");
    expect(cover).toContain("TypographicCover");
  });
});
