import { notFound } from "next/navigation";
import { RecipeMeta } from "@/components/recipe-meta";
import { TypographicCover } from "@/components/ui/typographic-cover";
import { getCook, getRecipe } from "@/lib/store";
import { SHARE_SHELL_MARKER } from "@/lib/share";

export default async function ShareRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = getRecipe(id);
  if (!recipe) notFound();
  const author = getCook(recipe.authorId);

  return (
    <article data-shell={SHARE_SHELL_MARKER}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Shared recipe</p>
      <h1 className="font-display mt-2 text-3xl font-semibold">{recipe.title}</h1>
      {author ? <p className="mt-1 text-sm text-muted">By {author.displayName}</p> : null}
      <div className="mt-6 max-w-sm">
        <TypographicCover title={recipe.title} subtitle={recipe.photoSubtitle} />
      </div>
      <div className="mt-6 space-y-6">
        <RecipeMeta servings={recipe.servings} timeMinutes={recipe.timeMinutes} />
        <section>
          <h2 className="font-display text-lg font-semibold">Ingredients</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {recipe.ingredients.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold">Steps</h2>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
