import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { FollowControls } from "@/components/follow-controls";
import { RecipeCard } from "@/components/recipe-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { loadSessionFromCookie } from "@/lib/actions";
import {
  getCook,
  getCurrentUser,
  getRecipesByAuthor,
  isFollowing as checkFollowing,
} from "@/lib/store";

export default async function CookProfilePage({ params }: { params: Promise<{ id: string }> }) {
  await loadSessionFromCookie();
  const { id } = await params;
  const cook = getCook(id);
  if (!cook) notFound();
  const user = getCurrentUser();
  const recipes = getRecipesByAuthor(id);
  const following = user ? checkFollowing(user.id, id) : false;

  return (
    <AppShell user={user}>
      <PageHeader
        title={cook.displayName}
        description="Cook profile and published recipes"
        actions={
          <FollowControls cookId={id} isFollowing={following} signedIn={Boolean(user)} />
        }
      />
      {recipes.length === 0 ? (
        <EmptyState title="No recipes yet">This cook has not published any recipes.</EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <RecipeCard recipe={recipe} author={cook} />
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
