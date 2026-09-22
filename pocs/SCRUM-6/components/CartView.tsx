"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  getBook,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../lib/store";
import { BookCover } from "./BookCover";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export function CartView() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const cart = getCart();

  const lines = useMemo(
    () =>
      cart
        .map((line) => {
          const book = getBook(line.bookId);
          if (!book) {
            return null;
          }
          return { line, book };
        })
        .filter((entry): entry is { line: { bookId: string; quantity: number }; book: NonNullable<ReturnType<typeof getBook>> } => Boolean(entry)),
    [cart, refreshKey],
  );

  const total = lines.reduce(
    (sum, entry) => sum + entry.book.price * entry.line.quantity,
    0,
  );

  function handleQuantityChange(bookId: string, quantity: number) {
    updateCartQuantity(bookId, quantity);
    setRefreshKey((value) => value + 1);
    router.refresh();
  }

  function handleRemove(bookId: string) {
    removeFromCart(bookId);
    setRefreshKey((value) => value + 1);
    router.refresh();
  }

  if (lines.length === 0) {
    return (
      <Card>
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline focus-ring">
          Browse staff picks
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {lines.map(({ line, book }) => (
        <Card key={book.id} className="flex flex-col gap-4 md:flex-row md:items-center">
          <BookCover book={book} size="sm" />
          <div className="flex-1">
            <Link href={`/book/${book.id}`} className="font-semibold hover:text-primary focus-ring">
              {book.title}
            </Link>
            <p className="text-sm text-muted-foreground">${book.price.toFixed(2)} each</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm">
              <span className="mr-2 text-muted-foreground">Qty</span>
              <input
                type="number"
                min={1}
                value={line.quantity}
                onChange={(event) =>
                  handleQuantityChange(book.id, Number(event.target.value))
                }
                className="w-20 rounded-md border border-border bg-card px-2 py-1 text-sm focus-ring"
              />
            </label>
            <Button variant="ghost" onClick={() => handleRemove(book.id)}>
              Remove
            </Button>
          </div>
        </Card>
      ))}
      <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
        <Link href="/checkout">
          <Button>Proceed to checkout</Button>
        </Link>
      </Card>
    </div>
  );
}
