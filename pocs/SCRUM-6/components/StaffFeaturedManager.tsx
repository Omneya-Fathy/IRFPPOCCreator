"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  addFeaturedBook,
  getFeaturedBooks,
  listBooks,
  listFeaturedIds,
  removeFeaturedBook,
  reorderFeaturedBook,
} from "../lib/store";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Select } from "./ui/Select";

export function StaffFeaturedManager() {
  const router = useRouter();
  const [, setRefreshKey] = useState(0);
  const featured = getFeaturedBooks();
  const featuredIds = listFeaturedIds();
  const availableBooks = listBooks().filter((book) => !featuredIds.includes(book.id));

  function handleAdd(bookId: string) {
    if (!bookId) {
      return;
    }
    addFeaturedBook(bookId);
    setRefreshKey((value) => value + 1);
    router.refresh();
  }

  function handleRemove(bookId: string) {
    removeFeaturedBook(bookId);
    setRefreshKey((value) => value + 1);
    router.refresh();
  }

  function handleReorder(bookId: string, direction: "up" | "down") {
    reorderFeaturedBook(bookId, direction);
    setRefreshKey((value) => value + 1);
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Current staff picks</h2>
        {featured.length === 0 ? (
          <p className="text-sm text-muted-foreground">No featured titles yet.</p>
        ) : (
          <ul className="space-y-3">
            {featured.map((book, index) => (
              <li
                key={book.id}
                className="flex flex-col gap-2 rounded-md border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{book.title}</p>
                  <p className="text-xs text-muted-foreground">Position {index + 1}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => handleReorder(book.id, "up")}>
                    Move up
                  </Button>
                  <Button variant="secondary" onClick={() => handleReorder(book.id, "down")}>
                    Move down
                  </Button>
                  <Button variant="danger" onClick={() => handleRemove(book.id)}>
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Add a title</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const select = form.elements.namedItem("bookId") as HTMLSelectElement;
            handleAdd(select.value);
            select.value = "";
          }}
          className="space-y-4"
        >
          <Select label="Book" name="bookId" defaultValue="">
            <option value="" disabled>Select a book</option>
            {availableBooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </Select>
          <Button type="submit">Add to featured list</Button>
        </form>
      </Card>
    </div>
  );
}
