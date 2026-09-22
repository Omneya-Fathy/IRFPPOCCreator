import { describe, expect, it } from "vitest";
import { INITIAL_BOOKS } from "./catalog-fixtures";
import { searchBooks } from "./search";

describe("searchBooks", () => {
  it("matches by title", () => {
    const results = searchBooks(INITIAL_BOOKS, "river light");
    expect(results.some((b) => b.id === "book-river-light")).toBe(true);
  });

  it("matches by ISBN", () => {
    const results = searchBooks(INITIAL_BOOKS, "9780143127550");
    expect(results.some((b) => b.id === "book-portland-rain")).toBe(true);
  });
});
