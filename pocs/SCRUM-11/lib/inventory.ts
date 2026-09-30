import type { Book } from "./types";

export function combinedOnHand(book: Pick<Book, "hawthorneOnHand" | "cedarOnHand">): number {
  return book.hawthorneOnHand + book.cedarOnHand;
}

export function isInStock(book: Pick<Book, "hawthorneOnHand" | "cedarOnHand">): boolean {
  return combinedOnHand(book) > 0;
}

export function isMailOrderEligible(book: Pick<Book, "hawthorneOnHand" | "cedarOnHand">): boolean {
  return book.hawthorneOnHand > 0;
}

export function isInStoreOnly(book: Pick<Book, "hawthorneOnHand" | "cedarOnHand">): boolean {
  return isInStock(book) && !isMailOrderEligible(book);
}
