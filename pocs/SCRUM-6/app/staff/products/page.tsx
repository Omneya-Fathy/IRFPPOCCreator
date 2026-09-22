import { StaffProductsTable } from "../../../components/StaffProductsTable";
import { StaffHeader } from "../../../components/layout/StaffHeader";
import { PageHeader } from "../../../components/ui/PageHeader";

export default function StaffProductsPage() {
  return (
    <>
      <StaffHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <PageHeader
          title="Product maintenance"
          description="Edit price and on-hand quantity by location. Shopper views use combined stock only."
        />
        <StaffProductsTable />
      </main>
    </>
  );
}
