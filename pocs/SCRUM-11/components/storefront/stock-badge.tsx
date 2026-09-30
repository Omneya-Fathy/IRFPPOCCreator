import { Badge } from "@/components/ui/badge";
import { isInStock, isInStoreOnly, isMailOrderEligible } from "@/lib/inventory";
import type { Book } from "@/lib/types";

export function StockBadge({ book }: { book: Pick<Book, "hawthorneOnHand" | "cedarOnHand"> }) {
  if (!isInStock(book)) {
    return (
      <Badge className="border-border bg-background text-muted">Not available</Badge>
    );
  }
  if (isInStoreOnly(book)) {
    return (
      <Badge className="border-amber-200 bg-amber-50 text-amber-950">In store only</Badge>
    );
  }
  if (isMailOrderEligible(book)) {
    return (
      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-900">Mail-order eligible</Badge>
    );
  }
  return (
    <Badge className="border-border bg-background text-muted">Not available</Badge>
  );
}
