import { PicksEditor } from "@/components/staff/picks-editor";
import { PageHeader } from "@/components/ui/page-header";
import { getStaffPicks, listBooks } from "@/lib/store";

export default function StaffPicksPage() {
  return (
    <>
      <PageHeader title="Staff picks" description="Curate featured lists on the storefront home." />
      <PicksEditor lists={getStaffPicks()} books={listBooks()} />
    </>
  );
}
