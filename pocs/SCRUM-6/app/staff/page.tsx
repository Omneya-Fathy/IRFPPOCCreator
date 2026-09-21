import Link from "next/link";
import { StaffHeader } from "../../components/layout/StaffHeader";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";

export default function StaffLandingPage() {
  return (
    <>
      <StaffHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <PageHeader
          title="Staff landing"
          description="Maintain catalogue data and curate staff picks. No login required in this POC."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h2 className="text-lg font-semibold">Product maintenance</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Update price and per-location on-hand quantities for Hawthorne and Cedar.
            </p>
            <Link
              href="/staff/products"
              className="mt-4 inline-block text-primary hover:underline focus-ring"
            >
              Open product maintenance
            </Link>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold">Featured list curation</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add, remove, and reorder staff picks shown on the storefront home page.
            </p>
            <Link
              href="/staff/featured"
              className="mt-4 inline-block text-primary hover:underline focus-ring"
            >
              Manage featured picks
            </Link>
          </Card>
        </div>
      </main>
    </>
  );
}
