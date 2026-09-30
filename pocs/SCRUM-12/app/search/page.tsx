import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { RecipeCard } from "@/components/recipe-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { loadSessionFromCookie } from "@/lib/actions";
import { getCook, getCurrentUser, searchRecipes } from "@/lib/store";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await loadSessionFromCookie();
  const user = getCurrentUser();
  const { q = "" } = await searchParams;
  const results = q ? searchRecipes(q) : [];

  return (
    <AppShell user={user}>
      <PageHeader
        title="Search recipes"
        description="Match titles, ingredients, or cook-entered tags."
      />
      <form className="flex flex-col gap-2 sm:flex-row" action="/search" method="get">
        <Input name="q" defaultValue={q} placeholder="Try basil, brunch, or carrots" />
        <Button type="submit" variant="primary">
          Search
        </Button>
      </form>
      <div className="mt-8">
        {!q ? (
          <EmptyState title="Start typing to search">Enter a title, ingredient, or tag.</EmptyState>
        ) : results.length === 0 ? (
          <EmptyState title="No matches">Try another ingredient or tag from the fixtures.</EmptyState>
        ) : (
          <ul className="space-y-4">
            {results.map((recipe) => (
              <li key={recipe.id}>
                <RecipeCard recipe={recipe} author={getCook(recipe.authorId)} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-6 text-sm text-muted">
        <Link href="/" className="underline">
          Back to feed
        </Link>
      </p>
    </AppShell>
  );
}
