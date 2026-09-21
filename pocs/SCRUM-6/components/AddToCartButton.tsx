"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addToCart, combinedInStock, getBook } from "../lib/store";
import { Button } from "./ui/Button";

type AddToCartButtonProps = {
  bookId: string;
};

export function AddToCartButton({ bookId }: AddToCartButtonProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const book = getBook(bookId);
  const inStock = book ? combinedInStock(book) : false;

  function handleAdd() {
    if (!book || !inStock) {
      return;
    }
    addToCart(bookId);
    setMessage("Added to cart");
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleAdd} disabled={!inStock}>
        {inStock ? "Add to cart" : "Out of stock"}
      </Button>
      {message ? <p className="text-sm text-success" role="status">{message}</p> : null}
    </div>
  );
}
