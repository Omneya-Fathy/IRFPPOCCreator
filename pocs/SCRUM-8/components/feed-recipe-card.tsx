import Link from "next/link";
import { RecipeCover } from "@/components/recipe-cover";
import { getCook } from "@/lib/store";
import type { Recipe } from "@/lib/types";

type FeedRecipeCardProps = {
  recipe: Recipe;
  variant: "featured" | "compact";
};

export function FeedRecipeCard({ recipe, variant }: FeedRecipeCardProps) {
  const cook = getCook(recipe.authorId);

  if (variant === "featured") {
    return (
      <article className="overflow-hidden rounded-lg border border-border bg-card shadow-sm md:col-span-2">
        <Link href={`/recipes/${recipe.id}`} className="block">
          <RecipeCover recipe={recipe} />
          <div className="space-y-1 p-5">
            <h2 className="font-serif text-2xl font-semibold leading-tight text-foreground">
              {recipe.title}
            </h2>
            {cook ? (
              <p className="text-sm text-muted">
                by{" "}
                <span className="font-medium text-foreground">{cook.name}</span>
                {" · "}
                {recipe.servings} servings · {recipe.timeMinutes} min
              </p>
            ) : null}
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="flex gap-4 rounded-lg border border-border bg-card p-3 shadow-sm">
      <Link href={`/recipes/${recipe.id}`} className="w-28 shrink-0 overflow-hidden rounded-md">
        <RecipeCover recipe={recipe} compact />
      </Link>
      <div className="min-w-0 flex-1 py-1">
        <Link href={`/recipes/${recipe.id}`}>
          <h2 className="font-serif text-lg font-semibold leading-snug text-foreground">
            {recipe.title}
          </h2>
        </Link>
        {cook ? (
          <p className="mt-1 text-sm text-muted">
            <Link href={`/cooks/${cook.id}`} className="hover:text-foreground">
              {cook.name}
            </Link>
            {" · "}
            {recipe.timeMinutes} min
          </p>
        ) : null}
      </div>
    </article>
  );
}
