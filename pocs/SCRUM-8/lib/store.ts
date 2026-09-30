import {
  COOKS,
  DEFAULT_ACTOR_ID,
  DEMO_ACTORS,
  INITIAL_FOLLOWS,
  INITIAL_RECIPES,
} from "./fixtures";
import type { Cook, DemoActor, EmailNotification, Recipe, RecipeInput } from "./types";

let recipes: Recipe[] = [...INITIAL_RECIPES];
let followsByActor: Map<string, Set<string>> = new Map();
let notifications: EmailNotification[] = [];
let activeActorId = DEFAULT_ACTOR_ID;
let idCounter = 0;
const listeners = new Set<() => void>();

export function subscribeStore(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitStoreChange() {
  listeners.forEach((fn) => fn());
}

function seedFollows() {
  followsByActor = new Map();
  for (const [actorId, cookIds] of Object.entries(INITIAL_FOLLOWS)) {
    followsByActor.set(actorId, new Set(cookIds));
  }
}

function ensureActorFollowSet(actorId: string): Set<string> {
  let set = followsByActor.get(actorId);
  if (!set) {
    set = new Set();
    followsByActor.set(actorId, set);
  }
  return set;
}

seedFollows();

export function resetStoreForTests() {
  recipes = [...INITIAL_RECIPES];
  notifications = [];
  activeActorId = DEFAULT_ACTOR_ID;
  idCounter = 0;
  seedFollows();
}

export function getDefaultActorId(): string {
  return DEFAULT_ACTOR_ID;
}

export function getActiveActorId(): string {
  return activeActorId;
}

export function setActiveActorId(actorId: string): DemoActor | undefined {
  const actor = DEMO_ACTORS.find((a) => a.id === actorId);
  if (!actor) return undefined;
  activeActorId = actorId;
  ensureActorFollowSet(actorId);
  emitStoreChange();
  return actor;
}

export function getActiveActor(): DemoActor {
  return DEMO_ACTORS.find((a) => a.id === activeActorId) ?? DEMO_ACTORS[0];
}

export function listDemoActors(): DemoActor[] {
  return [...DEMO_ACTORS];
}

export function getCook(id: string): Cook | undefined {
  return COOKS.find((c) => c.id === id);
}

export function listCooks(): Cook[] {
  return [...COOKS];
}

export function listRecipes(): Recipe[] {
  return [...recipes];
}

export function getRecipe(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

export function getRecipesByAuthor(authorId: string): Recipe[] {
  return recipes
    .filter((r) => r.authorId === authorId)
    .sort((a, b) => b.publishedAt - a.publishedAt);
}

export function getFeedRecipes(actorId: string = activeActorId): Recipe[] {
  const followed = followsByActor.get(actorId) ?? new Set();
  return recipes
    .filter((r) => followed.has(r.authorId))
    .sort((a, b) => b.publishedAt - a.publishedAt);
}

export function isFollowing(actorId: string, cookId: string): boolean {
  return followsByActor.get(actorId)?.has(cookId) ?? false;
}

export function toggleFollow(actorId: string, cookId: string): boolean {
  const set = ensureActorFollowSet(actorId);
  if (set.has(cookId)) {
    set.delete(cookId);
    emitStoreChange();
    return false;
  }
  set.add(cookId);
  emitStoreChange();
  return true;
}

export function isAuthor(actorId: string, recipeId: string): boolean {
  const recipe = getRecipe(recipeId);
  return recipe?.authorId === actorId;
}

function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function notifyFollowersOfPublish(author: DemoActor, recipe: Recipe) {
  for (const actor of DEMO_ACTORS) {
    if (actor.id === author.id) continue;
    if (!isFollowing(actor.id, author.id)) continue;
    notifications.push({
      id: nextId("notify"),
      actorId: actor.id,
      cookName: author.name,
      recipeTitle: recipe.title,
      createdAt: Date.now(),
    });
  }
}

export function createRecipe(input: RecipeInput, actorId: string = activeActorId): Recipe {
  const actor = DEMO_ACTORS.find((a) => a.id === actorId);
  if (!actor) throw new Error("Unknown actor");

  const recipe: Recipe = {
    id: nextId("recipe"),
    title: input.title.trim(),
    authorId: actorId,
    servings: input.servings,
    timeMinutes: input.timeMinutes,
    ingredients: input.ingredients.filter(Boolean),
    steps: input.steps.filter(Boolean),
    tags: input.tags?.filter(Boolean),
    photoDataUrl: input.photoDataUrl,
    publishedAt: Date.now(),
  };
  recipes = [recipe, ...recipes];
  notifyFollowersOfPublish(actor, recipe);
  emitStoreChange();
  return recipe;
}

export function updateRecipe(
  recipeId: string,
  input: RecipeInput,
  actorId: string = activeActorId,
): Recipe | undefined {
  const index = recipes.findIndex((r) => r.id === recipeId);
  if (index < 0) return undefined;
  if (recipes[index].authorId !== actorId) return undefined;

  const updated: Recipe = {
    ...recipes[index],
    title: input.title.trim(),
    servings: input.servings,
    timeMinutes: input.timeMinutes,
    ingredients: input.ingredients.filter(Boolean),
    steps: input.steps.filter(Boolean),
    tags: input.tags?.filter(Boolean),
    photoDataUrl: input.photoDataUrl ?? recipes[index].photoDataUrl,
    publishedAt: Date.now(),
  };
  recipes = [...recipes.slice(0, index), updated, ...recipes.slice(index + 1)];
  emitStoreChange();
  return updated;
}

export type SearchMode = "title" | "ingredient" | "all";

export function searchRecipes(
  query: string,
  mode: SearchMode = "all",
): Recipe[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return recipes.filter((recipe) => {
    const titleMatch = recipe.title.toLowerCase().includes(q);
    const ingredientMatch = recipe.ingredients.some((ing) =>
      ing.toLowerCase().includes(q),
    );
    if (mode === "title") return titleMatch;
    if (mode === "ingredient") return ingredientMatch;
    return titleMatch || ingredientMatch;
  });
}

export function getNotifications(actorId: string = activeActorId): EmailNotification[] {
  return notifications.filter((n) => n.actorId === actorId);
}

export function dismissNotification(notificationId: string, actorId: string = activeActorId) {
  notifications = notifications.filter(
    (n) => !(n.id === notificationId && n.actorId === actorId),
  );
  emitStoreChange();
}
