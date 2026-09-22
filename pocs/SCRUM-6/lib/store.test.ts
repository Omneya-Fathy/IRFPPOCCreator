import { describe, expect, it, beforeEach } from "vitest";
import { INITIAL_BOOKS } from "./catalog-fixtures";
import { isInStock } from "./inventory";
import {
  addOrder,
  booksByAuthorSlug,
  booksByGenreSlug,
  findOrders,
  getStaffPicks,
  listBooks,
  resetStoreForTests,
  setStaffPicks,
  updateBookInventory,
} from "./store";
import { processCheckout } from "./checkout";
import { VALID_US_FIXTURE } from "./us-address";

beforeEach(() => resetStoreForTests());

describe("catalog store", () => {
  it("loads fixture books with required fields", () => {
    const books = listBooks();
    expect(books.length).toBe(INITIAL_BOOKS.length);
    for (const book of books) {
      expect(book.title).toBeTruthy();
      expect(book.isbn).toMatch(/^978/);
      expect(book.coverPath.startsWith("/covers/")).toBe(true);
    }
  });

  it("filters by genre slug", () => {
    const mystery = booksByGenreSlug("mystery");
    expect(mystery.every((b) => b.genreSlug === "mystery")).toBe(true);
    expect(mystery.length).toBeGreaterThan(0);
  });

  it("filters by author slug", () => {
    const marsh = booksByAuthorSlug("elena-marsh");
    expect(marsh.every((b) => b.authorSlug === "elena-marsh")).toBe(true);
    expect(marsh.length).toBeGreaterThan(0);
  });

  it("updates inventory for storefront combined badge", () => {
    const target = listBooks().find((b) => b.id === "book-basement-atlas");
    expect(target && isInStock(target)).toBe(false);
    updateBookInventory("book-basement-atlas", { hawthorneOnHand: 0, cedarOnHand: 0 });
    let book = listBooks().find((b) => b.id === "book-basement-atlas");
    expect(book && isInStock(book)).toBe(false);
    updateBookInventory("book-basement-atlas", { hawthorneOnHand: 2 });
    book = listBooks().find((b) => b.id === "book-basement-atlas");
    expect(book && isInStock(book)).toBe(true);
  });

  it("staff picks drive home lists", () => {
    setStaffPicks([{ id: "solo", title: "Single list", bookIds: ["book-river-light"] }]);
    expect(getStaffPicks()[0].bookIds).toEqual(["book-river-light"]);
  });

  it("finds paid orders by id or email", () => {
    const result = processCheckout(
      {
        email: "reader@example.com",
        address: VALID_US_FIXTURE,
        payment: { cardName: "Test", cardNumber: "4111111111111111", expiry: "12/30", cvc: "123" },
        cartLines: [{ bookId: "book-river-light", quantity: 1 }],
        books: listBooks(),
      },
      () => "WP-TEST-1",
    );
    expect(result.ok).toBe(true);
    if (result.ok) addOrder(result.order);
    expect(findOrders("WP-TEST-1").length).toBe(1);
    expect(findOrders("reader@example.com").length).toBe(1);
  });
});
