import type { Book } from "./types";

/** A2 — single combined in-stock flag for buyer-facing UI. */
export function isInStock(book: Pick<Book, "hawthorneOnHand" | "cedarOnHand">): boolean {
  return book.hawthorneOnHand > 0 || book.cedarOnHand > 0;
}
