import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { RecipeForm } from "@/components/recipe-form";
import { PageHeader } from "@/components/ui/page-header";
import { loadSessionFromCookie } from "@/lib/actions";
import { createRecipeFormAction } from "@/lib/form-actions";
import { getCurrentUser } from "@/lib/store";

export default async function NewRecipePage() {
  await loadSessionFromCookie();
  const user = getCurrentUser();
  if (!user) {
    redirect("/sign-in?redirect=/recipes/new");
  }

  return (
    <AppShell user={user}>
      <PageHeader
        title="Add a recipe"
        description="Share a durable recipe with followers. Photo field uses a typographic cover tile."
      />
      <RecipeForm action={createRecipeFormAction} submitLabel="Publish recipe" />
    </AppShell>
  );
}
