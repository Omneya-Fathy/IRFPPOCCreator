import { beforeEach, describe, expect, it } from "vitest";
import { GET as catalogGet } from "../app/api/catalog/route";
import { GET as featuredGet } from "../app/api/featured/route";
import {
  addToCart,
  checkout,
  getBook,
  getEmailForOrder,
  getEmailLog,
  getFeaturedBooks,
  getFeaturedIsbns,
  getOrder,
  isInStock,
  listBooks,
  removeFromCart,
  resetStore,
  searchBooks,
  setFeaturedIsbns,
  updateCartItem,
  updateInventory,
} from "./store";

const EGYPT_ADDRESS = {
  fullName: "Nadia Hassan",
  email: "nadia@example.com",
  street: "12 Nile Street",
  city: "Cairo",
  governorate: "Cairo",
  postalCode: "11511",
  country: "Egypt",
};

beforeEach(() => {
  resetStore();
});

describe("catalogue", () => {
  it("returns seeded data", async () => {
    expect(listBooks().length).toBeGreaterThan(0);
    const response = await catalogGet(new Request("http://localhost/api/catalog"));
    const data = await response.json();
    expect(data.books.length).toBeGreaterThan(0);
    expect(data.books[0]).toMatchObject({
      isbn: expect.any(String),
      title: expect.any(String),
      author: expect.any(String),
      genre: expect.any(String),
      price: expect.any(Number),
    });
  });

  it("filters by genre", () => {
    const classics = listBooks({ genre: "Classic" });
    expect(classics.length).toBeGreaterThan(0);
    expect(classics.every((book) => book.genre === "Classic")).toBe(true);
    const fiction = listBooks({ genre: "Fiction" });
    expect(fiction.every((book) => book.genre === "Fiction")).toBe(true);
    expect(classics.some((book) => fiction.includes(book))).toBe(false);
  });

  it("filters by author", () => {
    const austen = listBooks({ author: "Jane Austen" });
    expect(austen).toHaveLength(1);
    expect(austen[0].title).toBe("Pride and Prejudice");
  });
});

describe("search", () => {
  it("matches by title", () => {
    const results = searchBooks("gatsby");
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("The Great Gatsby");
  });

  it("matches by ISBN", () => {
    const results = searchBooks("9780451524935");
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("1984");
  });
});

describe("stock flag", () => {
  it("is in stock when Hawthorne and Cedar qty sum is greater than zero", () => {
    expect(isInStock(getBook("9780141439518")!)).toBe(true);
    expect(isInStock(getBook("9780061120084")!)).toBe(true);
    expect(isInStock(getBook("9780451524935")!)).toBe(false);
  });
});

describe("cart", () => {
  it("adds, updates, and removes items", () => {
    addToCart("9780141439518", 1);
    expect(addToCart("9780141439518", 2)).toEqual([
      { isbn: "9780141439518", quantity: 3 },
    ]);
    updateCartItem("9780141439518", 2);
    expect(removeFromCart("9780141439518")).toEqual([]);
  });
});

describe("checkout", () => {
  it("creates an order without an account and logs email payload", () => {
    addToCart("9780141439518", 1);
    const beforeQty = getBook("9780141439518")!;
    const { order, email } = checkout({ address: EGYPT_ADDRESS });

    expect(order.id).toMatch(/^ORD-/);
    expect(order.items).toHaveLength(1);
    expect(getOrder(order.id)?.items).toHaveLength(1);
    expect(getEmailForOrder(order.id)?.subject).toContain(order.id);
    expect(getEmailLog()).toHaveLength(1);
    expect(email.body).toContain("Pride and Prejudice");

    const afterQty = getBook("9780141439518")!;
    expect(afterQty.hawthorneQty).toBe(beforeQty.hawthorneQty);
    expect(afterQty.cedarQty).toBe(beforeQty.cedarQty);
  });

  it("requires a delivery address", () => {
    addToCart("9780141439518", 1);
    expect(() =>
      checkout({
        address: {
          ...EGYPT_ADDRESS,
          street: "",
        },
      }),
    ).toThrow("Street address is required");
  });

  it("rejects non-Egypt shipping", () => {
    addToCart("9780141439518", 1);
    expect(() =>
      checkout({
        address: {
          ...EGYPT_ADDRESS,
          country: "United Kingdom",
        },
      }),
    ).toThrow("Shipping is available to Egypt only");
  });
});

describe("staff inventory", () => {
  it("persists manual edits", () => {
    updateInventory({
      isbn: "9780141439518",
      price: 19.99,
      hawthorneQty: 10,
      cedarQty: 1,
    });
    const book = getBook("9780141439518")!;
    expect(book.price).toBe(19.99);
    expect(book.hawthorneQty).toBe(10);
    expect(book.cedarQty).toBe(1);
  });

  it("does not auto-decrement stock on checkout", () => {
    const isbn = "9780140283334";
    const before = getBook(isbn)!;
    addToCart(isbn, 2);
    checkout({ address: EGYPT_ADDRESS });
    const after = getBook(isbn)!;
    expect(after.hawthorneQty).toBe(before.hawthorneQty);
    expect(after.cedarQty).toBe(before.cedarQty);
  });
});

describe("staff order lookup", () => {
  it("finds an order by id", () => {
    addToCart("9780743273565", 1);
    const { order } = checkout({ address: EGYPT_ADDRESS });
    expect(getOrder(order.id)?.id).toBe(order.id);
  });
});

describe("featured list", () => {
  it("returns featured books for home page", async () => {
    const books = getFeaturedBooks();
    expect(books.length).toBeGreaterThan(0);
    const response = await featuredGet();
    const data = await response.json();
    expect(data.books.length).toBe(books.length);
  });

  it("updates when staff edits featured ISBNs", () => {
    setFeaturedIsbns(["9780451524935", "9780743273565"]);
    expect(getFeaturedIsbns()).toEqual([
      "9780451524935",
      "9780743273565",
    ]);
    const books = getFeaturedBooks();
    expect(books.map((book) => book.isbn)).toEqual([
      "9780451524935",
      "9780743273565",
    ]);
  });
});
