"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuthorName, getBook, getGenreName } from "../lib/store";
import type { Book } from "../lib/types";
import { AddToCartButton } from "./AddToCartButton";
import { BookCover } from "./BookCover";
import { StockBadge } from "./StockBadge";
import { Card } from "./ui/Card";

type BookDetailViewProps = {
  bookId: string;
};

export function BookDetailView({ bookId }: BookDetailViewProps) {
  const [book, setBook] = useState<Book | undefined | null>(null);

  useEffect(() => {
    setBook(getBook(bookId));
  }, [bookId]);

  if (book === null) {
    return null;
  }

  if (!book) {
    return (
      <Card>
        <h1 className="text-xl font-semibold">Book not found</h1>
        <p className="mt-2 text-muted-foreground">
          We could not find a title with id &quot;{bookId}&quot;.
        </p>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline focus-ring">
          Return home
        </Link>
      </Card>
    );
  }

  const authorName = getAuthorName(book.authorId);
  const genreName = getGenreName(book.genreId);

  return (
    <div className="grid gap-8 md:grid-cols-[auto,1fr]">
      <BookCover book={book} size="lg" />
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">{book.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{authorName}</p>
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-muted-foreground">ISBN</dt>
            <dd>{book.isbn}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">Genre</dt>
            <dd>{genreName}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">Price</dt>
            <dd className="text-lg font-semibold">${book.price.toFixed(2)}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">Availability</dt>
            <dd className="mt-1">
              <StockBadge book={book} />
            </dd>
          </div>
        </dl>
        <AddToCartButton bookId={book.id} />
      </div>
    </div>
  );
}
