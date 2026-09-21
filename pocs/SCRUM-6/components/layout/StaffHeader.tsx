import Link from "next/link";

export function StaffHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Staff tools</p>
          <Link href="/staff" className="text-lg font-semibold text-foreground focus-ring">
            Willow &amp; Page back office
          </Link>
        </div>
        <nav aria-label="Staff" className="flex flex-wrap gap-3 text-sm">
          <Link href="/staff/products" className="text-foreground hover:text-primary focus-ring">
            Products
          </Link>
          <Link href="/staff/featured" className="text-foreground hover:text-primary focus-ring">
            Featured picks
          </Link>
          <Link href="/" className="text-foreground hover:text-primary focus-ring">
            Storefront
          </Link>
        </nav>
      </div>
    </header>
  );
}
