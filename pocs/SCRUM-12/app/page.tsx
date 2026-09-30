import { EmailNotificationLog } from "@/components/email-notification-log";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { RecipeCard } from "@/components/recipe-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { loadSessionFromCookie } from "@/lib/actions";
import { HOME_SIGNATURE } from "@/lib/theme";
import { getCook, getCurrentUser, getFeedRecipes } from "@/lib/store";

export default async function HomePage() {
  await loadSessionFromCookie();
  const user = getCurrentUser();
  const feed = user ? getFeedRecipes(user.id) : [];

  return (
    <AppShell user={user}>
      <PageHeader
        title="Your feed"
        description="Recipes from cooks you follow — trusted, durable, and ready to cook."
        actions={
          user ? (
            <Link href="/recipes/new">
              <Button variant={HOME_SIGNATURE.primaryButtonVariant}>Add recipe</Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button variant={HOME_SIGNATURE.primaryButtonVariant}>Sign in</Button>
            </Link>
          )
        }
      />
      {!user ? (
        <EmptyState title="Sign in to see your feed">
          Follow home cooks you trust, then come back for a personalized recipe feed.
        </EmptyState>
      ) : feed.length === 0 ? (
        <EmptyState title="No recipes from followed cooks yet">
          Visit a cook profile and tap Follow to fill your feed.
        </EmptyState>
      ) : (
        <ul className="space-y-4">
          {feed.map((recipe) => (
            <li key={recipe.id}>
              <RecipeCard recipe={recipe} author={getCook(recipe.authorId)} />
            </li>
          ))}
        </ul>
      )}
      <EmailNotificationLog />
      <p className="sr-only">
        Harvest Table signature uses {HOME_SIGNATURE.serifTitleClass} titles and{" "}
        {HOME_SIGNATURE.metadataAccentClass} metadata accents.
      </p>
    </AppShell>
  );
}
