"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { buildConfirmationEmail, getOrder } from "../lib/store";
import type { Order } from "../lib/types";
import { Card } from "./ui/Card";
import { PageHeader } from "./ui/PageHeader";

export function OrderConfirmationView() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | undefined | null>(null);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (!orderId) {
      setOrder(undefined);
      return;
    }
    setOrder(getOrder(orderId));
  }, [searchParams]);

  if (order === null) {
    return null;
  }

  if (!order) {
    return (
      <Card>
        <h1 className="text-xl font-semibold">No recent order</h1>
        <p className="mt-2 text-muted-foreground">
          Complete checkout to view your confirmation.
        </p>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline focus-ring">
          Return home
        </Link>
      </Card>
    );
  }

  const emailPreview = buildConfirmationEmail(order);
  const total = order.lines.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );

  return (
    <>
      <PageHeader
        title="Order confirmed"
        description={`Thank you — your order ${order.id} has been placed.`}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Order summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {order.lines.map((line) => (
              <li key={line.bookId} className="flex justify-between gap-4">
                <span>
                  {line.title} x{line.quantity}
                </span>
                <span>${(line.price * line.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-border pt-4 font-semibold">
            Total: ${total.toFixed(2)}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Delivering to {order.deliveryAddress.name},{" "}
            {order.deliveryAddress.city}, {order.deliveryAddress.country}
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Confirmation email preview</h2>
          <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-4 text-xs whitespace-pre-wrap">
            {emailPreview}
          </pre>
        </Card>
      </div>
      <Link href="/" className="mt-6 inline-block text-primary hover:underline focus-ring">
        Continue browsing
      </Link>
    </>
  );
}
