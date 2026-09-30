import { notFound } from "next/navigation";
import { RecipeForm } from "@/components/recipe-form";
import { PageHeader } from "@/components/ui/page-header";
import { getRecipe } from "@/lib/store";

type Props = { params: Promise<{ id: string }> };

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params;
  const recipe = getRecipe(id);
  if (!recipe) notFound();

  return (
    <div className="space-y-8">
      <PageHeader title="Edit recipe" description="Update your recipe card for everyone who follows you." />
      <RecipeForm mode="edit" initial={recipe} />
    </div>
  );
}
