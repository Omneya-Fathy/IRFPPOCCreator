import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import {
  addFeaturedBook,
  addToCart,
  buildConfirmationEmail,
  combinedInStock,
  createOrder,
  getBook,
  getBooksByAuthorSlug,
  getBooksByGenreSlug,
  getCart,
  getCartLineCount,
  getFeaturedBooks,
  getLastOrderId,
  getOrder,
  listBooks,
  listFeaturedIds,
  removeFeaturedBook,
  removeFromCart,
  resetStore,
  searchBooks,
  updateBookPrice,
  updateBookQuantity,
  updateCartQuantity,
} from "./store";

const root = resolve(__dirname, "..");

beforeEach(() => {
  resetStore();
});

describe("theme bootstrap", () => {
  it("defines theme variables in globals.css", () => {
    const css = readFileSync(resolve(root, "app/globals.css"), "utf8");
    expect(css).toContain("--background");
    expect(css).toContain("--primary");
    expect(css).toContain("--radius");
    expect(css).toContain("@tailwind");
  });

  it("maps theme tokens in tailwind.config.ts", () => {
    const config = readFileSync(resolve(root, "tailwind.config.ts"), "utf8");
    expect(config).toContain("background: \"var(--background)\"");
    expect(config).toContain("primary");
    expect(config).toContain("borderRadius");
  });
});

describe("fixtures and combined stock", () => {
  it("loads at least three books", () => {
    expect(listBooks().length).toBeGreaterThanOrEqual(3);
  });

  it("returns true when either location has stock", () => {
    const hawthorneOnly = getBook("book-piranesi");
    const cedarOnly = getBook("book-klara");
    expect(hawthorneOnly).toBeDefined();
    expect(cedarOnly).toBeDefined();
    expect(combinedInStock(hawthorneOnly!)).toBe(true);
    expect(combinedInStock(cedarOnly!)).toBe(true);
  });

  it("returns false when both locations are zero", () => {
    const outOfStock = getBook("book-psalm-wild");
    expect(outOfStock).toBeDefined();
    expect(combinedInStock(outOfStock!)).toBe(false);
  });
});

describe("home featured picks", () => {
  it("resolves featured ids to book titles", () => {
    const featured = getFeaturedBooks();
    expect(featured.length).toBeGreaterThan(0);
    featured.forEach((book) => {
      expect(book.title.length).toBeGreaterThan(0);
      expect(getBook(book.id)?.title).toBe(book.title);
    });
  });
});

describe("genre browse", () => {
  it("filters books by genre slug", () => {
    const books = getBooksByGenreSlug("fantasy");
    expect(books.some((book) => book.title === "Piranesi")).toBe(true);
    expect(books.every((book) => book.genreId === "genre-fantasy")).toBe(true);
  });
});

describe("author browse", () => {
  it("filters books by author slug", () => {
    const books = getBooksByAuthorSlug("charles-yu");
    expect(books).toHaveLength(1);
    expect(books[0]?.title).toBe("Interior Chinatown");
  });
});

describe("search", () => {
  it("matches title case-insensitively", () => {
    const results = searchBooks("piranesi");
    expect(results.some((book) => book.title === "Piranesi")).toBe(true);
  });

  it("matches exact ISBN", () => {
    const results = searchBooks("9780143034902");
    expect(results).toHaveLength(1);
    expect(results[0]?.title).toBe("The Shadow of the Wind");
  });

  it("returns empty set when nothing matches", () => {
    expect(searchBooks("no-such-title")).toHaveLength(0);
  });
});

describe("product page data", () => {
  it("exposes product fields and combined in-stock", () => {
    const book = getBook("book-shadow-wind");
    expect(book).toMatchObject({
      title: "The Shadow of the Wind",
      isbn: "9780143034902",
      coverColor: expect.any(String),
      price: expect.any(Number),
    });
    expect(combinedInStock(book!)).toBe(true);
  });

  it("handles invalid id gracefully", () => {
    expect(getBook("missing-book")).toBeUndefined();
  });
});

