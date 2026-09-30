import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, beforeEach } from "vitest";
import { HOME_SIGNATURE, HARVEST_TABLE_TOKENS, SCAFFOLD_DEFAULTS } from "./theme";
import { SHARE_SHELL_MARKER } from "./share";
import {
  attemptFollowWithoutSession,
  attemptPublishWithoutSession,
  canEditRecipe,
  followCook,
  getCook,
  getEmailNotifications,
  getFeedRecipes,
  getRecipe,
  harvestTableTokensDifferFromScaffold,
  listRecipes,
  parseRecipeForm,
  publishRecipe,
  registerCook,
  resetStoreForTests,
  searchRecipes,
  setCurrentUserId,
  signInCook,
  unfollowCook,
  updateRecipe,
  validateRecipeInput,
} from "./store";

describe("Harvest Table theme", () => {
  it("defines tokens that differ from scaffold defaults", () => {
    expect(harvestTableTokensDifferFromScaffold()).toBe(true);
    expect(HARVEST_TABLE_TOKENS.background).not.toBe(SCAFFOLD_DEFAULTS.background);
    expect(HARVEST_TABLE_TOKENS.primary).not.toBe(SCAFFOLD_DEFAULTS.primary);
    expect(HARVEST_TABLE_TOKENS.muted).not.toBe(SCAFFOLD_DEFAULTS.muted);
    expect(HARVEST_TABLE_TOKENS.card).not.toBe(SCAFFOLD_DEFAULTS.card);
    expect(HARVEST_TABLE_TOKENS.accent).toBeDefined();
  });

  it("maps Harvest Table palette into globals.css", () => {
    const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
    expect(css).toContain("--background: #f4efe4");
    expect(css).toContain("--primary: #5f7a61");
    expect(css).toContain("--accent: #c4704e");
    expect(css).toContain(".font-display");
  });

  it("exposes home feed signature pattern markers", () => {
    expect(HOME_SIGNATURE.serifTitleClass).toBe("font-display");
    expect(HOME_SIGNATURE.metadataAccentClass).toBe("text-accent");
    expect(HOME_SIGNATURE.primaryButtonVariant).toBe("primary");
  });
});

describe("fixtures and loader", () => {
  beforeEach(() => resetStoreForTests());

  it("returns recipes with required fields", () => {
    const recipe = getRecipe("recipe-1");
    expect(recipe).toBeDefined();
    expect(recipe?.title).toBeTruthy();
    expect(recipe?.servings).toBeGreaterThan(0);
    expect(recipe?.timeMinutes).toBeGreaterThan(0);
    expect(recipe?.ingredients.length).toBeGreaterThan(0);
    expect(recipe?.steps.length).toBeGreaterThan(0);
    expect(recipe?.tags.length).toBeGreaterThan(0);
    expect(recipe?.authorId).toBeTruthy();
  });
});

describe("demo auth", () => {
  beforeEach(() => resetStoreForTests());

  it("requires sign-in to publish", () => {
    const input = {
      title: "Test",
      servings: 2,
      timeMinutes: 10,
      ingredients: ["salt"],
      steps: ["Mix"],
      tags: [],
    };
    expect(attemptPublishWithoutSession(input)).toBe(false);
    signInCook("mara.whitfield@example.cook");
    expect(publishRecipe("cook-mara", input).title).toBe("Test");
  });

  it("requires sign-in to follow", () => {
    expect(attemptFollowWithoutSession("cook-jules")).toBe(false);
    signInCook("demo.follower@example.cook");
    expect(attemptFollowWithoutSession("cook-sage")).toBe(true);
  });

  it("registers and signs in a new demo cook", () => {
    const cook = registerCook("New Demo", "new.demo@example.cook");
    expect(cook.displayName).toBe("New Demo");
    expect(signInCook("new.demo@example.cook")?.id).toBe(cook.id);
  });
});

