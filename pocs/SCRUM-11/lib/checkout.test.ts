import { describe, expect, it, beforeEach } from "vitest";
import { FULFILMENT_NOTE, SHIPPING_FEE_CENTS, SHIPPING_FEE_NOTE } from "./constants";
import { processCheckout } from "./checkout";
import { listBooks, resetStoreForTests } from "./store";
import { VALID_PORTLAND_FIXTURE, validatePortlandAddress } from "./portland-address";

beforeEach(() => resetStoreForTests());

describe("checkout", () => {
  it("rejects invalid Portland destination", () => {
    const result = processCheckout(
      {
        email: "a@b.com",
        address: { ...VALID_PORTLAND_FIXTURE, city: "Seattle" },
        payment: { cardName: "T", cardNumber: "4111111111111111", expiry: "12/30", cvc: "123" },
        cartLines: [{ bookId: "book-river-light", quantity: 1 }],
        books: listBooks(),
      },
      () => "WP-X",
    );
    expect(result.ok).toBe(false);
  });

  it("rejects in-store-only titles in cart", () => {
    const result = processCheckout(
      {
        email: "buyer@example.com",
        address: VALID_PORTLAND_FIXTURE,
        payment: { cardName: "Test User", cardNumber: "4111111111111111", expiry: "12/30", cvc: "123" },
        cartLines: [{ bookId: "book-portland-rain", quantity: 1 }],
        books: listBooks(),
      },
      () => "WP-2001",
    );
    expect(result.ok).toBe(false);
  });

  it("creates order with A1 shipping placeholder and fulfilment copy", () => {
    const result = processCheckout(
      {
        email: "buyer@example.com",
        address: VALID_PORTLAND_FIXTURE,
        payment: { cardName: "Test User", cardNumber: "4111111111111111", expiry: "12/30", cvc: "123" },
        cartLines: [{ bookId: "book-river-light", quantity: 1 }],
        books: listBooks(),
      },
      () => "WP-2001",
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.order.fulfilmentNote).toBe(FULFILMENT_NOTE);
      expect(result.order.shippingFeeCents).toBe(SHIPPING_FEE_CENTS);
      expect(result.order.shippingFeeNote).toBe(SHIPPING_FEE_NOTE);
      expect(result.order.totalCents).toBe(result.order.subtotalCents + SHIPPING_FEE_CENTS);
      expect(result.order.confirmationEmailQueued).toBe(true);
      expect(/monday|tuesday|wednesday|thursday|friday|saturday|sunday/i.test(result.order.fulfilmentNote)).toBe(false);
    }
    expect(validatePortlandAddress(VALID_PORTLAND_FIXTURE).ok).toBe(true);
  });
});
