import { TypographicCover } from "@/components/ui/typographic-cover";
import type { Recipe } from "@/lib/types";
import { getCook } from "@/lib/store";

type RecipeCoverProps = {
  recipe: Recipe;
  className?: string;
  compact?: boolean;
};

export function recipeCoverSubtitle(recipe: Recipe): string {
  const cook = getCook(recipe.authorId);
  const parts = [`${recipe.servings} servings`, `${recipe.timeMinutes} min`];
  if (cook) parts.push(cook.name);
  return parts.join(" · ");
}

export function RecipeCover({ recipe, className = "", compact = false }: RecipeCoverProps) {
  if (recipe.photoDataUrl) {
    return (
      <img
        src={recipe.photoDataUrl}
        alt={recipe.title}
        className={`w-full object-cover ${compact ? "aspect-[4/3] max-h-40" : "aspect-[16/10]"} ${className}`}
      />
    );
  }

  return (
    <TypographicCover
      title={recipe.title}
      subtitle={recipeCoverSubtitle(recipe)}
      className={compact ? "aspect-[4/3] max-h-40" : className}
    />
  );
}
