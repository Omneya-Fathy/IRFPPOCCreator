import type { Author, Book, Genre } from "../lib/types";

export const initialGenres: Genre[] = [
  { id: "genre-fiction", name: "Fiction", slug: "fiction" },
  { id: "genre-fantasy", name: "Fantasy", slug: "fantasy" },
  { id: "genre-sci-fi", name: "Science Fiction", slug: "sci-fi" },
  { id: "genre-literary", name: "Literary Fiction", slug: "literary-fiction" },
];

export const initialAuthors: Author[] = [
  { id: "author-zafon", name: "Carlos Ruiz Zafón", slug: "carlos-ruiz-zafon" },
  { id: "author-clarke", name: "Susanna Clarke", slug: "susanna-clarke" },
  { id: "author-chambers", name: "Becky Chambers", slug: "becky-chambers" },
  { id: "author-ishiguro", name: "Kazuo Ishiguro", slug: "kazuo-ishiguro" },
  { id: "author-yu", name: "Charles Yu", slug: "charles-yu" },
];

export const initialBooks: Book[] = [
  {
    id: "book-shadow-wind",
    title: "The Shadow of the Wind",
    authorId: "author-zafon",
    isbn: "9780143034902",
    genreId: "genre-fiction",
    coverColor: "#8b5e3c",
    price: 16.99,
    quantityHawthorne: 3,
    quantityCedar: 2,
  },
  {
    id: "book-piranesi",
    title: "Piranesi",
    authorId: "author-clarke",
    isbn: "9781635575637",
    genreId: "genre-fantasy",
    coverColor: "#4a6741",
    price: 18.5,
    quantityHawthorne: 1,
    quantityCedar: 0,
  },
  {
    id: "book-psalm-wild",
    title: "A Psalm for the Wild-Built",
    authorId: "author-chambers",
    isbn: "9781250218153",
    genreId: "genre-sci-fi",
    coverColor: "#c17f59",
    price: 17.25,
    quantityHawthorne: 0,
    quantityCedar: 0,
  },
  {
    id: "book-klara",
    title: "Klara and the Sun",
    authorId: "author-ishiguro",
    isbn: "9780593318171",
    genreId: "genre-literary",
    coverColor: "#6b4c6e",
    price: 19.99,
    quantityHawthorne: 0,
    quantityCedar: 4,
  },
  {
    id: "book-interior",
    title: "Interior Chinatown",
    authorId: "author-yu",
    isbn: "9780375427765",
    genreId: "genre-literary",
    coverColor: "#b8860b",
    price: 15.5,
    quantityHawthorne: 2,
    quantityCedar: 1,
  },
];

export const initialFeaturedIds: string[] = [
  "book-shadow-wind",
  "book-piranesi",
  "book-klara",
];
