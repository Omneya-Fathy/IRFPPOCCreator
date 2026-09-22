import { describe, expect, it } from "vitest";
import { INITIAL_BOOKS } from "./catalog-fixtures";
import { addToCart, buildCartDetails, cartItemCount, cartSubtotalCents, removeFromCart, updateCartQuantity } from "./cart";

describe("cart helpers", () => {
  it("adds items and computes totals", () => {
    let lines = addToCart([], "book-river-light", 1);
    lines = addToCart(lines, "book-river-light", 1);
    lines = addToCart(lines, "book-portland-rain", 1);
    expect(cartItemCount(lines)).toBe(3);
    expect(cartSubtotalCents(lines, INITIAL_BOOKS)).toBe(1899 + 1899 + 1599);
    const details = buildCartDetails(lines, INITIAL_BOOKS);
    expect(details.length).toBe(2);
  });

  it("updates quantity and removes lines", () => {
    let lines = addToCart([], "book-river-light", 2);
    lines = updateCartQuantity(lines, "book-river-light", 4);
    expect(cartItemCount(lines)).toBe(4);
    lines = removeFromCart(lines, "book-river-light");
    expect(lines.length).toBe(0);
  });
});
