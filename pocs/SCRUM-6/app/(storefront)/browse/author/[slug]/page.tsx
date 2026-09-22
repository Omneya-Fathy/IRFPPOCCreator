import { BookCard } from "@/components/storefront/book-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { booksByAuthorSlug, listAuthors } from "@/lib/store";

export default async function AuthorListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = listAuthors().find((a) => a.slug === slug);
  const books = booksByAuthorSlug(slug);

  return (
    <>
      <PageHeader
        title={author?.name ?? "Author"}
        description={author ? `${books.length} titles by this author.` : "Unknown author."}
      />
      {books.length === 0 ? (
        <EmptyState title="No titles found">Try another author from the browse list.</EmptyState>
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
