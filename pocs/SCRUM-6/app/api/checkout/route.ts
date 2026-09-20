import { NextResponse } from "next/server";
import { checkout } from "../../../lib/store";
import type { DeliveryAddress } from "../../../lib/store";
import { validateCheckoutAddress } from "../../../lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const address = body.address as Partial<DeliveryAddress>;
    const validationError = validateCheckoutAddress(address);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const result = checkout({ address: address as DeliveryAddress });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
