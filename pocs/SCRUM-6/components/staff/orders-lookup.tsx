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
    const q = new FormData(event.currentTarget).get("q");
    const response = await fetch(`/api/staff/orders?q=${encodeURIComponent(String(q ?? ""))}`);
    const payload = (await response.json()) as { orders: Order[] };
    setOrders(payload.orders ?? []);
    setSearched(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Order id or buyer email
          <Input name="q" placeholder="WP-1001 or buyer@example.com" required />
        </label>
        <Button type="submit">Search</Button>
      </form>
      {searched && orders.length === 0 && (
        <Alert tone="info">No paid orders matched that query.</Alert>
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
