import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetails } from "../../../components/ProductDetails";
import { getBook, isInStock } from "../../../lib/store";
import { AddToCartButton } from "./AddToCartButton";

type PageProps = { params: Promise<{ isbn: string }> };

export default async function ProductPage({ params }: PageProps) {
  const { isbn } = await params;
  const book = getBook(isbn);
  if (!book) {
    notFound();
  }

  return (
    <section>
      <ProductDetails book={book} />
      <AddToCartButton isbn={book.isbn} disabled={!isInStock(book)} />
      <p><Link href="/catalog">Back to catalogue</Link></p>
    </section>
  );
}