describe("home feed", () => {
  beforeEach(() => resetStoreForTests());

  it("shows only recipes from followed cooks", () => {
    setCurrentUserId("cook-demo");
    const feed = getFeedRecipes("cook-demo");
    const authorIds = new Set(feed.map((r) => r.authorId));
    expect(authorIds.has("cook-mara")).toBe(true);
    expect(authorIds.has("cook-jules")).toBe(true);
    expect(authorIds.has("cook-sage")).toBe(false);
    unfollowCook("cook-demo", "cook-jules");
    const after = getFeedRecipes("cook-demo");
    expect(after.every((r) => r.authorId !== "cook-jules")).toBe(true);
  });
});

describe("recipe content", () => {
  beforeEach(() => resetStoreForTests());

  it("loads ingredients and numbered steps for cooking layout", () => {
    const recipe = getRecipe("recipe-1");
    expect(recipe?.ingredients).toContain("eggs");
    expect(recipe?.steps.length).toBeGreaterThanOrEqual(2);
  });
});

describe("recipe forms", () => {
  beforeEach(() => resetStoreForTests());

  it("parses all RFP fields into a recipe object", () => {
    const input = parseRecipeForm({
      title: "Garden Salad",
      servings: "3",
      timeMinutes: "15",
      ingredients: "lettuce\ntomato",
      steps: "Wash greens\nToss and serve",
      tags: "salad, fresh",
      photoSubtitle: "Summer bowl",
    });
    expect(validateRecipeInput(input)).toHaveLength(0);
    expect(input.title).toBe("Garden Salad");
    expect(input.ingredients).toEqual(["lettuce", "tomato"]);
    expect(input.steps).toHaveLength(2);
    expect(input.tags).toEqual(["salad", "fresh"]);
  });
});

describe("author-only edit", () => {
  beforeEach(() => resetStoreForTests());

  it("rejects edit when current user is not the author", () => {
    setCurrentUserId("cook-demo");
    expect(canEditRecipe("cook-demo", "recipe-1")).toBe(false);
    setCurrentUserId("cook-mara");
    expect(canEditRecipe("cook-mara", "recipe-1")).toBe(true);
    expect(() =>
      updateRecipe("cook-demo", "recipe-1", {
        title: "Nope",
        servings: 1,
        timeMinutes: 1,
        ingredients: ["x"],
        steps: ["y"],
        tags: [],
      }),
    ).toThrow();
  });
});

describe("follow and feed", () => {
  beforeEach(() => resetStoreForTests());

  it("updates feed when unfollowing on profile", () => {
    setCurrentUserId("cook-demo");
    expect(getFeedRecipes("cook-demo").some((r) => r.authorId === "cook-mara")).toBe(true);
    unfollowCook("cook-demo", "cook-mara");
    expect(getFeedRecipes("cook-demo").some((r) => r.authorId === "cook-mara")).toBe(false);
  });
});

describe("search", () => {
  beforeEach(() => resetStoreForTests());

  it("matches title, ingredient, and tag cases", () => {
    expect(searchRecipes("Frittata").some((r) => r.id === "recipe-1")).toBe(true);
    expect(searchRecipes("basil").some((r) => r.id === "recipe-1")).toBe(true);
    expect(searchRecipes("brunch").some((r) => r.id === "recipe-1")).toBe(true);
  });
});

describe("public share route contract", () => {
  it("uses minimal shell marker without feed nav", () => {
    expect(SHARE_SHELL_MARKER).toBe("share-minimal-shell");
  });
});

describe("publish email demo log", () => {
  beforeEach(() => resetStoreForTests());

  it("logs fictional follower addresses when a followed cook publishes", () => {
    setCurrentUserId("cook-mara");
    const before = getEmailNotifications().length;
    publishRecipe("cook-mara", {
      title: "Fresh Publish",
      servings: 2,
      timeMinutes: 20,
      ingredients: ["water"],
      steps: ["Boil"],
      tags: ["demo"],
    });
    const entries = getEmailNotifications();
    expect(entries.length).toBeGreaterThan(before);
    expect(entries.some((e) => e.followerEmail.includes("demo.follower"))).toBe(true);
    expect(entries.some((e) => e.recipeTitle === "Fresh Publish")).toBe(true);
  });
});

describe("store sanity", () => {
  beforeEach(() => resetStoreForTests());

  it("lists seeded recipes and cooks", () => {
    expect(listRecipes().length).toBeGreaterThan(0);
    expect(getCook("cook-mara")?.displayName).toContain("Mara");
  });
});
