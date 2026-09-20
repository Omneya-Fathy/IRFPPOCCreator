export type Book = {
  isbn: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  hawthorneQty: number;
  cedarQty: number;
};

export type CartItem = {
  isbn: string;
  quantity: number;
};

export type OrderLineItem = {
  isbn: string;
  title: string;
  quantity: number;
  price: number;
};

export type DeliveryAddress = {
  fullName: string;
  email: string;
  street: string;
  city: string;
  governorate: string;
  postalCode: string;
  country: string;
};

export type Order = {
  id: string;
  createdAt: string;
  items: OrderLineItem[];
  address: DeliveryAddress;
  total: number;
};

export type EmailPayload = {
  id: string;
  orderId: string;
  to: string;
  subject: string;
  body: string;
  createdAt: string;
};

const SEED_BOOKS: Book[] = [
  {
    isbn: "9780141439518",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Classic",
    price: 12.99,
    hawthorneQty: 5,
    cedarQty: 2,
  },
  {
    isbn: "9780061120084",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    price: 14.5,
    hawthorneQty: 0,
    cedarQty: 3,
  },
  {
    isbn: "9780451524935",
    title: "1984",
    author: "George Orwell",
    genre: "Science Fiction",
    price: 11.99,
    hawthorneQty: 0,
    cedarQty: 0,
  },
  {
    isbn: "9780743273565",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    price: 10.99,
    hawthorneQty: 4,
    cedarQty: 0,
  },
  {
    isbn: "9780316769488",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
    price: 13.25,
    hawthorneQty: 2,
    cedarQty: 1,
  },
  {
    isbn: "9780140283334",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    price: 15.99,
    hawthorneQty: 6,
    cedarQty: 4,
  },
];

const DEFAULT_FEATURED = [
  "9780141439518",
  "9780061120084",
  "9780140283334",
];

let books: Book[] = SEED_BOOKS.map((book) => ({ ...book }));
let cart: CartItem[] = [];
let orders: Order[] = [];
let featuredIsbns: string[] = [...DEFAULT_FEATURED];
let emailLog: EmailPayload[] = [];
let orderCounter = 1;
let emailCounter = 1;

export function resetStore(): void {
  books = SEED_BOOKS.map((book) => ({ ...book }));
  cart = [];
  orders = [];
  featuredIsbns = [...DEFAULT_FEATURED];
  emailLog = [];
  orderCounter = 1;
  emailCounter = 1;
}

export function isInStock(book: Book): boolean {
  return book.hawthorneQty + book.cedarQty > 0;
}

export function listBooks(filters?: { genre?: string; author?: string }): Book[] {
  let result = [...books];
  if (filters?.genre) {
    result = result.filter(
      (book) => book.genre.toLowerCase() === filters.genre!.toLowerCase(),
    );
  }
  if (filters?.author) {
    result = result.filter(
      (book) => book.author.toLowerCase() === filters.author!.toLowerCase(),
    );
  }
  return result;
}

export function searchBooks(query: string): Book[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(normalized) ||
      book.isbn.includes(normalized),
  );
}

export function getBook(isbn: string): Book | undefined {
  return books.find((book) => book.isbn === isbn);
}

export function getFeaturedIsbns(): string[] {
  return [...featuredIsbns];
}

export function getFeaturedBooks(): Book[] {
  return featuredIsbns
    .map((isbn) => getBook(isbn))
    .filter((book): book is Book => book !== undefined);
}

export function setFeaturedIsbns(isbns: string[]): string[] {
  featuredIsbns = [...isbns];
  return getFeaturedIsbns();
}

export function getCart(): CartItem[] {
  return cart.map((item) => ({ ...item }));
}

export function addToCart(isbn: string, quantity = 1): CartItem[] {
  const book = getBook(isbn);
  if (!book) {
    throw new Error("Book not found");
  }
  const existing = cart.find((item) => item.isbn === isbn);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ isbn, quantity });
  }
  return getCart();
}

export function updateCartItem(isbn: string, quantity: number): CartItem[] {
  const item = cart.find((entry) => entry.isbn === isbn);
  if (!item) {
    throw new Error("Cart item not found");
  }
  if (quantity <= 0) {
    return removeFromCart(isbn);
  }
  item.quantity = quantity;
  return getCart();
}

