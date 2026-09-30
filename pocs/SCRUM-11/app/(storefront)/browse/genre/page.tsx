import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { listGenres } from "@/lib/store";

export default function GenreIndexPage() {
  const genres = listGenres();
  return (
    <>
      <PageHeader title="Browse by genre" description="Explore our shelves by category." />
      <ul className="grid gap-3 sm:grid-cols-2">
        {genres.map((genre) => (
          <li key={genre.slug}>
            <Link
              href={`/browse/genre/${genre.slug}`}
              className="block rounded border border-border bg-card px-4 py-3 shadow-sm hover:border-primary"
            >
              <span className="font-medium">{genre.name}</span>
              <span className="ml-2 text-sm text-muted">({genre.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
