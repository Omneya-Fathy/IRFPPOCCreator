import { NextResponse } from "next/server";
import { findOrders } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const orders = findOrders(q);
  return NextResponse.json({ ok: true, orders });
}
