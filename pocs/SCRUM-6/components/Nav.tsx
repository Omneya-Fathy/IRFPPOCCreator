import Link from "next/link";

export function Nav() {
  return (
    <nav className="site-nav">
      <Link href="/" className="brand">
        Willow &amp; Page Booksellers
      </Link>
      <div className="nav-links">
        <Link href="/catalog">Catalogue</Link>
        <Link href="/search">Search</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/staff/inventory">Staff inventory</Link>
        <Link href="/staff/orders">Staff orders</Link>
        <Link href="/staff/featured">Staff featured</Link>
      </div>
    </nav>
  );
}
