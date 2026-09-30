import Link from "next/link";
import { Card } from "@/components/ui/card";
import { TypographicCover } from "@/components/ui/typographic-cover";
import { RecipeMeta } from "@/components/recipe-meta";
import type { Cook, Recipe } from "@/lib/types";

export function RecipeCard({
  recipe,
  author,
}: {
  recipe: Recipe;
  author: Cook | undefined;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="grid gap-0 sm:grid-cols-[140px_1fr]">
        <div className="hidden sm:block">
          <TypographicCover
            title={recipe.title}
            subtitle={recipe.photoSubtitle}
            className="aspect-square rounded-none border-0 shadow-none"
          />
        </div>
        <div className="flex flex-col gap-2 p-4">
          <Link href={`/recipes/${recipe.id}`} className="font-display text-lg font-semibold hover:underline">
            {recipe.title}
          </Link>
          {author ? (
            <Link href={`/cooks/${author.id}`} className="text-sm text-muted hover:underline">
              {author.displayName}
            </Link>
          ) : null}
          <RecipeMeta servings={recipe.servings} timeMinutes={recipe.timeMinutes} />
          {recipe.tags.length > 0 ? (
            <p className="text-xs text-muted">{recipe.tags.join(" · ")}</p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
