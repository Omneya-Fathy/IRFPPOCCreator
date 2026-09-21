"use client";

import { useEffect, useState } from "react";
import { searchBooks } from "../lib/store";
import type { Book } from "../lib/types";
import { BookGrid } from "./BookGrid";

type SearchResultsSectionProps = {
  query: string;
};

export function SearchResultsSection({ query }: SearchResultsSectionProps) {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    setBooks(searchBooks(query));
  }, [query]);

  if (!query) {
    return (
      <p className="text-muted-foreground">Enter a title or ISBN to search the catalogue.</p>
    );
  }

  return (
    <BookGrid books={books} emptyMessage={`No results for "${query}".`} />
  );
}
