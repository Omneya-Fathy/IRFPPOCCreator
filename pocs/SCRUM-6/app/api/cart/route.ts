import { NextResponse } from "next/server";
import {
  addToCart,
  getBook,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../../../lib/store";

export function GET() {
  const items = getCart();
  const enriched = items.map((item) => {
    const book = getBook(item.isbn);
    return {
      ...item,
      title: book?.title ?? "Unknown",
      price: book?.price ?? 0,
    };
  });
  const total = enriched.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return NextResponse.json({ items: enriched, total });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, isbn, quantity } = body as {
      action: "add" | "update" | "remove";
      isbn: string;
      quantity?: number;
    };

    if (!isbn) {
      return NextResponse.json({ error: "ISBN is required" }, { status: 400 });
    }

    if (action === "add") {
      const items = addToCart(isbn, quantity ?? 1);
      return NextResponse.json({ items });
    }
    if (action === "update") {
      const items = updateCartItem(isbn, quantity ?? 1);
      return NextResponse.json({ items });
    }
    if (action === "remove") {
      const items = removeFromCart(isbn);
      return NextResponse.json({ items });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cart error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
