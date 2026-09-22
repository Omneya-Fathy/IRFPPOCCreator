import { NextResponse } from "next/server";
import { processCheckout } from "@/lib/checkout";
import type { CartLine, PaymentFields, UsAddress } from "@/lib/types";
import { addOrder, listBooks, nextOrderId } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    address?: UsAddress;
    payment?: PaymentFields;
    cartLines?: CartLine[];
  };

  const result = processCheckout(
    {
      email: body.email ?? "",
      address: body.address ?? {
        name: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
      payment: body.payment ?? { cardName: "", cardNumber: "", expiry: "", cvc: "" },
      cartLines: body.cartLines ?? [],
      books: listBooks(),
    },
    nextOrderId,
  );

  if (!result.ok) {
    return NextResponse.json({ ok: false, message: result.message }, { status: 400 });
  }

  addOrder(result.order);
  return NextResponse.json({ ok: true, orderId: result.order.id });
}
