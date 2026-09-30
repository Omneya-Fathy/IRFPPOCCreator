import type { ReactNode } from "react";
import { StaffNav } from "@/components/staff/staff-nav";

/** A3 — staff routes have no authentication gate in this POC. */
export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StaffNav />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </>
  );
}
