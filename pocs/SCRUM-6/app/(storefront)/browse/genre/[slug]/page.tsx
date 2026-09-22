import { BookCard } from "@/components/storefront/book-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { booksByGenreSlug, listGenres } from "@/lib/store";

export default async function GenreListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const genre = listGenres().find((g) => g.slug === slug);
  const books = booksByGenreSlug(slug);

  return (
    <>
      <PageHeader
        title={genre?.name ?? "Genre"}
        description={genre ? `${books.length} titles in this genre.` : "Unknown genre."}
      />
      {books.length === 0 ? (
        <EmptyState title="No titles found">Try another genre from the browse list.</EmptyState>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </>
  );
}
