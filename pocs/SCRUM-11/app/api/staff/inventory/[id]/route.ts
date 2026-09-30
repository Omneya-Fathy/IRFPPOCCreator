import { NextResponse } from "next/server";
import { updateBookInventory } from "@/lib/store";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json()) as {
    priceCents?: number;
    hawthorneOnHand?: number;
    cedarOnHand?: number;
  };
  const updated = updateBookInventory(id, body);
  if (!updated) {
    return NextResponse.json({ ok: false, message: "Book not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, book: updated });
}
