"use client";

import { useState } from "react";
import type { Order } from "../../../lib/store";

export function OrdersClient() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  async function handleLookup(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setOrder(null);
    const response = await fetch(
      `/api/staff/orders?id=${encodeURIComponent(orderId)}`,
    );
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Order not found");
      return;
    }
    setOrder(data.order);
  }

  return (
    <section>
      <h1>Staff order lookup</h1>
      <form onSubmit={handleLookup}>
        <label>
          Order ID
          <input
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            placeholder="ORD-0001"
          />
        </label>
        <button type="submit">Look up</button>
      </form>
      {error && <p className="error">{error}</p>}
      {order && (
        <section data-testid="staff-order-result">
          <p>Order ID: {order.id}</p>
          <ul>
            {order.items.map((item) => (
              <li key={item.isbn}>
                {item.title} x{item.quantity}
              </li>
            ))}
          </ul>
          <p>Total: EGP {order.total.toFixed(2)}</p>
        </section>
      )}
    </section>
  );
}
