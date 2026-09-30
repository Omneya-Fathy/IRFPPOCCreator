import { notFound } from "next/navigation";
import { RecipeDetail } from "@/components/recipe-detail";
import { getRecipe } from "@/lib/store";

type Props = { params: Promise<{ id: string }> };

export default async function RecipePage({ params }: Props) {
  const { id } = await params;
  if (!getRecipe(id)) notFound();

  return <RecipeDetail id={id} />;
}
