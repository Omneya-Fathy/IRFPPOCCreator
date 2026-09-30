import Link from "next/link";
import { notFound } from "next/navigation";
import { CookFollowButton } from "@/components/cook-profile-actions";
import { RecipeCover } from "@/components/recipe-cover";
import { getCook, getRecipesByAuthor } from "@/lib/store";

type Props = { params: Promise<{ id: string }> };

export default async function CookProfilePage({ params }: Props) {
  const { id } = await params;
  const cook = getCook(id);
  if (!cook) notFound();

  const recipes = getRecipesByAuthor(id);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 font-serif text-lg font-semibold text-primary">
            {cook.initials}
          </span>
          <div>
            <h1 className="font-serif text-3xl font-semibold">{cook.name}</h1>
            {cook.tagline ? <p className="text-muted">{cook.tagline}</p> : null}
          </div>
        </div>
        <CookFollowButton cookId={cook.id} />
      </header>

      <section>
        <h2 className="mb-4 font-serif text-xl font-semibold">Recipes</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <Link href={`/recipes/${recipe.id}`}>
                <RecipeCover recipe={recipe} className="aspect-[16/10]" />
                <p className="p-3 font-serif font-semibold">{recipe.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
