import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export default function StaffHomePage() {
  return (
    <>
      <PageHeader
        title="Staff operations"
        description="Update inventory, curate featured lists, and locate paid orders. No login required for this local demo."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <h2 className="font-semibold">Inventory</h2>
          <p className="mt-2 text-sm text-muted">Edit price and Hawthorne/Cedar on-hand counts.</p>
          <Link href="/staff/inventory" className="mt-3 inline-block text-sm font-medium text-primary underline-offset-2 hover:underline">
            Open inventory
          </Link>
        </Card>
        <Card>
          <h2 className="font-semibold">Staff picks</h2>
          <p className="mt-2 text-sm text-muted">Choose which lists appear on the storefront home.</p>
          <Link href="/staff/picks" className="mt-3 inline-block text-sm font-medium text-primary underline-offset-2 hover:underline">
            Manage picks
          </Link>
        </Card>
        <Card>
          <h2 className="font-semibold">Orders</h2>
          <p className="mt-2 text-sm text-muted">Find a paid order by id or buyer email.</p>
          <Link href="/staff/orders" className="mt-3 inline-block text-sm font-medium text-primary underline-offset-2 hover:underline">
            Search orders
          </Link>
        </Card>
      </div>
    </>
  );
}
