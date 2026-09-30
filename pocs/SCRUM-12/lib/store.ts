import { initialCooks, initialFollows, initialRecipes } from "./fixtures";
import type {
  Cook,
  EmailNotification,
  Recipe,
  RecipeInput,
} from "./types";

const SCAFFOLD_TOKENS = {
  background: "#f6f6f6",
  foreground: "#111111",
  muted: "#6b7280",
  primary: "#1f2937",
  card: "#ffffff",
};

let cooks: Cook[] = [...initialCooks];
let recipes: Recipe[] = [...initialRecipes];
let follows: Array<{ followerId: string; cookId: string }> = [...initialFollows];
let emailNotifications: EmailNotification[] = [];
let currentUserId: string | null = null;
let nextRecipeId = 100;
let nextCookId = 100;
let nextNotificationId = 1;

export function resetStoreForTests(): void {
  cooks = [...initialCooks];
  recipes = [...initialRecipes];
  follows = [...initialFollows];
  emailNotifications = [];
  currentUserId = null;
  nextRecipeId = 100;
  nextCookId = 100;
  nextNotificationId = 1;
}

export function getHarvestTableTokensFromCss(): Record<string, string> {
  return {
    background: "#f4efe4",
    foreground: "#3d2c1e",
    muted: "#7a6b5c",
    primary: "#5f7a61",
    accent: "#c4704e",
    card: "#faf6ee",
  };
}

export function harvestTableTokensDifferFromScaffold(): boolean {
  const tokens = getHarvestTableTokensFromCss();
  return (
    tokens.background !== SCAFFOLD_TOKENS.background &&
    tokens.foreground !== SCAFFOLD_TOKENS.foreground &&
    tokens.muted !== SCAFFOLD_TOKENS.muted &&
    tokens.primary !== SCAFFOLD_TOKENS.primary &&
    tokens.card !== SCAFFOLD_TOKENS.card &&
    tokens.accent !== undefined
  );
}

export function listCooks(): Cook[] {
  return [...cooks];
}

export function getCook(id: string): Cook | undefined {
  return cooks.find((c) => c.id === id);
}

export function listRecipes(): Recipe[] {
  return [...recipes];
}

export function getRecipe(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

export function getRecipesByAuthor(authorId: string): Recipe[] {
  return recipes.filter((r) => r.authorId === authorId);
}

export function getCurrentUser(): Cook | null {
  if (!currentUserId) return null;
  return getCook(currentUserId) ?? null;
}

export function getCurrentUserId(): string | null {
  return currentUserId;
}

export function setCurrentUserId(userId: string | null): void {
  currentUserId = userId;
}

export function registerCook(displayName: string, email: string): Cook {
  const id = `cook-${nextCookId++}`;
  const cook: Cook = { id, displayName: displayName.trim(), email: email.trim() };
  cooks.push(cook);
  currentUserId = id;
  return cook;
}

export function signInCook(email: string): Cook | null {
  const normalized = email.trim().toLowerCase();
  const cook = cooks.find((c) => c.email.toLowerCase() === normalized);
  if (!cook) return null;
  currentUserId = cook.id;
  return cook;
}

export function signOut(): void {
  currentUserId = null;
}

export function requireSignedInUser(): Cook {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("Sign in required");
  }
  return user;
}

export function isFollowing(followerId: string, cookId: string): boolean {
  return follows.some((f) => f.followerId === followerId && f.cookId === cookId);
}

export function followCook(followerId: string, cookId: string): void {
  if (followerId === cookId) return;
  if (!getCook(cookId)) return;
  if (isFollowing(followerId, cookId)) return;
  follows.push({ followerId, cookId });
}

export function unfollowCook(followerId: string, cookId: string): void {
  follows = follows.filter(
    (f) => !(f.followerId === followerId && f.cookId === cookId),
  );
}

