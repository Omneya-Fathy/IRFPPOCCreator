import { Badge } from "@/components/ui/badge";
import { isInStock } from "@/lib/inventory";
import type { Book } from "@/lib/types";

export function StockBadge({ book }: { book: Pick<Book, "hawthorneOnHand" | "cedarOnHand"> }) {
  const inStock = isInStock(book);
  return (
    <Badge
      className={
        inStock
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-border bg-background text-muted"
      }
    >
      {inStock ? "In stock" : "Out of stock"}
    </Badge>
  );
}
