import { FULFILMENT_NOTE, SHIPPING_FEE_CENTS, SHIPPING_FEE_NOTE } from "./constants";
import { buildCartDetails } from "./cart";
import { isMailOrderEligible } from "./inventory";
import { validatePortlandAddress } from "./portland-address";
import type { Book, CartLine, Order, PaymentFields, PortlandAddress } from "./types";

export type CheckoutInput = {
  email: string;
  address: PortlandAddress;
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
  const addressResult = validatePortlandAddress(input.address);
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
  const bookById = new Map(input.books.map((b) => [b.id, b]));
  for (const line of input.cartLines) {
    const book = bookById.get(line.bookId);
    if (!book || !isMailOrderEligible(book)) {
      return { ok: false, message: "Your cart includes titles that are not available for Portland mail order." };
    }
  }
  const subtotalCents = details.reduce((sum, row) => sum + row.lineTotalCents, 0);
  const order: Order = {
    id: createId(),
    email: input.email.trim(),
    status: "paid",
    address: {
      ...input.address,
      city: input.address.city.trim(),
      state: input.address.state.trim().toUpperCase(),
    },
    lineItems: details.map((row) => ({
      bookId: row.bookId,
      title: row.title,
      quantity: row.quantity,
      unitPriceCents: row.unitPriceCents,
    })),
    subtotalCents,
    shippingFeeCents: SHIPPING_FEE_CENTS,
    shippingFeeNote: SHIPPING_FEE_NOTE,
    totalCents: subtotalCents + SHIPPING_FEE_CENTS,
    createdAt: new Date().toISOString(),
    fulfilmentNote: FULFILMENT_NOTE,
    confirmationEmailQueued: true,
  };
  return { ok: true, order };
}
