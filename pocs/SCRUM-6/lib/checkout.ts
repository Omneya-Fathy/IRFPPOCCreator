import { FULFILMENT_NOTE } from "./constants";
import { buildCartDetails } from "./cart";
import { validateUsAddress } from "./us-address";
import type { Book, CartLine, Order, PaymentFields, UsAddress } from "./types";

export type CheckoutInput = {
  email: string;
  address: UsAddress;
  payment: PaymentFields;
  cartLines: CartLine[];
  books: Book[];
};

export type CheckoutResult =
  | { ok: true; order: Order }
  | { ok: false; message: string };

function validatePayment(payment: PaymentFields): string | null {
  if (!payment.cardName.trim()) return "Cardholder name is required.";
  const digits = payment.cardNumber.replace(/\s/g, "");
  if (digits.length < 15) return "Enter a valid card number.";
  if (!payment.expiry.trim()) return "Expiry is required.";
  if (payment.cvc.trim().length < 3) return "CVC is required.";
  return null;
}

export function processCheckout(input: CheckoutInput, createId: () => string): CheckoutResult {
  if (!input.email.trim() || !input.email.includes("@")) {
    return { ok: false, message: "A valid email is required for your confirmation." };
  }
  const addressResult = validateUsAddress(input.address);
  if (!addressResult.ok) {
    return { ok: false, message: addressResult.message };
  }
  const paymentError = validatePayment(input.payment);
  if (paymentError) {
    return { ok: false, message: paymentError };
  }
  const details = buildCartDetails(input.cartLines, input.books);
  if (details.length === 0) {
    return { ok: false, message: "Your cart is empty." };
  }
  const totalCents = details.reduce((sum, row) => sum + row.lineTotalCents, 0);
  const order: Order = {
    id: createId(),
    email: input.email.trim(),
    status: "paid",
    address: {
      ...input.address,
      country: "US",
      state: input.address.state.trim().toUpperCase(),
    },
    lineItems: details.map((row) => ({
      bookId: row.bookId,
      title: row.title,
      quantity: row.quantity,
      unitPriceCents: row.unitPriceCents,
    })),
    totalCents,
    createdAt: new Date().toISOString(),
    fulfilmentNote: FULFILMENT_NOTE,
    confirmationEmailQueued: true,
  };
  return { ok: true, order };
}
