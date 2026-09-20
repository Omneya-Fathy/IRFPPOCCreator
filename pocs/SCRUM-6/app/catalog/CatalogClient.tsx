"use client";

import { useMemo, useState } from "react";
import { BookCard } from "../../components/BookCard";
import type { Book } from "../../lib/store";

type CatalogClientProps = {
  books: Book[];
  genres: string[];
  authors: string[];
};

export function CatalogClient({ books, genres, authors }: CatalogClientProps) {
  const [genre, setGenre] = useState("");
  const [author, setAuthor] = useState("");

  const filtered = useMemo(() => {
    return books.filter((book) => {
      const genreMatch = !genre || book.genre === genre;
      const authorMatch = !author || book.author === author;
      return genreMatch && authorMatch;
    });
  }, [books, genre, author]);

  return (
    <section>
      <h1>Catalogue</h1>
      <form className="filter-form" onSubmit={(event) => event.preventDefault()}>
        <label>
          Genre
          <select
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            data-testid="genre-filter"
          >
            <option value="">All genres</option>
            {genres.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          Author
          <select
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            data-testid="author-filter"
          >
            <option value="">All authors</option>
            {authors.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
      </form>
      <div className="book-grid" data-testid="catalog-results">
        {filtered.map((book) => (
          <BookCard key={book.isbn} book={book} />
        ))}
      </div>
      {filtered.length === 0 && <p>No books match the selected filters.</p>}
    </section>
  );
}
