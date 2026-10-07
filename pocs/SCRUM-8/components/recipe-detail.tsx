import Link from "next/link";
import { RecipeCover } from "@/components/recipe-cover";
import { StepRailList } from "@/components/step-rail-list";
import { Badge } from "@/components/ui/badge";
import { RecipeEditLink } from "@/components/recipe-edit-link";
import { getCook, getRecipe } from "@/lib/store";

type RecipeDetailProps = {
  id: string;
};

export function RecipeDetail({ id }: RecipeDetailProps) {
  const recipe = getRecipe(id);
  if (!recipe) return null;

  const cook = getCook(recipe.authorId);
  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <RecipeCover recipe={recipe} className="aspect-[21/9] max-h-72" />
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold leading-tight text-foreground md:text-4xl">
              {recipe.title}
            </h1>
            <p className="mt-2 text-muted">
              {recipe.servings} servings · {recipe.timeMinutes} minutes
              {cook ? (
                <>
                  {" · "}
                  <Link href={`/cooks/${cook.id}`} className="font-medium text-foreground hover:text-primary">
                    {cook.name}
                  </Link>
                </>
              ) : null}
            </p>
            {recipe.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            ) : null}
          </div>
          <RecipeEditLink recipeId={recipe.id} />
        </div>
      </header>

      <div className="grid gap-10 md:grid-cols-[minmax(0,35%)_minmax(0,65%)]">
        <aside className="space-y-6 rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="font-serif text-xl font-semibold">Ingredients</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground">
            {recipe.ingredients.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
        <section>
          <h2 className="mb-4 font-serif text-xl font-semibold">Steps</h2>
          <StepRailList steps={recipe.steps} />
        </section>
      </div>
    </article>
  );
}
