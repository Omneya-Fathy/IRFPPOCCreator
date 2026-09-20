import { NextResponse } from "next/server";
import { getFeaturedBooks } from "../../../lib/store";

export function GET() {
  const books = getFeaturedBooks();
  return NextResponse.json({ books });
}
