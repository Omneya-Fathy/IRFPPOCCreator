"use client";

import { useEffect, useState } from "react";
import type { Book } from "../../../lib/store";

export function InventoryClient() {
  const [books, setBooks] = useState<Book[]>([]);
  const [message, setMessage] = useState("");

  async function loadBooks() {
    const response = await fetch("/api/staff/inventory");
    const data = await response.json();
    setBooks(data.books ?? []);
  }

  useEffect(() => {
    void loadBooks();
  }, []);

  async function saveBook(book: Book) {
    const response = await fetch("/api/staff/inventory", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isbn: book.isbn,
        price: book.price,
        hawthorneQty: book.hawthorneQty,
        cedarQty: book.cedarQty,
      }),
    });
    if (response.ok) {
      setMessage(`Saved ${book.title}`);
      await loadBooks();
    } else {
      const data = await response.json();
      setMessage(data.error ?? "Save failed");
    }
  }

  return (
    <section>
      <h1>Staff inventory</h1>
      <p>No authentication required for this demo.</p>
      {message && <p>{message}</p>}
      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>ISBN</th>
            <th>Price (EGP)</th>
            <th>Hawthorne qty</th>
            <th>Cedar qty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={book.isbn}>
              <td>{book.title}</td>
              <td>{book.isbn}</td>
              <td>
                <input
                  type="number"
                  step="0.01"
                  value={book.price}
                  onChange={(event) => {
                    const next = [...books];
                    next[index] = {
                      ...book,
                      price: Number(event.target.value),
                    };
                    setBooks(next);
                  }}
                />
              </td>
              <td>
                <input
                  type="number"
                  min={0}
                  value={book.hawthorneQty}
                  onChange={(event) => {
                    const next = [...books];
                    next[index] = {
                      ...book,
                      hawthorneQty: Number(event.target.value),
                    };
                    setBooks(next);
                  }}
                />
              </td>
              <td>
                <input
                  type="number"
                  min={0}
                  value={book.cedarQty}
                  onChange={(event) => {
                    const next = [...books];
                    next[index] = {
                      ...book,
                      cedarQty: Number(event.target.value),
                    };
                    setBooks(next);
                  }}
                />
              </td>
              <td>
                <button type="button" onClick={() => saveBook(book)}>
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