export function removeFromCart(isbn: string): CartItem[] {
  cart = cart.filter((item) => item.isbn !== isbn);
  return getCart();
}

export function clearCart(): void {
  cart = [];
}

export function isEgyptShipping(country: string): boolean {
  const normalized = country.trim().toLowerCase();
  return normalized === "egypt" || normalized === "eg";
}

export type CheckoutInput = {
  address: DeliveryAddress;
};

export type CheckoutResult = {
  order: Order;
  email: EmailPayload;
};

export function checkout(input: CheckoutInput): CheckoutResult {
  const { address } = input;
  if (!address.fullName?.trim()) {
    throw new Error("Full name is required");
  }
  if (!address.email?.trim()) {
    throw new Error("Email is required");
  }
  if (!address.street?.trim()) {
    throw new Error("Street address is required");
  }
  if (!address.city?.trim()) {
    throw new Error("City is required");
  }
  if (!address.governorate?.trim()) {
    throw new Error("Governorate is required");
  }
  if (!address.country?.trim()) {
    throw new Error("Country is required");
  }
  if (!isEgyptShipping(address.country)) {
    throw new Error("Shipping is available to Egypt only");
  }
  if (cart.length === 0) {
    throw new Error("Cart is empty");
  }

  const items: OrderLineItem[] = cart.map((item) => {
    const book = getBook(item.isbn);
    if (!book) {
      throw new Error(`Book not found: ${item.isbn}`);
    }
    return {
      isbn: book.isbn,
      title: book.title,
      quantity: item.quantity,
      price: book.price,
    };
  });

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const order: Order = {
    id: `ORD-${String(orderCounter++).padStart(4, "0")}`,
    createdAt: new Date().toISOString(),
    items,
    address: { ...address },
    total,
  };

  orders.push(order);

  const email: EmailPayload = {
    id: `EMAIL-${String(emailCounter++).padStart(4, "0")}`,
    orderId: order.id,
    to: address.email,
    subject: `Order confirmation ${order.id} — Willow & Page Booksellers`,
    body: [
      `Dear ${address.fullName},`,
      "",
      `Thank you for your order ${order.id}.`,
      "",
      "Items:",
      ...order.items.map(
        (item) =>
          `- ${item.title} (ISBN ${item.isbn}) x${item.quantity} — EGP ${(item.price * item.quantity).toFixed(2)}`,
      ),
      "",
      `Total: EGP ${order.total.toFixed(2)}`,
      "",
      "Delivery address:",
      `${address.street}`,
      `${address.city}, ${address.governorate} ${address.postalCode}`,
      `${address.country}`,
      "",
      "Willow & Page Booksellers",
    ].join("\n"),
    createdAt: order.createdAt,
  };

  emailLog.push(email);
  clearCart();

  return { order, email };
}

export function getOrder(id: string): Order | undefined {
  return orders.find((order) => order.id === id);
}

export function listOrders(): Order[] {
  return orders.map((order) => ({ ...order, items: [...order.items] }));
}

export function getEmailLog(): EmailPayload[] {
  return emailLog.map((entry) => ({ ...entry }));
}

export function getEmailForOrder(orderId: string): EmailPayload | undefined {
  return emailLog.find((entry) => entry.orderId === orderId);
}

export type InventoryUpdate = {
  isbn: string;
  price?: number;
  hawthorneQty?: number;
  cedarQty?: number;
};

export function updateInventory(update: InventoryUpdate): Book {
  const book = getBook(update.isbn);
  if (!book) {
    throw new Error("Book not found");
  }
  if (update.price !== undefined) {
    book.price = update.price;
  }
  if (update.hawthorneQty !== undefined) {
    book.hawthorneQty = update.hawthorneQty;
  }
  if (update.cedarQty !== undefined) {
    book.cedarQty = update.cedarQty;
  }
  return { ...book };
}

export function getGenres(): string[] {
  return [...new Set(books.map((book) => book.genre))].sort();
}

export function getAuthors(): string[] {
  return [...new Set(books.map((book) => book.author))].sort();
}

export function getBookQuantities(): Map<string, { hawthorneQty: number; cedarQty: number }> {
  const map = new Map<string, { hawthorneQty: number; cedarQty: number }>();
  for (const book of books) {
    map.set(book.isbn, {
      hawthorneQty: book.hawthorneQty,
      cedarQty: book.cedarQty,
    });
  }
  return map;
}
