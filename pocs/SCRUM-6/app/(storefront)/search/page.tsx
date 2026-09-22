import { BookCard } from "@/components/storefront/book-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { searchBooks } from "@/lib/search";
import { listBooks } from "@/lib/store";
import { SearchForm } from "@/components/storefront/search-form";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = searchBooks(listBooks(), q);

  return (
    <>
      <PageHeader title="Search" description="Search our catalogue by title or ISBN." />
      <SearchForm initialQuery={q} />
      {q.trim() === "" ? (
        <p className="mt-6 text-sm text-muted">Enter a title or ISBN to see results.</p>
      ) : results.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No matches">Try a different spelling or ISBN.</EmptyState>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </>
  );
}
