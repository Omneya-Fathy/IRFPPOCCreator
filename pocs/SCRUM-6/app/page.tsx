import { BookCard } from "../components/BookCard";
import { getFeaturedBooks } from "../lib/store";

export default function HomePage() {
  const featured = getFeaturedBooks();

  return (
    <section>
      <h1>Featured books</h1>
      <p>Staff-curated picks from Willow &amp; Page Booksellers.</p>
      <div className="book-grid" data-testid="featured-list">
        {featured.map((book) => (
          <BookCard key={book.isbn} book={book} />
        ))}
      </div>
      {featured.length === 0 && <p>No featured books selected.</p>}
    </section>
  );
}
