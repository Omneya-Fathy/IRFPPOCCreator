"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  combinedInStock,
  getAuthorName,
  listBooks,
  updateBookPrice,
  updateBookQuantity,
} from "../lib/store";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";

export function StaffProductsTable() {
  const router = useRouter();
  const [, setRefreshKey] = useState(0);
  const books = listBooks();
  const [drafts, setDrafts] = useState<Record<string, {
    price: string;
    hawthorne: string;
    cedar: string;
  }>>({});

  function getDraft(bookId: string, book: ReturnType<typeof listBooks>[number]) {
    return (
      drafts[bookId] ?? {
        price: book.price.toFixed(2),
        hawthorne: String(book.quantityHawthorne),
        cedar: String(book.quantityCedar),
      }
    );
  }

  function updateDraft(
    bookId: string,
    book: ReturnType<typeof listBooks>[number],
    field: "price" | "hawthorne" | "cedar",
    value: string,
  ) {
    const current = getDraft(bookId, book);
    setDrafts((state) => ({
      ...state,
      [bookId]: { ...current, [field]: value },
    }));
  }

  function handleSave(bookId: string, book: ReturnType<typeof listBooks>[number]) {
    const draft = getDraft(bookId, book);
    updateBookPrice(bookId, Number(draft.price));
    updateBookQuantity(bookId, "hawthorne", Number(draft.hawthorne));
    updateBookQuantity(bookId, "cedar", Number(draft.cedar));
    setRefreshKey((value) => value + 1);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {books.map((book) => {
        const draft = getDraft(book.id, book);
        const inStock = combinedInStock(book);
        return (
          <Card key={book.id} className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-semibold">{book.title}</h2>
                <p className="text-sm text-muted-foreground">{getAuthorName(book.authorId)}</p>
              </div>
              <Badge variant={inStock ? "success" : "danger"}>
                Shopper sees: {inStock ? "In stock" : "Out of stock"}
              </Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Input
                label="Price"
                type="number"
                min="0"
                step="0.01"
                value={draft.price}
                onChange={(event) => updateDraft(book.id, book, "price", event.target.value)}
              />
              <Input
                label="Hawthorne on hand"
                type="number"
                min="0"
                value={draft.hawthorne}
                onChange={(event) => updateDraft(book.id, book, "hawthorne", event.target.value)}
              />
              <Input
                label="Cedar on hand"
                type="number"
                min="0"
                value={draft.cedar}
                onChange={(event) => updateDraft(book.id, book, "cedar", event.target.value)}
              />
              <div className="flex items-end">
                <Button onClick={() => handleSave(book.id, book)}>Save changes</Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
