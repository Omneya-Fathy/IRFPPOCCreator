"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PORTLAND_SHIPPING_HELPER, SHIPPING_FEE_CENTS, SHIPPING_FEE_NOTE } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { listBooks } from "@/lib/store";
import { cartSubtotalCents } from "@/lib/cart";
import type { PaymentFields, PortlandAddress } from "@/lib/types";

export function CheckoutForm() {
  const router = useRouter();
  const { lines, clearCart } = useCart();
  const books = listBooks();
  const subtotal = cartSubtotalCents(lines, books);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const address: PortlandAddress = {
      name: String(form.get("name") ?? ""),
      street: String(form.get("street") ?? ""),
      city: String(form.get("city") ?? ""),
      state: String(form.get("state") ?? "OR"),
      zip: String(form.get("zip") ?? ""),
    };
    const payment: PaymentFields = {
      cardName: String(form.get("cardName") ?? ""),
      cardNumber: String(form.get("cardNumber") ?? ""),
      expiry: String(form.get("expiry") ?? ""),
      cvc: String(form.get("cvc") ?? ""),
    };
    const email = String(form.get("email") ?? "");

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, address, payment, cartLines: lines }),
    });
    const payload = (await response.json()) as { ok: boolean; message?: string; orderId?: string };
    setSubmitting(false);
    if (!response.ok || !payload.ok || !payload.orderId) {
      setError(payload.message ?? "Checkout could not be completed.");
      return;
    }
    clearCart();
    router.push(`/checkout/confirmation?orderId=${encodeURIComponent(payload.orderId)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-xl flex-col gap-6">
      {error && <Alert tone="error">{error}</Alert>}
      <div className="rounded border border-border bg-card p-4 text-sm shadow-sm">
        <p className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </p>
        <p className="mt-2 flex justify-between text-muted">
          <span>Shipping</span>
          <span>{formatPrice(SHIPPING_FEE_CENTS)}</span>
        </p>
        <p className="mt-1 text-xs text-muted">{SHIPPING_FEE_NOTE}</p>
        <p className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
          <span>Total</span>
          <span>{formatPrice(subtotal + SHIPPING_FEE_CENTS)}</span>
        </p>
      </div>
      <fieldset className="flex flex-col gap-3">
        <legend className="text-base font-semibold">Contact</legend>
        <label className="text-sm">
          Email for confirmation
          <Input name="email" type="email" required autoComplete="email" className="mt-1" />
        </label>
      </fieldset>
      <fieldset className="flex flex-col gap-3">
        <legend className="text-base font-semibold">Portland delivery address</legend>
        <p className="text-sm text-muted">{PORTLAND_SHIPPING_HELPER}</p>
        <label className="text-sm">
          Full name
          <Input name="name" required autoComplete="name" className="mt-1" />
        </label>
        <label className="text-sm">
          Street
          <Input name="street" required autoComplete="address-line1" className="mt-1" />
        </label>
        <label className="text-sm">
          City
          <Input name="city" required defaultValue="Portland" autoComplete="address-level2" className="mt-1" />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            State
            <Input name="state" required maxLength={2} defaultValue="OR" className="mt-1" />
          </label>
          <label className="text-sm">
            ZIP
            <Input name="zip" required autoComplete="postal-code" className="mt-1" />
          </label>
        </div>
      </fieldset>
      <fieldset className="flex flex-col gap-3">
        <legend className="text-base font-semibold">Payment (demo)</legend>
        <p className="text-sm text-muted">Fake card fields for the POC—no real charges.</p>
        <label className="text-sm">
          Name on card
          <Input name="cardName" required className="mt-1" />
        </label>
        <label className="text-sm">
          Card number
          <Input name="cardNumber" required inputMode="numeric" className="mt-1" />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Expiry
            <Input name="expiry" required placeholder="MM/YY" className="mt-1" />
          </label>
          <label className="text-sm">
            CVC
            <Input name="cvc" required inputMode="numeric" className="mt-1" />
          </label>
        </div>
      </fieldset>
      <Button type="submit" disabled={submitting || lines.length === 0}>
        {submitting ? "Placing order…" : "Place order"}
      </Button>
    </form>
  );
}
