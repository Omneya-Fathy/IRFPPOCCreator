import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { RecipeMeta } from "@/components/recipe-meta";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { TypographicCover } from "@/components/ui/typographic-cover";
import { loadSessionFromCookie } from "@/lib/actions";
import { canEditRecipe, getCook, getCurrentUser, getRecipe } from "@/lib/store";

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  await loadSessionFromCookie();
  const { id } = await params;
  const recipe = getRecipe(id);
  if (!recipe) notFound();
  const user = getCurrentUser();
  const author = getCook(recipe.authorId);

  return (
    <AppShell user={user}>
      <PageHeader
        title={recipe.title}
        description={author ? `By ${author.displayName}` : undefined}
        actions={
          canEditRecipe(user?.id ?? null, recipe.id) ? (
            <Link href={`/recipes/${recipe.id}/edit`}>
              <Button variant="secondary">Edit recipe</Button>
            </Link>
          ) : null
        }
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,280px)_1fr]">
        <TypographicCover title={recipe.title} subtitle={recipe.photoSubtitle} />
        <div className="space-y-6">
          <RecipeMeta servings={recipe.servings} timeMinutes={recipe.timeMinutes} />
          {recipe.tags.length > 0 ? (
            <p className="text-sm text-muted">Tags: {recipe.tags.join(", ")}</p>
          ) : null}
          <section>
            <h2 className="font-display text-xl font-semibold">Ingredients</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              {recipe.ingredients.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold">Steps</h2>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm">
              {recipe.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
