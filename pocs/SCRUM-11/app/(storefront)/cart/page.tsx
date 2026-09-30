"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { buildCartDetails, cartSubtotalCents } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { listBooks } from "@/lib/store";

export default function CartPage() {
  const { lines, setQuantity, removeLine, itemCount } = useCart();
  const books = listBooks();
  const details = buildCartDetails(lines, books);
  const subtotal = cartSubtotalCents(lines, books);

  return (
    <>
      <PageHeader
        title="Your cart"
        description={itemCount > 0 ? `${itemCount} item${itemCount === 1 ? "" : "s"} in your cart.` : "Your cart is empty."}
      />
      {details.length === 0 ? (
        <EmptyState title="Cart is empty">
          Browse staff picks or search for a title to add books.{" "}
          <Link href="/" className="font-medium text-primary underline-offset-2 hover:underline">
            Back to home
          </Link>
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-8">
          <ul className="divide-y divide-border rounded border border-border bg-card shadow-sm">
            {details.map((row) => (
              <li key={row.bookId} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link href={`/books/${row.bookId}`} className="font-medium hover:text-primary">
                    {row.title}
                  </Link>
                  <p className="text-sm text-muted">{formatPrice(row.unitPriceCents)} each</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <span className="text-muted">Qty</span>
                    <Input
                      type="number"
                      min={1}
                      className="w-20"
                      value={row.quantity}
                      onChange={(e) => setQuantity(row.bookId, Number(e.target.value) || 0)}
                    />
                  </label>
                  <p className="min-w-[5rem] text-right font-medium">{formatPrice(row.lineTotalCents)}</p>
                  <Button type="button" variant="secondary" onClick={() => removeLine(row.bookId)}>
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-end gap-3">
            <p className="text-lg font-semibold">Subtotal: {formatPrice(subtotal)}</p>
            <Link href="/checkout">
              <Button type="button">Proceed to checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
