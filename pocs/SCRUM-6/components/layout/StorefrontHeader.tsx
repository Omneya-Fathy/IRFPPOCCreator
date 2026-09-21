import Link from "next/link";
import { listAuthors, listGenres } from "../../lib/store";
import { SearchForm } from "../SearchForm";

export function StorefrontHeader() {
  const genres = listGenres();
  const authors = listAuthors();

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-xl font-semibold text-foreground focus-ring">
              Willow &amp; Page Booksellers
            </Link>
            <p className="text-sm text-muted-foreground">
              Hawthorne &amp; Cedar — Portland&apos;s neighborhood bookshops
            </p>
          </div>
          <nav aria-label="Primary" className="flex flex-wrap gap-3 text-sm">
            <Link href="/" className="text-foreground hover:text-primary focus-ring">
              Home
            </Link>
            <Link href="/cart" className="text-foreground hover:text-primary focus-ring">
              Cart
            </Link>
            <Link href="/staff" className="text-foreground hover:text-primary focus-ring">
              Staff
            </Link>
          </nav>
        </div>
        <SearchForm />
        <nav aria-label="Browse" className="flex flex-wrap gap-2 text-sm">
          <span className="font-medium text-muted-foreground">Genres:</span>
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.slug}`}
              className="rounded-full bg-muted px-3 py-1 text-foreground hover:bg-border focus-ring"
            >
              {genre.name}
            </Link>
          ))}
          <span className="mx-1 text-muted-foreground">|</span>
          <span className="font-medium text-muted-foreground">Authors:</span>
          {authors.slice(0, 3).map((author) => (
            <Link
              key={author.id}
              href={`/author/${author.slug}`}
              className="rounded-full bg-muted px-3 py-1 text-foreground hover:bg-border focus-ring"
            >
              {author.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
