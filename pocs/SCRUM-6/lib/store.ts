import {
  initialAuthors,
  initialBooks,
  initialFeaturedIds,
  initialGenres,
} from "../data/fixtures";
import type {
  Author,
  Book,
  CartLine,
  DeliveryAddress,
  Genre,
  Order,
  PaymentDetails,
} from "./types";

let books: Book[] = [];
let genres: Genre[] = [];
let authors: Author[] = [];
let featuredIds: string[] = [];
let cart: CartLine[] = [];
let orders: Order[] = [];
let lastOrderId: string | null = null;

function cloneBooks(source: Book[]): Book[] {
  return source.map((book) => ({ ...book }));
}

export function resetStore(): void {
  books = cloneBooks(initialBooks);
  genres = initialGenres.map((genre) => ({ ...genre }));
  authors = initialAuthors.map((author) => ({ ...author }));
  featuredIds = [...initialFeaturedIds];
  cart = [];
  orders = [];
  lastOrderId = null;
}

resetStore();

export function combinedInStock(book: Book): boolean {
  return book.quantityHawthorne + book.quantityCedar > 0;
}

export function listBooks(): Book[] {
  return books.map((book) => ({ ...book }));
}

export function getBook(id: string): Book | undefined {
  const book = books.find((item) => item.id === id);
  return book ? { ...book } : undefined;
}

export function listGenres(): Genre[] {
  return genres.map((genre) => ({ ...genre }));
}

export function getGenreBySlug(slug: string): Genre | undefined {
  const genre = genres.find((item) => item.slug === slug);
  return genre ? { ...genre } : undefined;
}

export function listAuthors(): Author[] {
  return authors.map((author) => ({ ...author }));
}

export function getAuthorBySlug(slug: string): Author | undefined {
  const author = authors.find((item) => item.slug === slug);
  return author ? { ...author } : undefined;
}

export function getAuthorName(authorId: string): string {
  return authors.find((author) => author.id === authorId)?.name ?? "Unknown author";
}

export function getGenreName(genreId: string): string {
  return genres.find((genre) => genre.id === genreId)?.name ?? "Unknown genre";
}

export function getBooksByGenreSlug(slug: string): Book[] {
  const genre = getGenreBySlug(slug);
  if (!genre) {
    return [];
  }
  return books
    .filter((book) => book.genreId === genre.id)
    .map((book) => ({ ...book }));
}

export function getBooksByAuthorSlug(slug: string): Book[] {
  const author = getAuthorBySlug(slug);
  if (!author) {
    return [];
  }
  return books
    .filter((book) => book.authorId === author.id)
    .map((book) => ({ ...book }));
}

export function searchBooks(query: string): Book[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }
  const lower = trimmed.toLowerCase();
  return books
    .filter(
      (book) =>
        book.title.toLowerCase().includes(lower) || book.isbn === trimmed,
    )
    .map((book) => ({ ...book }));
}

export function getFeaturedBooks(): Book[] {
  return featuredIds
    .map((id) => books.find((book) => book.id === id))
    .filter((book): book is Book => Boolean(book))
    .map((book) => ({ ...book }));
}

export function listFeaturedIds(): string[] {
  return [...featuredIds];
}

export function addFeaturedBook(bookId: string): void {
  if (!books.some((book) => book.id === bookId) || featuredIds.includes(bookId)) {
    return;
  }
  featuredIds.push(bookId);
}

export function removeFeaturedBook(bookId: string): void {
  featuredIds = featuredIds.filter((id) => id !== bookId);
}

export function reorderFeaturedBook(bookId: string, direction: "up" | "down"): void {
  const index = featuredIds.indexOf(bookId);
  if (index === -1) {
    return;
  }
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= featuredIds.length) {
    return;
  }
  const next = [...featuredIds];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  featuredIds = next;
}

export function getCart(): CartLine[] {
  return cart.map((line) => ({ ...line }));
}

export function addToCart(bookId: string, quantity = 1): void {
  const book = books.find((item) => item.id === bookId);
  if (!book) {
    return;
  }
  const existing = cart.find((line) => line.bookId === bookId);
  if (existing) {
    existing.quantity += quantity;
    return;
  }
  cart.push({ bookId, quantity });
}

export function updateCartQuantity(bookId: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(bookId);
    return;
  }
  const line = cart.find((item) => item.bookId === bookId);
  if (line) {
    line.quantity = quantity;
  }
}

export function removeFromCart(bookId: string): void {
  cart = cart.filter((line) => line.bookId !== bookId);
}

export function clearCart(): void {
  cart = [];
}

export function getCartLineCount(): number {
  return cart.reduce((total, line) => total + line.quantity, 0);
}

export function createOrder(
  email: string,
  deliveryAddress: DeliveryAddress,
  _payment: PaymentDetails,
): Order | null {
  if (!email.trim() || cart.length === 0) {
    return null;
  }

  const lines = cart
    .map((line) => {
      const book = books.find((item) => item.id === line.bookId);
      if (!book) {
        return null;
      }
      return {
        bookId: book.id,
        title: book.title,
        quantity: line.quantity,
        price: book.price,
      };
    })
    .filter((line): line is Order["lines"][number] => Boolean(line));

  if (lines.length === 0) {
    return null;
  }

  const order: Order = {
    id: `ORD-${String(orders.length + 1).padStart(4, "0")}`,
    email: email.trim(),
    lines,
    deliveryAddress: { ...deliveryAddress },
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  lastOrderId = order.id;
  clearCart();
  return { ...order, lines: order.lines.map((line) => ({ ...line })) };
}

export function getOrder(id: string): Order | undefined {
  const order = orders.find((item) => item.id === id);
  if (!order) {
    return undefined;
  }
  return {
    ...order,
    lines: order.lines.map((line) => ({ ...line })),
    deliveryAddress: { ...order.deliveryAddress },
  };
}

export function getLastOrderId(): string | null {
  return lastOrderId;
}

export function buildConfirmationEmail(order: Order): string {
  const lines = order.lines
    .map(
      (line) =>
        `- ${line.title} x${line.quantity} — $${(line.price * line.quantity).toFixed(2)}`,
    )
    .join("\n");
  const total = order.lines.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );

  return [
    `To: ${order.email}`,
    `Subject: Your Willow & Page order ${order.id}`,
    "",
    "Thank you for your order from Willow & Page Booksellers.",
    "",
    `Order ${order.id}`,
    lines,
    "",
    `Total: $${total.toFixed(2)}`,
    "",
    "Delivery address:",
    order.deliveryAddress.name,
    order.deliveryAddress.line1,
    order.deliveryAddress.line2 ?? "",
    `${order.deliveryAddress.city}, ${order.deliveryAddress.state ?? ""} ${order.deliveryAddress.postalCode}`,
    order.deliveryAddress.country,
    "",
    "Mail orders are packed from our Hawthorne basement three days per week.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function updateBookPrice(bookId: string, price: number): void {
  const book = books.find((item) => item.id === bookId);
  if (book && price >= 0) {
    book.price = price;
  }
}

export function updateBookQuantity(
  bookId: string,
  location: "hawthorne" | "cedar",
  quantity: number,
): void {
  const book = books.find((item) => item.id === bookId);
  if (!book || quantity < 0) {
    return;
  }
  if (location === "hawthorne") {
    book.quantityHawthorne = quantity;
  } else {
    book.quantityCedar = quantity;
  }
}
