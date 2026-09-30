import { describe, expect, it, beforeEach } from "vitest";
import {
  createRecipe,
  getDefaultActorId,
  getFeedRecipes,
  getNotifications,
  getRecipe,
  isAuthor,
  isFollowing,
  resetStoreForTests,
  searchRecipes,
  setActiveActorId,
  toggleFollow,
} from "./store";

describe("store", () => {
  beforeEach(() => {
    resetStoreForTests();
  });

  it("sets default demo actor without sign-in", () => {
    expect(getDefaultActorId()).toBe("actor-elena");
    const feed = getFeedRecipes();
    expect(feed.length).toBeGreaterThan(0);
  });

  it("feed and publish work for default actor", () => {
    const created = createRecipe(
      {
        title: "Quick Weeknight Pasta",
        servings: 2,
        timeMinutes: 20,
        ingredients: ["pasta", "garlic", "olive oil", "parsley", "salt", "pepper", "parmesan", "lemon"],
        steps: ["Boil water", "Cook pasta", "Sauté garlic", "Toss", "Serve"],
      },
      getDefaultActorId(),
    );
    expect(getRecipe(created.id)?.authorId).toBe("actor-elena");
  });

  it("persona switch changes author on new recipe", () => {
    setActiveActorId("actor-maya");
    const recipe = createRecipe(
      {
        title: "Maya's Test Bowl",
        servings: 4,
        timeMinutes: 30,
        ingredients: ["rice", "beans", "onion", "cilantro", "lime", "oil", "salt", "pepper"],
        steps: ["Prep", "Cook rice", "Warm beans", "Assemble", "Garnish"],
      },
      "actor-maya",
    );
    expect(recipe.authorId).toBe("actor-maya");
  });

  it("search matches title and ingredient", () => {
    expect(searchRecipes("focaccia", "title").some((r) => r.id === "recipe-sourdough-focaccia")).toBe(true);
    expect(searchRecipes("miso", "ingredient").some((r) => r.id === "recipe-miso-salmon")).toBe(true);
  });

  it("follow toggle updates state", () => {
    const actorId = getDefaultActorId();
    expect(isFollowing(actorId, "actor-maya")).toBe(true);
    toggleFollow(actorId, "actor-maya");
    expect(isFollowing(actorId, "actor-maya")).toBe(false);
    const feed = getFeedRecipes(actorId);
    expect(feed.every((r) => r.authorId !== "actor-maya")).toBe(true);
  });

  it("isAuthor gates edit to active actor recipes", () => {
    expect(isAuthor("actor-elena", "recipe-mole-coloradito")).toBe(true);
    expect(isAuthor("actor-maya", "recipe-mole-coloradito")).toBe(false);
  });

  it("email stub notifies followers when cook publishes", () => {
    resetStoreForTests();
    setActiveActorId("actor-maya");
    createRecipe(
      {
        title: "New From Maya",
        servings: 4,
        timeMinutes: 40,
        ingredients: ["a", "b", "c", "d", "e", "f", "g", "h"],
        steps: ["1", "2", "3", "4", "5"],
      },
      "actor-maya",
    );
    const notes = getNotifications("actor-elena");
    expect(notes.some((n) => n.recipeTitle === "New From Maya")).toBe(true);
  });

  it("stores photoDataUrl on create", () => {
    const dataUrl = "data:image/png;base64,abc";
    const recipe = createRecipe(
      {
        title: "With Photo",
        servings: 2,
        timeMinutes: 10,
        ingredients: ["a", "b", "c", "d", "e", "f", "g", "h"],
        steps: ["1", "2", "3", "4", "5"],
        photoDataUrl: dataUrl,
      },
      getDefaultActorId(),
    );
    expect(getRecipe(recipe.id)?.photoDataUrl).toBe(dataUrl);
  });
});
