import Link from "next/link";

export function StaffNav() {
  return (
    <header className="border-b border-border bg-[#f0eeeb]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Staff tools</p>
          <Link href="/staff" className="text-base font-semibold text-foreground">
            Willow &amp; Page back office
          </Link>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm" aria-label="Staff">
          <Link href="/staff/inventory" className="hover:underline">Inventory</Link>
          <Link href="/staff/picks" className="hover:underline">Staff picks</Link>
          <Link href="/staff/orders" className="hover:underline">Orders</Link>
          <Link href="/" className="text-muted hover:underline">View storefront</Link>
        </nav>
      </div>
    </header>
  );
}
