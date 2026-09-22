import { describe, expect, it } from "vitest";
import { INITIAL_BOOKS, loadCatalogFixtureCount } from "./catalog-fixtures";

describe("catalog fixtures", () => {
  it("returns expected count and fields", () => {
    expect(loadCatalogFixtureCount()).toBe(INITIAL_BOOKS.length);
    expect(INITIAL_BOOKS.length).toBeGreaterThanOrEqual(5);
    for (const book of INITIAL_BOOKS) {
      expect(book.genre).toBeTruthy();
      expect(book.author).toBeTruthy();
      expect(book.priceCents).toBeGreaterThan(0);
    }
  });
});
