import { StaffFeaturedManager } from "../../../components/StaffFeaturedManager";
import { StaffHeader } from "../../../components/layout/StaffHeader";
import { PageHeader } from "../../../components/ui/PageHeader";

export default function StaffFeaturedPage() {
  return (
    <>
      <StaffHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <PageHeader
          title="Featured picks"
          description="Curate the staff picks list displayed on the home page."
        />
        <StaffFeaturedManager />
      </main>
    </>
  );
}
