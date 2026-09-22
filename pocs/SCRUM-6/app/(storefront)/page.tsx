import Link from "next/link";
import { BookCard } from "@/components/storefront/book-card";
import { PageHeader } from "@/components/ui/page-header";
import { getBook, getStaffPicks } from "@/lib/store";

export default function HomePage() {
  const pickLists = getStaffPicks();

  return (
    <>
      <PageHeader
        title="Willow & Page Booksellers"
        description="Curated reads from our Hawthorne and Cedar shops—browse, search, and check out as a guest."
      />
      <div className="flex flex-col gap-10">
        {pickLists.map((list) => {
          const books = list.bookIds
            .map((id) => getBook(id))
            .filter((b): b is NonNullable<typeof b> => Boolean(b));
          if (books.length === 0) return null;
          return (
            <section key={list.id} aria-labelledby={`pick-${list.id}`}>
              <h2 id={`pick-${list.id}`} className="mb-4 text-xl font-semibold">
                {list.title}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          );
        })}
        <p className="text-sm text-muted">
          Looking for something specific? Try{" "}
          <Link href="/search" className="font-medium text-primary underline-offset-2 hover:underline">
            search by title or ISBN
          </Link>
          .
        </p>
      </div>
    </>
  );
}
