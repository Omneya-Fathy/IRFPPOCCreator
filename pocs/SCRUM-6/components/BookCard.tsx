import Link from "next/link";
import { getAuthorName } from "../lib/store";
import type { Book } from "../lib/types";
import { BookCover } from "./BookCover";
import { StockBadge } from "./StockBadge";

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/book/${book.id}`} className="focus-ring rounded-md">
        <BookCover book={book} />
      </Link>
      <div className="mt-4 flex flex-1 flex-col gap-2">
        <Link
          href={`/book/${book.id}`}
          className="text-base font-semibold text-foreground hover:text-primary focus-ring"
        >
          {book.title}
        </Link>
        <p className="text-sm text-muted-foreground">{getAuthorName(book.authorId)}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-sm font-medium">${book.price.toFixed(2)}</span>
          <StockBadge book={book} />
        </div>
      </div>
    </article>
  );
}
