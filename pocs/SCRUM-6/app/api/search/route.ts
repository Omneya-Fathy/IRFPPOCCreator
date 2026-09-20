import { NextResponse } from "next/server";
import { searchBooks } from "../../../lib/store";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const books = searchBooks(query);
  return NextResponse.json({ books, query });
}
