import type { Book } from "../lib/store";
import { isInStock } from "../lib/store";
import { BookCover } from "./BookCover";

type ProductDetailsProps = {
  book: Book;
};

export function ProductDetails({ book }: ProductDetailsProps) {
  const inStock = isInStock(book);

  return (
    <article className="product-details" data-testid="product-details">
      <BookCover title={book.title} isbn={book.isbn} />
      <div className="product-info">
        <h1 data-testid="product-title">{book.title}</h1>
        <p data-testid="product-author">Author: {book.author}</p>
        <p data-testid="product-isbn">ISBN: {book.isbn}</p>
        <p data-testid="product-price">Price: EGP {book.price.toFixed(2)}</p>
        <p data-testid="product-stock">
          {inStock ? "In stock" : "Out of stock"}
        </p>
      </div>
    </article>
  );
}