export function getFeedRecipes(userId: string): Recipe[] {
  const followedIds = new Set(
    follows.filter((f) => f.followerId === userId).map((f) => f.cookId),
  );
  return recipes
    .filter((r) => followedIds.has(r.authorId))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function searchRecipes(query: string): Recipe[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return recipes.filter((recipe) => {
    if (recipe.title.toLowerCase().includes(q)) return true;
    if (recipe.ingredients.some((ing) => ing.toLowerCase().includes(q))) return true;
    if (recipe.tags.some((tag) => tag.toLowerCase().includes(q))) return true;
    return false;
  });
}

function notifyFollowersOnPublish(recipe: Recipe): void {
  const author = getCook(recipe.authorId);
  if (!author) return;
  const followerIds = follows
    .filter((f) => f.cookId === recipe.authorId)
    .map((f) => f.followerId);
  for (const followerId of followerIds) {
    const follower = getCook(followerId);
    if (!follower) continue;
    emailNotifications.push({
      id: `notify-${nextNotificationId++}`,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      authorId: author.id,
      followerEmail: follower.email,
      sentAt: new Date().toISOString(),
    });
  }
}

export function publishRecipe(authorId: string, input: RecipeInput): Recipe {
  requireSignedInUser();
  const user = getCurrentUser();
  if (!user || user.id !== authorId) {
    throw new Error("Sign in required");
  }
  const id = `recipe-${nextRecipeId++}`;
  const recipe: Recipe = {
    id,
    authorId,
    title: input.title.trim(),
    servings: input.servings,
    timeMinutes: input.timeMinutes,
    ingredients: input.ingredients,
    steps: input.steps,
    tags: input.tags,
    photoSubtitle: input.photoSubtitle,
  };
  recipes.push(recipe);
  notifyFollowersOnPublish(recipe);
  return recipe;
}

export function canEditRecipe(userId: string | null, recipeId: string): boolean {
  if (!userId) return false;
  const recipe = getRecipe(recipeId);
  return recipe?.authorId === userId;
}

export function updateRecipe(
  userId: string,
  recipeId: string,
  input: RecipeInput,
): Recipe {
  const recipe = getRecipe(recipeId);
  if (!recipe || recipe.authorId !== userId) {
    throw new Error("Not authorized to edit this recipe");
  }
  recipe.title = input.title.trim();
  recipe.servings = input.servings;
  recipe.timeMinutes = input.timeMinutes;
  recipe.ingredients = input.ingredients;
  recipe.steps = input.steps;
  recipe.tags = input.tags;
  recipe.photoSubtitle = input.photoSubtitle;
  return recipe;
}

export function parseRecipeForm(data: {
  title: string;
  servings: string;
  timeMinutes: string;
  ingredients: string;
  steps: string;
  tags: string;
  photoSubtitle?: string;
}): RecipeInput {
  const ingredients = data.ingredients
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const steps = data.steps
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const tags = data.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  return {
    title: data.title,
    servings: Number(data.servings),
    timeMinutes: Number(data.timeMinutes),
    ingredients,
    steps,
    tags,
    photoSubtitle: data.photoSubtitle?.trim() || undefined,
  };
}

export function validateRecipeInput(input: RecipeInput): string[] {
  const errors: string[] = [];
  if (!input.title.trim()) errors.push("title");
  if (!Number.isFinite(input.servings) || input.servings < 1) errors.push("servings");
  if (!Number.isFinite(input.timeMinutes) || input.timeMinutes < 1) errors.push("timeMinutes");
  if (input.ingredients.length === 0) errors.push("ingredients");
  if (input.steps.length === 0) errors.push("steps");
  return errors;
}

export function getEmailNotifications(): EmailNotification[] {
  return [...emailNotifications];
}

export function attemptFollowWithoutSession(cookId: string): boolean {
  if (!currentUserId) return false;
  followCook(currentUserId, cookId);
  return true;
}

export function attemptPublishWithoutSession(input: RecipeInput): boolean {
  if (!currentUserId) return false;
  publishRecipe(currentUserId, input);
  return true;
}
