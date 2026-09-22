import { describe, expect, it, beforeEach } from "vitest";
import { FULFILMENT_NOTE } from "./constants";
import { processCheckout } from "./checkout";
import { listBooks, resetStoreForTests } from "./store";
import { VALID_US_FIXTURE, validateUsAddress } from "./us-address";

beforeEach(() => resetStoreForTests());

describe("checkout", () => {
  it("rejects invalid US destination", () => {
    const result = processCheckout(
      {
        email: "a@b.com",
        address: { ...VALID_US_FIXTURE, country: "FR" },
        payment: { cardName: "T", cardNumber: "4111111111111111", expiry: "12/30", cvc: "123" },
        cartLines: [{ bookId: "book-river-light", quantity: 1 }],
        books: listBooks(),
      },
      () => "WP-X",
    );
    expect(result.ok).toBe(false);
  });

  it("creates order for valid US flow with A4 copy", () => {
    const result = processCheckout(
      {
        email: "buyer@example.com",
        address: VALID_US_FIXTURE,
        payment: { cardName: "Test User", cardNumber: "4111111111111111", expiry: "12/30", cvc: "123" },
        cartLines: [{ bookId: "book-river-light", quantity: 1 }],
        books: listBooks(),
      },
      () => "WP-2001",
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.order.fulfilmentNote).toBe(FULFILMENT_NOTE);
      expect(result.order.confirmationEmailQueued).toBe(true);
      expect(/monday|tuesday|wednesday|thursday|friday|saturday|sunday/i.test(result.order.fulfilmentNote)).toBe(false);
    }
    expect(validateUsAddress(VALID_US_FIXTURE).ok).toBe(true);
  });
});
