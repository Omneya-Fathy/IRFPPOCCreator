"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartLine = {
  isbn: string;
  title: string;
  price: number;
  quantity: number;
};

export function CartClient() {
  const [items, setItems] = useState<CartLine[]>([]);
  const [total, setTotal] = useState(0);

  async function loadCart() {
    const response = await fetch("/api/cart");
    const data = await response.json();
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
  }

  useEffect(() => {
    void loadCart();
  }, []);

  async function updateQuantity(isbn: string, quantity: number) {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", isbn, quantity }),
    });
    await loadCart();
  }

  async function removeItem(isbn: string) {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", isbn }),
    });
    await loadCart();
  }

  return (
    <section>
      <h1>Shopping cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>ISBN</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.isbn}>
                <td>{item.title}</td>
                <td>{item.isbn}</td>
                <td>EGP {item.price.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(item.isbn, Number(event.target.value))
                    }
                  />
                </td>
                <td>
                  <button type="button" onClick={() => removeItem(item.isbn)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p>Total: EGP {total.toFixed(2)}</p>
      {items.length > 0 && (
        <p><Link href="/checkout">Proceed to checkout</Link></p>
      )}
    </section>
  );
}
