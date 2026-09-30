"use client";

import Link from "next/link";
import { FeedRecipeCard } from "@/components/feed-recipe-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useFeedRecipes } from "@/lib/store-sync";

export function HomeFeed() {
  const recipes = useFeedRecipes();

  if (recipes.length === 0) {
    return (
      <EmptyState title="Your table is quiet">
        Follow a cook to see their recipes here, or{" "}
        <Link href="/search" className="font-medium text-primary underline-offset-2 hover:underline">
          search the community
        </Link>
        .
      </EmptyState>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {recipes.map((recipe, index) => (
        <FeedRecipeCard
          key={recipe.id}
          recipe={recipe}
          variant={index % 2 === 0 ? "featured" : "compact"}
        />
      ))}
    </div>
  );
}
