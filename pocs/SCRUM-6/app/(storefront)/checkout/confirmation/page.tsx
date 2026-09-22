import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/page-header";
import { formatPrice } from "@/lib/format";
import { findOrders } from "@/lib/store";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId = "" } = await searchParams;
  const order = findOrders(orderId)[0];

  if (!order) {
    return (
      <>
        <PageHeader title="Order not found" description="We could not locate that order id." />
        <Link href="/" className="text-sm font-medium text-primary underline-offset-2 hover:underline">
          Return home
        </Link>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Thank you for your order"
        description={`Order ${order.id} is confirmed. No account was required.`}
      />
      {order.confirmationEmailQueued && (
        <Alert tone="success" className="mb-6">
          A confirmation email has been queued for {order.email} (demo only—no mail is sent).
        </Alert>
      )}
      <div className="flex flex-col gap-4 rounded border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted">{order.fulfilmentNote}</p>
        <ul className="divide-y divide-border text-sm">
          {order.lineItems.map((line) => (
            <li key={line.bookId} className="flex justify-between py-2">
              <span>
                {line.title} × {line.quantity}
              </span>
              <span>{formatPrice(line.unitPriceCents * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="text-right font-semibold">Total: {formatPrice(order.totalCents)}</p>
      </div>
      <Link href="/" className="mt-6 inline-block text-sm font-medium text-primary underline-offset-2 hover:underline">
        Continue browsing
      </Link>
    </>
  );
}
