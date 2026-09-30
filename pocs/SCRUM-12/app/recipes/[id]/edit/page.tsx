import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { RecipeForm } from "@/components/recipe-form";
import { PageHeader } from "@/components/ui/page-header";
import { loadSessionFromCookie } from "@/lib/actions";
import { updateRecipeFormAction } from "@/lib/form-actions";
import { canEditRecipe, getCurrentUser, getRecipe } from "@/lib/store";

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  await loadSessionFromCookie();
  const { id } = await params;
  const recipe = getRecipe(id);
  if (!recipe) notFound();
  const user = getCurrentUser();
  if (!user) {
    redirect(`/sign-in?redirect=/recipes/${id}/edit`);
  }
  if (!canEditRecipe(user.id, id)) {
    redirect(`/recipes/${id}`);
  }

  const boundAction = updateRecipeFormAction.bind(null, id);

  return (
    <AppShell user={user}>
      <PageHeader title="Edit recipe" description="Update your published recipe." />
      <RecipeForm recipe={recipe} action={boundAction} submitLabel="Save changes" />
      <p className="mt-6 text-sm text-muted">
        <Link href={`/recipes/${id}`} className="underline">
          Cancel
        </Link>
      </p>
    </AppShell>
  );
}
