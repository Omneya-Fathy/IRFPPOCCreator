"use client";

import { useState } from "react";
import { BookCard } from "../../components/BookCard";
import type { Book } from "../../lib/store";

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [searched, setSearched] = useState(false);

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    setResults(data.books ?? []);
    setSearched(true);
  }

  return (
    <section>
      <h1>Search</h1>
      <form className="search-form" onSubmit={handleSearch}>
        <label>
          Title or ISBN
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or ISBN"
            data-testid="search-input"
          />
        </label>
        <button type="submit">Search</button>
      </form>
      <div className="book-grid" data-testid="search-results">
        {results.map((book) => (
          <BookCard key={book.isbn} book={book} />
        ))}
      </div>
      {searched && results.length === 0 && <p>No books found.</p>}
    </section>
  );
}
