"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActor } from "@/components/actor-provider";
import { createRecipe, updateRecipe } from "@/lib/store";
import type { Recipe } from "@/lib/types";

type RecipeFormProps = {
  mode: "create" | "edit";
  initial?: Recipe;
};

function linesFromTextarea(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function RecipeForm({ mode, initial }: RecipeFormProps) {
  const router = useRouter();
  const { actor } = useActor();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [servings, setServings] = useState(String(initial?.servings ?? 4));
  const [timeMinutes, setTimeMinutes] = useState(String(initial?.timeMinutes ?? 45));
  const [ingredientsText, setIngredientsText] = useState(initial?.ingredients.join("\n") ?? "");
  const [stepsText, setStepsText] = useState(initial?.steps.join("\n") ?? "");
  const [tagsText, setTagsText] = useState(initial?.tags?.join(", ") ?? "");
  const [photoDataUrl, setPhotoDataUrl] = useState(initial?.photoDataUrl);
  const [error, setError] = useState<string | null>(null);

  const onPhotoChange = (file: File | null) => {
    if (!file) {
      setPhotoDataUrl(undefined);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPhotoDataUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload = {
      title,
      servings: Number(servings) || 1,
      timeMinutes: Number(timeMinutes) || 1,
      ingredients: linesFromTextarea(ingredientsText),
      steps: linesFromTextarea(stepsText),
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      photoDataUrl,
    };

    if (!payload.title || payload.ingredients.length < 1 || payload.steps.length < 1) {
      setError("Add a title, at least one ingredient, and one step.");
      return;
    }

    if (mode === "edit" && initial) {
      const updated = updateRecipe(initial.id, payload, actor.id);
      if (!updated) {
        setError("You can only edit your own recipes.");
        return;
      }
      router.push(`/recipes/${updated.id}`);
      return;
    }

    const created = createRecipe(payload, actor.id);
    router.push(`/recipes/${created.id}`);
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="title">Title</label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="servings">Servings</label>
          <Input
            id="servings"
            type="number"
            min={1}
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="time">Time (minutes)</label>
          <Input
            id="time"
            type="number"
            min={1}
            value={timeMinutes}
            onChange={(e) => setTimeMinutes(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="photo">Photo</label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          className="block w-full text-sm text-muted file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-2 file:text-primary-foreground"
          onChange={(e) => onPhotoChange(e.target.files?.[0] ?? null)}
        />
        {photoDataUrl ? (
          <img src={photoDataUrl} alt="Upload preview" className="mt-2 h-32 w-auto rounded border border-border object-cover" />
        ) : null}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="ingredients">Ingredients (one per line)</label>
        <textarea
          id="ingredients"
          className="min-h-[140px] w-full rounded border border-border bg-card px-3 py-2 text-sm"
          value={ingredientsText}
          onChange={(e) => setIngredientsText(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="steps">Steps (one per line)</label>
        <textarea
          id="steps"
          className="min-h-[140px] w-full rounded border border-border bg-card px-3 py-2 text-sm"
          value={stepsText}
          onChange={(e) => setStepsText(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="tags">Tags (comma-separated)</label>
        <Input id="tags" value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
      </div>
      {error ? <p className="text-sm text-accent" role="alert">{error}</p> : null}
      <Button type="submit" variant="primary">
        {mode === "edit" ? "Save recipe" : "Publish recipe"}
      </Button>
    </form>
  );
}