describe("cart", () => {
  it("adds, updates, and removes line items", () => {
    addToCart("book-shadow-wind");
    expect(getCartLineCount()).toBe(1);

    updateCartQuantity("book-shadow-wind", 3);
    expect(getCart()[0]?.quantity).toBe(3);

    removeFromCart("book-shadow-wind");
    expect(getCart()).toHaveLength(0);
  });
});

describe("checkout", () => {
  it("accepts international address and creates order without changing inventory", () => {
    const book = getBook("book-shadow-wind");
    const beforeHawthorne = book!.quantityHawthorne;
    const beforeCedar = book!.quantityCedar;

    addToCart("book-shadow-wind", 1);
    const order = createOrder(
      "reader@example.com",
      {
        name: "Aya Nakamura",
        line1: "1-2-3 Shibuya",
        city: "Tokyo",
        postalCode: "150-0002",
        country: "Japan",
      },
      {
        cardName: "Aya Nakamura",
        cardNumber: "4111111111111111",
        expiry: "12/28",
        cvc: "123",
      },
    );

    expect(order).toBeTruthy();
    expect(order?.deliveryAddress.country).toBe("Japan");
    expect(getBook("book-shadow-wind")?.quantityHawthorne).toBe(beforeHawthorne);
    expect(getBook("book-shadow-wind")?.quantityCedar).toBe(beforeCedar);
  });
});

describe("confirmation", () => {
  it("includes order id and email preview content", () => {
    addToCart("book-piranesi", 1);
    const order = createOrder(
      "reader@example.com",
      {
        name: "Reader",
        line1: "123 Main St",
        city: "Portland",
        postalCode: "97214",
        country: "United States",
      },
      {
        cardName: "Reader",
        cardNumber: "4111111111111111",
        expiry: "12/28",
        cvc: "123",
      },
    );

    expect(order).toBeTruthy();
    expect(getLastOrderId()).toBe(order?.id);
    const stored = getOrder(order!.id);
    const email = buildConfirmationEmail(stored!);
    expect(email).toContain(order!.id);
    expect(email).toContain("reader@example.com");
    expect(email).toContain("Piranesi");
  });
});

describe("staff products", () => {
  it("updates price and per-location quantities", () => {
    updateBookPrice("book-shadow-wind", 21.5);
    updateBookQuantity("book-shadow-wind", "hawthorne", 0);
    updateBookQuantity("book-shadow-wind", "cedar", 0);

    const book = getBook("book-shadow-wind");
    expect(book?.price).toBe(21.5);
    expect(book?.quantityHawthorne).toBe(0);
    expect(book?.quantityCedar).toBe(0);
    expect(combinedInStock(book!)).toBe(false);
  });

  it("updates shopper combined in-stock after staff edit", () => {
    updateBookQuantity("book-psalm-wild", "cedar", 2);
    const book = getBook("book-psalm-wild");
    expect(combinedInStock(book!)).toBe(true);
  });
});

describe("staff featured", () => {
  it("adds and removes featured picks", () => {
    addFeaturedBook("book-interior");
    expect(getFeaturedBooks().some((book) => book.id === "book-interior")).toBe(true);

    removeFeaturedBook("book-interior");
    expect(listFeaturedIds()).not.toContain("book-interior");
  });
});

describe("staff access", () => {
  it("staff routes have no login gate in source", () => {
    const staffPage = readFileSync(resolve(root, "app/staff/page.tsx"), "utf8");
    const productsPage = readFileSync(resolve(root, "app/staff/products/page.tsx"), "utf8");
    const featuredPage = readFileSync(resolve(root, "app/staff/featured/page.tsx"), "utf8");

    const authGatePattern = /redirect\(|signIn\(|getServerSession|useSession|middleware/i;
    expect(staffPage).not.toMatch(authGatePattern);
    expect(productsPage).not.toMatch(authGatePattern);
    expect(featuredPage).not.toMatch(authGatePattern);
    expect(staffPage).toContain("/staff/products");
    expect(staffPage).toContain("/staff/featured");
    expect(staffPage).not.toContain("/staff/orders");
  });
});
