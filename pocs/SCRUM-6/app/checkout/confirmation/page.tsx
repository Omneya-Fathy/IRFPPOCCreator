import { Suspense } from "react";
import { OrderConfirmationView } from "../../../components/OrderConfirmationView";
import { StorefrontHeader } from "../../../components/layout/StorefrontHeader";

export default function ConfirmationPage() {
  return (
    <>
      <StorefrontHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <Suspense fallback={null}>
          <OrderConfirmationView />
        </Suspense>
      </main>
    </>
  );
}
