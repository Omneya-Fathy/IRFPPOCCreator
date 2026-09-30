import { NextResponse } from "next/server";
import type { StaffPickList } from "@/lib/types";
import { setStaffPicks } from "@/lib/store";

export async function PUT(request: Request) {
  const body = (await request.json()) as { lists?: StaffPickList[] };
  if (!body.lists || !Array.isArray(body.lists)) {
    return NextResponse.json({ ok: false, message: "Invalid payload." }, { status: 400 });
  }
  setStaffPicks(body.lists);
  return NextResponse.json({ ok: true });
}
