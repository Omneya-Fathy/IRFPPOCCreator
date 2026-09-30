"use client";

import { useActionState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Recipe } from "@/lib/types";

type FormState = { error?: string; success?: string };

function defaultRecipeToFields(recipe?: Recipe) {
  if (!recipe) {
    return {
      title: "",
      photoSubtitle: "",
      servings: "4",
      timeMinutes: "30",
      ingredients: "",
      steps: "",
      tags: "",
    };
  }
  return {
    title: recipe.title,
    photoSubtitle: recipe.photoSubtitle ?? "",
    servings: String(recipe.servings),
    timeMinutes: String(recipe.timeMinutes),
    ingredients: recipe.ingredients.join("\n"),
    steps: recipe.steps.join("\n"),
    tags: recipe.tags.join(", "),
  };
}

export function RecipeForm({
  recipe,
  action,
  submitLabel,
}: {
  recipe?: Recipe;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
}) {
  const fields = defaultRecipeToFields(recipe);
  const [state, formAction, pending] = useActionState(action, {} as FormState);

  return (
    <form action={formAction} className="mx-auto max-w-xl space-y-4">
      {state.error ? (
        <Alert tone="error">{state.error}</Alert>
      ) : null}
      {state.success ? (
        <Alert tone="success">{state.success}</Alert>
      ) : null}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="title">
          Title
        </label>
        <Input id="title" name="title" required defaultValue={fields.title} />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="photoSubtitle">
          Photo cover subtitle
        </label>
        <Input
          id="photoSubtitle"
          name="photoSubtitle"
          defaultValue={fields.photoSubtitle}
          placeholder="Short line for typographic cover"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="servings">
            Servings
          </label>
          <Input
            id="servings"
            name="servings"
            type="number"
            min={1}
            required
            defaultValue={fields.servings}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="timeMinutes">
            Time (minutes)
          </label>
          <Input
            id="timeMinutes"
            name="timeMinutes"
            type="number"
            min={1}
            required
            defaultValue={fields.timeMinutes}
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="ingredients">
          Ingredients (one per line)
        </label>
        <Textarea id="ingredients" name="ingredients" required defaultValue={fields.ingredients} />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="steps">
          Steps (one per line, numbered in display)
        </label>
        <Textarea id="steps" name="steps" required defaultValue={fields.steps} />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="tags">
          Tags (optional, comma-separated)
        </label>
        <Input id="tags" name="tags" defaultValue={fields.tags} />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
