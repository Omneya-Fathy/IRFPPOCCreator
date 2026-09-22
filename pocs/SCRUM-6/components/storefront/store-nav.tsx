import Link from "next/link";

export function StoreNav({ cartCount = 0 }: { cartCount?: number }) {
  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-primary">
          Willow &amp; Page
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium" aria-label="Storefront">
          <Link href="/browse/genre" className="text-foreground hover:text-primary">
            Browse genres
          </Link>
          <Link href="/browse/author" className="text-foreground hover:text-primary">
            Browse authors
          </Link>
          <Link href="/search" className="text-foreground hover:text-primary">
            Search
          </Link>
          <Link href="/cart" className="text-foreground hover:text-primary">
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
        </nav>
      </div>
    </header>
  );
}
