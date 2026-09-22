import { INITIAL_BOOKS, INITIAL_STAFF_PICKS } from "./catalog-fixtures";
import type { Book, Order, StaffPickList } from "./types";

let books: Book[] = INITIAL_BOOKS.map((b) => ({ ...b }));
let staffPicks: StaffPickList[] = INITIAL_STAFF_PICKS.map((p) => ({
  ...p,
  bookIds: [...p.bookIds],
}));
let orders: Order[] = [];

export function resetStoreForTests(): void {
  books = INITIAL_BOOKS.map((b) => ({ ...b }));
  staffPicks = INITIAL_STAFF_PICKS.map((p) => ({
    ...p,
    bookIds: [...p.bookIds],
  }));
  orders = [];
}

export function listBooks(): Book[] {
  return books.map((b) => ({ ...b }));
}

export function getBook(id: string): Book | undefined {
  const book = books.find((b) => b.id === id);
  return book ? { ...book } : undefined;
}

export function updateBookInventory(
  id: string,
  patch: { priceCents?: number; hawthorneOnHand?: number; cedarOnHand?: number },
): Book | undefined {
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return undefined;
  books[index] = { ...books[index], ...patch };
  return { ...books[index] };
}

export function listGenres(): { name: string; slug: string; count: number }[] {
  const map = new Map<string, { name: string; slug: string; count: number }>();
  for (const book of books) {
    const existing = map.get(book.genreSlug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(book.genreSlug, { name: book.genre, slug: book.genreSlug, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function listAuthors(): { name: string; slug: string; count: number }[] {
  const map = new Map<string, { name: string; slug: string; count: number }>();
  for (const book of books) {
    const existing = map.get(book.authorSlug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(book.authorSlug, { name: book.author, slug: book.authorSlug, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function booksByGenreSlug(slug: string): Book[] {
  return books.filter((b) => b.genreSlug === slug).map((b) => ({ ...b }));
}

export function booksByAuthorSlug(slug: string): Book[] {
  return books.filter((b) => b.authorSlug === slug).map((b) => ({ ...b }));
}

export function getStaffPicks(): StaffPickList[] {
  return staffPicks.map((p) => ({ ...p, bookIds: [...p.bookIds] }));
}

export function setStaffPicks(next: StaffPickList[]): void {
  staffPicks = next.map((p) => ({ ...p, bookIds: [...p.bookIds] }));
}

export function addOrder(order: Order): void {
  orders.push({ ...order, lineItems: order.lineItems.map((l) => ({ ...l })) });
}

export function listOrders(): Order[] {
  return orders.map((o) => ({
    ...o,
    lineItems: o.lineItems.map((l) => ({ ...l })),
    address: { ...o.address },
  }));
}

export function findOrders(query: string): Order[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return listOrders().filter(
    (o) => o.id.toLowerCase() === q || o.email.toLowerCase() === q,
  );
}

let orderCounter = 1000;
export function nextOrderId(): string {
  orderCounter += 1;
  return `WP-${orderCounter}`;
}
