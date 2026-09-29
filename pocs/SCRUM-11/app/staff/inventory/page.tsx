import { InventoryEditor } from "@/components/staff/inventory-editor";
import { PageHeader } from "@/components/ui/page-header";
import { listBooks } from "@/lib/store";

export default function StaffInventoryPage() {
  const books = listBooks();
  return (
    <>
      <PageHeader
        title="Inventory"
        description="Manual website quantities only—checkout does not auto-decrement stock."
      />
      <InventoryEditor books={books} />
    </>
  );
}
