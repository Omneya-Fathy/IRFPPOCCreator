import { CatalogClient } from "./CatalogClient";
import { getAuthors, getGenres, listBooks } from "../../lib/store";

export default function CatalogPage() {
  const books = listBooks();
  const genres = getGenres();
  const authors = getAuthors();

  return <CatalogClient books={books} genres={genres} authors={authors} />;
}
