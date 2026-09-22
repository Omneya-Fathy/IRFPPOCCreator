import type { Book } from "./types";

export function searchBooks(books: Book[], query: string): Book[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const digits = query.replace(/\D/g, "");
  return books.filter((book) => {
    const titleMatch = book.title.toLowerCase().includes(q);
    const isbnMatch =
      digits.length >= 4 &&
      book.isbn.replace(/\D/g, "").includes(digits);
    return titleMatch || isbnMatch;
  });
}
