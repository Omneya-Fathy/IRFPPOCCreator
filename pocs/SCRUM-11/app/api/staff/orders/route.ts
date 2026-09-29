import { NextResponse } from "next/server";
import { findGuestOrder } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId") ?? "";
  const email = searchParams.get("email") ?? "";
  const orders = findGuestOrder(orderId, email);
  return NextResponse.json({ ok: true, orders });
}
