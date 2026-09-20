import Link from "next/link";
import type { Book } from "../lib/store";
import { isInStock } from "../lib/store";
import { BookCover } from "./BookCover";

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  return (
    <article className="book-card">
      <Link href={`/products/${book.isbn}`}>
        <BookCover title={book.title} isbn={book.isbn} />
        <h2>{book.title}</h2>
        <p>{book.author}</p>
        <p>EGP {book.price.toFixed(2)}</p>
        <p>{isInStock(book) ? "In stock" : "Out of stock"}</p>
      </Link>
    </article>
  );
}
