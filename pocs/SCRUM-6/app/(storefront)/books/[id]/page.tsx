import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { StockBadge } from "@/components/storefront/stock-badge";
import { PageHeader } from "@/components/ui/page-header";
import { formatPrice } from "@/lib/format";
import { isInStock } from "@/lib/inventory";
import { getBook } from "@/lib/store";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = getBook(id);
  if (!book) notFound();

  return (
    <>
      <PageHeader title={book.title} description={`By ${book.author}`} />
      <div className="grid gap-8 md:grid-cols-[minmax(0,280px)_1fr]">
        <div className="aspect-[3/4] overflow-hidden rounded border border-border bg-card shadow-sm">
          <img
            src={book.coverPath}
            alt={`Cover of ${book.title}`}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-2xl font-semibold">{formatPrice(book.priceCents)}</p>
            <StockBadge book={book} />
          </div>
          <dl className="grid gap-2 text-sm">
            <div>
              <dt className="text-muted">Author</dt>
              <dd>
                <Link
                  href={`/browse/author/${book.authorSlug}`}
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  {book.author}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Genre</dt>
              <dd>
                <Link
                  href={`/browse/genre/${book.genreSlug}`}
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  {book.genre}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-muted">ISBN</dt>
              <dd className="font-mono text-sm">{book.isbn}</dd>
            </div>
          </dl>
          <AddToCartButton bookId={book.id} disabled={!isInStock(book)} />
          {!isInStock(book) && (
            <p className="text-sm text-muted">This title is currently out of stock online.</p>
          )}
        </div>
      </div>
    </>
  );
}
