import { RecipeForm } from "@/components/recipe-form";
import { PageHeader } from "@/components/ui/page-header";

export default function NewRecipePage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Publish a recipe" description="Share something durable — not another screenshot in the group chat." />
      <RecipeForm mode="create" />
    </div>
  );
}
