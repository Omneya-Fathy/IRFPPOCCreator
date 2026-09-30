import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TypographicCover } from "@/components/ui/typographic-cover";
import { recipeCoverSubtitle } from "@/components/recipe-cover";
import { getRecipe } from "./store";

describe("TypographicCover", () => {
  it("renders title and subtitle when no photoDataUrl", () => {
    const recipe = getRecipe("recipe-miso-salmon");
    expect(recipe).toBeDefined();
    expect(recipe?.photoDataUrl).toBeUndefined();
    const subtitle = recipeCoverSubtitle(recipe!);
    const html = renderToStaticMarkup(
      <TypographicCover title={recipe!.title} subtitle={subtitle} />,
    );
    expect(html).toContain(recipe!.title);
    expect(html).toContain("servings");
  });
});
