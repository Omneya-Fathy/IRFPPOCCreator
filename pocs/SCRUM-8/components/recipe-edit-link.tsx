"use client";

import Link from "next/link";
import { useActor } from "@/components/actor-provider";
import { isAuthor } from "@/lib/store";

export function RecipeEditLink({ recipeId }: { recipeId: string }) {
  const { actor } = useActor();
  if (!isAuthor(actor.id, recipeId)) return null;

  return (
    <Link
      href={`/recipes/${recipeId}/edit`}
      className="text-sm font-medium text-primary underline-offset-2 hover:underline"
      data-testid="recipe-edit-link"
    >
      Edit recipe
    </Link>
  );
}
