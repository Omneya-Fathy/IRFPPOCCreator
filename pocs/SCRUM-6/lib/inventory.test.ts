import { describe, expect, it } from "vitest";
import { isInStock } from "./inventory";

describe("isInStock (A2)", () => {
  it("is false when both locations are zero", () => {
    expect(isInStock({ hawthorneOnHand: 0, cedarOnHand: 0 })).toBe(false);
  });

  it("is true when only Hawthorne has stock", () => {
    expect(isInStock({ hawthorneOnHand: 1, cedarOnHand: 0 })).toBe(true);
  });

  it("is true when only Cedar has stock", () => {
    expect(isInStock({ hawthorneOnHand: 0, cedarOnHand: 2 })).toBe(true);
  });

  it("is true when both locations have stock", () => {
    expect(isInStock({ hawthorneOnHand: 3, cedarOnHand: 1 })).toBe(true);
  });
});
