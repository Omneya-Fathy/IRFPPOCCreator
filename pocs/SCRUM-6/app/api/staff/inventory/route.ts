import { NextResponse } from "next/server";
import { listBooks, updateInventory } from "../../../../lib/store";

export function GET() {
  return NextResponse.json({ books: listBooks() });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { isbn, price, hawthorneQty, cedarQty } = body as {
      isbn: string;
      price?: number;
      hawthorneQty?: number;
      cedarQty?: number;
    };

    if (!isbn) {
      return NextResponse.json({ error: "ISBN is required" }, { status: 400 });
    }

    const book = updateInventory({ isbn, price, hawthorneQty, cedarQty });
    return NextResponse.json({ book });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Inventory update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
