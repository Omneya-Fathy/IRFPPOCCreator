import { CheckoutForm } from "../../components/CheckoutForm";
import { StorefrontHeader } from "../../components/layout/StorefrontHeader";
import { PageHeader } from "../../components/ui/PageHeader";

export default function CheckoutPage() {
  return (
    <>
      <StorefrontHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <PageHeader
          title="Guest checkout"
          description="Complete your order with delivery details. International shipping is available."
        />
        <CheckoutForm />
      </main>
    </>
  );
}
