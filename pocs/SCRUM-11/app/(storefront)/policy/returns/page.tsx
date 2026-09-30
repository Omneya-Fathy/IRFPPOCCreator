import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { RETURNS_POLICY_INTRO } from "@/lib/constants";

export default function ReturnsPolicyPage() {
  return (
    <>
      <PageHeader
        title="Returns & refunds"
        description="Buyer-facing policy for Willow & Page mail orders (demo copy)."
      />
      <div className="max-w-2xl rounded border border-border bg-card p-6 text-sm leading-relaxed shadow-sm">
        <p>{RETURNS_POLICY_INTRO}</p>
        <p className="mt-4 text-muted">
          This POC shows static policy text only. Return initiation and staff processing are out of scope.
        </p>
      </div>
      <Link href="/" className="mt-6 inline-block text-sm font-medium text-primary underline-offset-2 hover:underline">
        Back to storefront
      </Link>
    </>
  );
}
