"use client";

import { useState } from "react";

type AddToCartButtonProps = {
  isbn: string;
  disabled?: boolean;
};

export function AddToCartButton({ isbn, disabled }: AddToCartButtonProps) {
  const [message, setMessage] = useState("");

  async function handleAdd() {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", isbn, quantity: 1 }),
    });
    if (response.ok) {
      setMessage("Added to cart");
    } else {
      const data = await response.json();
      setMessage(data.error ?? "Could not add to cart");
    }
  }

  return (
    <div>
      <button type="button" onClick={handleAdd} disabled={disabled}>
        Add to cart
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
