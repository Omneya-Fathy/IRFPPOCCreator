import { OrdersLookup } from "@/components/staff/orders-lookup";
import { PageHeader } from "@/components/ui/page-header";

export default function StaffOrdersPage() {
  return (
    <>
      <PageHeader title="Locate orders" description="Search paid web orders by id or buyer email." />
      <OrdersLookup />
    </>
  );
}
