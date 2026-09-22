import type { Book } from "../lib/types";
import { BookCard } from "./BookCard";

type BookGridProps = {
  books: Book[];
  emptyMessage?: string;
};

export function BookGrid({ books, emptyMessage = "No books found." }: BookGridProps) {
  if (books.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
