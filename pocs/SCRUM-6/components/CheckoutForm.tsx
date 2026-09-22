"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createOrder, getCart } from "../lib/store";
import type { DeliveryAddress, PaymentDetails } from "../lib/types";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "Japan",
  "Australia",
];

export function CheckoutForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Canada",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (getCart().length === 0) {
      setError("Your cart is empty. Add books before checking out.");
      return;
    }

    const deliveryAddress: DeliveryAddress = {
      name: form.name,
      line1: form.line1,
      line2: form.line2 || undefined,
      city: form.city,
      state: form.state || undefined,
      postalCode: form.postalCode,
      country: form.country,
    };

    const payment: PaymentDetails = {
      cardName: form.cardName,
      cardNumber: form.cardNumber,
      expiry: form.expiry,
      cvc: form.cvc,
    };

    const order = createOrder(form.email, deliveryAddress, payment);
    if (!order) {
      setError("Unable to place order. Check your details and try again.");
      return;
    }

    router.push(`/checkout/confirmation?orderId=${encodeURIComponent(order.id)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Delivery address</h2>
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
        <Input
          label="Full name"
          required
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
        <Input
          label="Address line 1"
          required
          value={form.line1}
          onChange={(event) => updateField("line1", event.target.value)}
        />
        <Input
          label="Address line 2"
          value={form.line2}
          onChange={(event) => updateField("line2", event.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="City"
            required
            value={form.city}
            onChange={(event) => updateField("city", event.target.value)}
          />
          <Input
            label="State / province"
            value={form.state}
            onChange={(event) => updateField("state", event.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Postal code"
            required
            value={form.postalCode}
            onChange={(event) => updateField("postalCode", event.target.value)}
          />
          <Select
            label="Country"
            required
            value={form.country}
            onChange={(event) => updateField("country", event.target.value)}
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Payment (demo)</h2>
        <p className="text-sm text-muted-foreground">
          Guest checkout — no account required. Card details are fake and never processed.
        </p>
        <Input
          label="Name on card"
          required
          value={form.cardName}
          onChange={(event) => updateField("cardName", event.target.value)}
        />
        <Input
          label="Card number"
          required
          inputMode="numeric"
          value={form.cardNumber}
          onChange={(event) => updateField("cardNumber", event.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Expiry"
            placeholder="MM/YY"
            required
            value={form.expiry}
            onChange={(event) => updateField("expiry", event.target.value)}
          />
          <Input
            label="CVC"
            required
            value={form.cvc}
            onChange={(event) => updateField("cvc", event.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-danger" role="alert">{error}</p> : null}
        <Button type="submit">Place order</Button>
      </Card>
    </form>
  );
}
