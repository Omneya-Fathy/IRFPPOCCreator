"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import type { Book } from "@/lib/types";

export function InventoryEditor({ books }: { books: Book[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function save(bookId: string, form: HTMLFormElement) {
    setSavingId(bookId);
    setMessage(null);
    const data = new FormData(form);
    const response = await fetch(`/api/staff/inventory/${bookId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceCents: Math.round(Number(data.get("priceDollars")) * 100),
        hawthorneOnHand: Number(data.get("hawthorneOnHand")),
        cedarOnHand: Number(data.get("cedarOnHand")),
      }),
    });
    setSavingId(null);
    if (!response.ok) {
      setMessage("Could not save changes.");
      return;
    }
    setMessage("Inventory updated. Storefront badges reflect combined stock (A2).");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      {message && <Alert tone="success">{message}</Alert>}
      <div className="overflow-x-auto rounded border border-border bg-card shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-[#f0eeeb] text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Hawthorne on-hand</th>
              <th className="px-3 py-2">Cedar on-hand</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b border-border align-top">
                <td className="px-3 py-3 font-medium">{book.title}</td>
                <td className="px-3 py-3" colSpan={4}>
                  <form
                    className="flex flex-wrap items-end gap-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      save(book.id, e.currentTarget);
                    }}
                  >
                    <label className="text-xs text-muted">
                      Price (USD)
                      <Input
                        name="priceDollars"
                        type="number"
                        step="0.01"
                        min={0}
                        className="mt-1 w-28"
                        defaultValue={(book.priceCents / 100).toFixed(2)}
                      />
                    </label>
                    <label className="text-xs text-muted">
                      Hawthorne
                      <Input
                        name="hawthorneOnHand"
                        type="number"
                        min={0}
                        className="mt-1 w-24"
                        defaultValue={book.hawthorneOnHand}
                      />
                    </label>
                    <label className="text-xs text-muted">
                      Cedar
                      <Input
                        name="cedarOnHand"
                        type="number"
                        min={0}
                        className="mt-1 w-24"
                        defaultValue={book.cedarOnHand}
                      />
                    </label>
                    <Button type="submit" variant="secondary" disabled={savingId === book.id}>
                      {savingId === book.id ? "Saving…" : "Save"}
                    </Button>
                    <span className="text-xs text-muted">Listed at {formatPrice(book.priceCents)}</span>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
