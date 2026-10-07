import { describe, expect, it } from "vitest";
import { COOKS, INITIAL_RECIPES } from "./fixtures";

describe("fixtures", () => {
  it("uses realistic copy without Lorem or Test User", () => {
    const blob = JSON.stringify({ COOKS, INITIAL_RECIPES });
    expect(blob.toLowerCase()).not.toContain("lorem");
    expect(blob).not.toContain("Test User");
  });

  it("recipes have required fields and step/ingredient counts", () => {
    for (const recipe of INITIAL_RECIPES) {
      expect(recipe.title.length).toBeGreaterThan(3);
      expect(recipe.ingredients.length).toBeGreaterThanOrEqual(8);
      expect(recipe.steps.length).toBeGreaterThanOrEqual(5);
      expect(recipe.authorId).toBeTruthy();
    }
  });
});
