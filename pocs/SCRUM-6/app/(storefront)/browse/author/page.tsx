import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { listAuthors } from "@/lib/store";

export default function AuthorIndexPage() {
  const authors = listAuthors();
  return (
    <>
      <PageHeader title="Browse by author" description="Find books by your favorite writers." />
      <ul className="grid gap-3 sm:grid-cols-2">
        {authors.map((author) => (
          <li key={author.slug}>
            <Link
              href={`/browse/author/${author.slug}`}
              className="block rounded border border-border bg-card px-4 py-3 shadow-sm hover:border-primary"
            >
              <span className="font-medium">{author.name}</span>
              <span className="ml-2 text-sm text-muted">({author.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
