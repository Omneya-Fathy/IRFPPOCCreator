import type { Recipe } from "@/lib/types";
import type { Cook } from "@/lib/types";

export function RecipeMeta({
  servings,
  timeMinutes,
  className = "",
}: {
  servings: number;
  timeMinutes: number;
  className?: string;
}) {
  return (
    <p className={`text-sm text-accent ${className}`}>
      <span>Serves {servings}</span>
      <span aria-hidden="true"> · </span>
      <span>{timeMinutes} min</span>
    </p>
  );
}

export function RecipeAuthorLine({ cook }: { cook: Cook | undefined }) {
  if (!cook) return null;
  return <p className="text-sm text-muted">By {cook.displayName}</p>;
}

export function recipeHasCookingContent(recipe: Recipe): boolean {
  return recipe.ingredients.length > 0 && recipe.steps.length > 0;
}
