"use client";

import { FormEvent, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";

export function OrdersLookup() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const orderId = String(form.get("orderId") ?? "");
    const email = String(form.get("email") ?? "");
    const params = new URLSearchParams({ orderId, email });
    const response = await fetch(`/api/staff/orders?${params.toString()}`);
    const payload = (await response.json()) as { orders: Order[] };
    setOrders(payload.orders ?? []);
    setSearched(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Order number
          <Input name="orderId" placeholder="WP-1001" required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Buyer email
          <Input name="email" type="email" placeholder="buyer@example.com" required />
        </label>
        <div className="sm:col-span-2">
          <Button type="submit">Look up order</Button>
        </div>
      </form>
      {searched && orders.length === 0 && (
        <Alert tone="info">No paid orders matched that order number and email together.</Alert>
      )}
      {orders.map((order) => (
        <div key={order.id} className="rounded border border-border bg-card p-4 text-sm shadow-sm">
          <p className="font-semibold">{order.id}</p>
          <p className="text-muted">{order.email}</p>
          <p className="mt-2">{order.fulfilmentNote}</p>
          <ul className="mt-2 divide-y divide-border">
            {order.lineItems.map((line) => (
              <li key={line.bookId} className="flex justify-between py-1">
                <span>{line.title} × {line.quantity}</span>
                <span>{formatPrice(line.unitPriceCents * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-right font-medium">Total {formatPrice(order.totalCents)}</p>
        </div>
      ))}
    </div>
  );
}
