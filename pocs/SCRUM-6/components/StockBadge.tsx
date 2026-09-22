import type { Book } from "../lib/types";
import { combinedInStock } from "../lib/store";
import { Badge } from "./ui/Badge";

type StockBadgeProps = {
  book: Book;
};

export function StockBadge({ book }: StockBadgeProps) {
  const inStock = combinedInStock(book);
  return (
    <Badge variant={inStock ? "success" : "danger"}>
      {inStock ? "In stock" : "Out of stock"}
    </Badge>
  );
}
