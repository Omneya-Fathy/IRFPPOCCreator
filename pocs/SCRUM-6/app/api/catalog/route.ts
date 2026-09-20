import { NextResponse } from "next/server";
import { listBooks } from "../../../lib/store";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get("genre") ?? undefined;
  const author = searchParams.get("author") ?? undefined;
  const books = listBooks({ genre, author });
  return NextResponse.json({ books });
}
