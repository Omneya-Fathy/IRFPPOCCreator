import { NextResponse } from "next/server";
import { getFeaturedIsbns, setFeaturedIsbns } from "../../../../lib/store";

export function GET() {
  return NextResponse.json({ isbns: getFeaturedIsbns() });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { isbns } = body as { isbns: string[] };
    if (!Array.isArray(isbns)) {
      return NextResponse.json(
        { error: "isbns must be an array" },
        { status: 400 },
      );
    }
    const updated = setFeaturedIsbns(isbns);
    return NextResponse.json({ isbns: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Featured update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
