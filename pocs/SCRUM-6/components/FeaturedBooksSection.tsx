"use client";

import { useEffect, useState } from "react";
import { getFeaturedBooks } from "../lib/store";
import type { Book } from "../lib/types";
import { BookGrid } from "./BookGrid";

type FeaturedBooksSectionProps = {
  emptyMessage?: string;
};

export function FeaturedBooksSection({
  emptyMessage = "No staff picks yet. Visit staff tools to curate featured titles.",
}: FeaturedBooksSectionProps) {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    setBooks(getFeaturedBooks());
  }, []);

  return <BookGrid books={books} emptyMessage={emptyMessage} />;
}
