"use client";

import { useEffect, useState } from "react";
import { getBooksByAuthorSlug } from "../lib/store";
import type { Book } from "../lib/types";
import { BookGrid } from "./BookGrid";

type AuthorBooksSectionProps = {
  slug: string;
  emptyMessage: string;
};

export function AuthorBooksSection({ slug, emptyMessage }: AuthorBooksSectionProps) {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    setBooks(getBooksByAuthorSlug(slug));
  }, [slug]);

  return <BookGrid books={books} emptyMessage={emptyMessage} />;
}
