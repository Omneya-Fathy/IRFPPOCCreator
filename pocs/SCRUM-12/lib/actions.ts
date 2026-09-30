import { cookies } from "next/headers";
import {
  followCook,
  getCurrentUser,
  publishRecipe,
  registerCook,
  setCurrentUserId,
  signInCook,
  signOut,
  unfollowCook,
  updateRecipe,
  parseRecipeForm,
  validateRecipeInput,
} from "./store";
import type { RecipeInput } from "./types";

const SESSION_COOKIE = "recipiehub-session";

export async function loadSessionFromCookie(): Promise<void> {
  const cookieStore = await cookies();
  const id = cookieStore.get(SESSION_COOKIE)?.value ?? null;
  setCurrentUserId(id);
}

async function persistSession(userId: string | null): Promise<void> {
  const cookieStore = await cookies();
  if (userId) {
    cookieStore.set(SESSION_COOKIE, userId, { path: "/", httpOnly: true });
  } else {
    cookieStore.delete(SESSION_COOKIE);
  }
}

export async function registerAction(formData: FormData) {
  await loadSessionFromCookie();
  const displayName = String(formData.get("displayName") ?? "");
  const email = String(formData.get("email") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/");
  const cook = registerCook(displayName, email);
  await persistSession(cook.id);
  return { ok: true as const, redirectTo };
}

export async function signInAction(formData: FormData) {
  await loadSessionFromCookie();
  const email = String(formData.get("email") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/");
  const cook = signInCook(email);
  if (!cook) {
    return { ok: false as const, error: "No cook found with that email. Register first." };
  }
  await persistSession(cook.id);
  return { ok: true as const, redirectTo };
}

export async function signOutAction() {
  await loadSessionFromCookie();
  signOut();
  await persistSession(null);
}

export async function followAction(cookId: string) {
  await loadSessionFromCookie();
  const user = getCurrentUser();
  if (!user) {
    return { ok: false as const, error: "Sign in to follow cooks." };
  }
  followCook(user.id, cookId);
  return { ok: true as const };
}

export async function unfollowAction(cookId: string) {
  await loadSessionFromCookie();
  const user = getCurrentUser();
  if (!user) {
    return { ok: false as const, error: "Sign in to manage follows." };
  }
  unfollowCook(user.id, cookId);
  return { ok: true as const };
}

function recipeInputFromFormData(formData: FormData): RecipeInput {
  return parseRecipeForm({
    title: String(formData.get("title") ?? ""),
    servings: String(formData.get("servings") ?? ""),
    timeMinutes: String(formData.get("timeMinutes") ?? ""),
    ingredients: String(formData.get("ingredients") ?? ""),
    steps: String(formData.get("steps") ?? ""),
    tags: String(formData.get("tags") ?? ""),
    photoSubtitle: String(formData.get("photoSubtitle") ?? ""),
  });
}

export async function createRecipeAction(formData: FormData) {
  await loadSessionFromCookie();
  const user = getCurrentUser();
  if (!user) {
    return { ok: false as const, error: "Sign in to publish recipes." };
  }
  const input = recipeInputFromFormData(formData);
  const errors = validateRecipeInput(input);
  if (errors.length > 0) {
    return { ok: false as const, error: "Complete all required fields.", fields: errors };
  }
  const recipe = publishRecipe(user.id, input);
  return { ok: true as const, recipeId: recipe.id };
}

export async function updateRecipeAction(recipeId: string, formData: FormData) {
  await loadSessionFromCookie();
  const user = getCurrentUser();
  if (!user) {
    return { ok: false as const, error: "Sign in to edit recipes." };
  }
  const input = recipeInputFromFormData(formData);
  const errors = validateRecipeInput(input);
  if (errors.length > 0) {
    return { ok: false as const, error: "Complete all required fields.", fields: errors };
  }
  try {
    updateRecipe(user.id, recipeId, input);
    return { ok: true as const, recipeId };
  } catch {
    return { ok: false as const, error: "You can only edit your own recipes." };
  }
}
