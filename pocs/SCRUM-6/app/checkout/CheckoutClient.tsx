"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type CartLine = {
  isbn: string;
  title: string;
  price: number;
  quantity: number;
};

export function CheckoutClient() {
  const router = useRouter();
  const [items, setItems] = useState<CartLine[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    street: "",
    city: "",
    governorate: "",
    postalCode: "",
    country: "Egypt",
  });

  useEffect(() => {
    async function loadCart() {
      const response = await fetch("/api/cart");
      const data = await response.json();
      setItems(data.items ?? []);
    }
    void loadCart();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: form }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Checkout failed");
      return;
    }
    router.push(`/orders/${data.order.id}`);
  }

  return (
    <section>
      <h1>Guest checkout</h1>
      <p>No payment required for this demo. Delivery to Egypt only.</p>
      {items.length === 0 ? (
        <p>Add items to your cart before checkout.</p>
      ) : (
        <>
          <ul>
            {items.map((item) => (
              <li key={item.isbn}>
                {item.title} x{item.quantity}
              </li>
            ))}
          </ul>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                required
                value={form.fullName}
                onChange={(event) =>
                  setForm({ ...form, fullName: event.target.value })
                }
              />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
              />
            </label>
            <label>
              Street
              <input
                required
                value={form.street}
                onChange={(event) =>
                  setForm({ ...form, street: event.target.value })
                }
              />
            </label>
            <label>
              City
              <input
                required
                value={form.city}
                onChange={(event) =>
                  setForm({ ...form, city: event.target.value })
                }
              />
            </label>
            <label>
              Governorate
              <input
                required
                value={form.governorate}
                onChange={(event) =>
                  setForm({ ...form, governorate: event.target.value })
                }
              />
            </label>
            <label>
              Postal code
              <input
                value={form.postalCode}
                onChange={(event) =>
                  setForm({ ...form, postalCode: event.target.value })
                }
              />
            </label>
            <label>
              Country
              <input
                required
                value={form.country}
                onChange={(event) =>
                  setForm({ ...form, country: event.target.value })
                }
              />
            </label>
            {error && <p className="error">{error}</p>}
            <button type="submit">Place order</button>
          </form>
        </>
      )}
    </section>
  );
}
