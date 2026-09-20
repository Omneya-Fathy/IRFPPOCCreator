import { NextResponse } from "next/server";
import { getOrder, listOrders } from "../../../../lib/store";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const order = getOrder(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  }
  return NextResponse.json({ orders: listOrders() });
}
