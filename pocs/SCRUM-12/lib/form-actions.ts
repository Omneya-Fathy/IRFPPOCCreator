"use server";

import { redirect } from "next/navigation";
import { createRecipeAction, updateRecipeAction } from "./actions";

type FormState = { error?: string; success?: string };

export async function createRecipeFormAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = await createRecipeAction(formData);
  if (!result.ok) {
    return { error: result.error };
  }
  redirect(`/recipes/${result.recipeId}`);
}

export async function updateRecipeFormAction(
  recipeId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = await updateRecipeAction(recipeId, formData);
  if (!result.ok) {
    return { error: result.error };
  }
  redirect(`/recipes/${result.recipeId}`);
}
