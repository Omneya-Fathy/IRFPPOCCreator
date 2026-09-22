"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "./cart-provider";

export function AddToCartButton({ bookId, disabled }: { bookId: string; disabled?: boolean }) {
  const { addToCart } = useCart();
  return (
    <Button type="button" disabled={disabled} onClick={() => addToCart(bookId, 1)}>
      Add to cart
    </Button>
  );
}
