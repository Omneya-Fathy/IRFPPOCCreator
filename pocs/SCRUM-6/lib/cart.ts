import type { Book, CartLine } from "./types";

export type CartLineDetail = {
  bookId: string;
  title: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
};

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function cartSubtotalCents(lines: CartLine[], books: Book[]): number {
  return buildCartDetails(lines, books).reduce((sum, row) => sum + row.lineTotalCents, 0);
}

export function buildCartDetails(lines: CartLine[], books: Book[]): CartLineDetail[] {
  const byId = new Map(books.map((b) => [b.id, b]));
  return lines
    .map((line) => {
      const book = byId.get(line.bookId);
      if (!book) return null;
      return {
        bookId: line.bookId,
        title: book.title,
        unitPriceCents: book.priceCents,
        quantity: line.quantity,
        lineTotalCents: book.priceCents * line.quantity,
      };
    })
    .filter((row): row is CartLineDetail => row !== null);
}

export function addToCart(lines: CartLine[], bookId: string, quantity = 1): CartLine[] {
  const next = lines.map((l) => ({ ...l }));
  const existing = next.find((l) => l.bookId === bookId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    next.push({ bookId, quantity });
  }
  return next;
}

export function updateCartQuantity(lines: CartLine[], bookId: string, quantity: number): CartLine[] {
  if (quantity <= 0) {
    return lines.filter((l) => l.bookId !== bookId);
  }
  return lines.map((l) => (l.bookId === bookId ? { ...l, quantity } : l));
}

export function removeFromCart(lines: CartLine[], bookId: string): CartLine[] {
  return lines.filter((l) => l.bookId !== bookId);
}
