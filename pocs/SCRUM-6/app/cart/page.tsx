import { CartView } from "../../components/CartView";
import { StorefrontHeader } from "../../components/layout/StorefrontHeader";
import { PageHeader } from "../../components/ui/PageHeader";

export default function CartPage() {
  return (
    <>
      <StorefrontHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <PageHeader
          title="Your cart"
          description="Review line items before guest checkout."
        />
        <CartView />
      </main>
    </>
  );
}
