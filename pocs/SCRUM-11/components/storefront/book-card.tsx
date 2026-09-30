import Link from "next/link";
import { Card } from "@/components/ui/card";
import { TypographicCover } from "@/components/ui/typographic-cover";
import { formatPrice } from "@/lib/format";
import type { Book } from "@/lib/types";
import { StockBadge } from "./stock-badge";

export function BookCard({ book }: { book: Book }) {
  return (
    <Card className="flex h-full flex-col gap-3 overflow-hidden p-0">
      <Link
        href={`/books/${book.id}`}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <TypographicCover title={book.title} subtitle={book.author} className="rounded-none border-0" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/books/${book.id}`}
              className="font-semibold text-card-foreground hover:text-primary"
            >
              {book.title}
            </Link>
            <p className="text-sm text-muted">{book.author}</p>
          </div>
          <StockBadge book={book} />
        </div>
        <p className="text-sm font-medium">{formatPrice(book.priceCents)}</p>
      </div>
    </Card>
  );
}
