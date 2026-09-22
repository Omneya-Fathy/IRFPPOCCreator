import { CheckoutForm } from "@/components/storefront/checkout-form";
import { PageHeader } from "@/components/ui/page-header";

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        title="Checkout"
        description="Guest checkout—no account required. US domestic shipping only."
      />
      <CheckoutForm />
    </>
  );
}
