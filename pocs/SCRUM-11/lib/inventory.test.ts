import { describe, expect, it } from "vitest";
import {
  combinedOnHand,
  isInStock,
  isInStoreOnly,
  isMailOrderEligible,
} from "./inventory";

describe("availability helpers", () => {
  it("combinedOnHand sums both locations", () => {
    expect(combinedOnHand({ hawthorneOnHand: 2, cedarOnHand: 3 })).toBe(5);
  });

  it("isInStock when either location has stock", () => {
    expect(isInStock({ hawthorneOnHand: 0, cedarOnHand: 0 })).toBe(false);
    expect(isInStock({ hawthorneOnHand: 1, cedarOnHand: 0 })).toBe(true);
    expect(isInStock({ hawthorneOnHand: 0, cedarOnHand: 2 })).toBe(true);
  });

  it("isMailOrderEligible requires Hawthorne stock", () => {
    expect(isMailOrderEligible({ hawthorneOnHand: 0, cedarOnHand: 3 })).toBe(false);
    expect(isMailOrderEligible({ hawthorneOnHand: 1, cedarOnHand: 0 })).toBe(true);
  });

  it("isInStoreOnly when Cedar-only stock", () => {
    expect(isInStoreOnly({ hawthorneOnHand: 0, cedarOnHand: 3 })).toBe(true);
    expect(isInStoreOnly({ hawthorneOnHand: 1, cedarOnHand: 0 })).toBe(false);
    expect(isInStoreOnly({ hawthorneOnHand: 0, cedarOnHand: 0 })).toBe(false);
  });
});
