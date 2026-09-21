"use client";

import { useEffect, useState } from "react";
import { getBooksByGenreSlug } from "../lib/store";
import type { Book } from "../lib/types";
import { BookGrid } from "./BookGrid";

type GenreBooksSectionProps = {
  slug: string;
  emptyMessage: string;
};

export function GenreBooksSection({ slug, emptyMessage }: GenreBooksSectionProps) {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    setBooks(getBooksByGenreSlug(slug));
  }, [slug]);

  return <BookGrid books={books} emptyMessage={emptyMessage} />;
}
