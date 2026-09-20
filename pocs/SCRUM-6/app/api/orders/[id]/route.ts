import { NextResponse } from "next/server";
import { getEmailForOrder, getOrder } from "../../../../lib/store";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  const email = getEmailForOrder(id);
  return NextResponse.json({ order, email });
}
