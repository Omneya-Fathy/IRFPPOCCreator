import type { Book, StaffPickList } from "./types";

export const INITIAL_BOOKS: Book[] = [
  {
    id: "book-river-light",
    title: "River Light",
    author: "Elena Marsh",
    authorSlug: "elena-marsh",
    genre: "Literary Fiction",
    genreSlug: "literary-fiction",
    isbn: "9780394481054",
    priceCents: 1899,
    coverPath: "/covers/river-light.svg",
    hawthorneOnHand: 4,
    cedarOnHand: 2,
  },
  {
    id: "book-portland-rain",
    title: "Portland Rain",
    author: "James Okonkwo",
    authorSlug: "james-okonkwo",
    genre: "Mystery",
    genreSlug: "mystery",
    isbn: "9780143127550",
    priceCents: 1599,
    coverPath: "/covers/portland-rain.svg",
    hawthorneOnHand: 0,
    cedarOnHand: 3,
  },
  {
    id: "book-cedar-walk",
    title: "The Cedar Walk",
    author: "Elena Marsh",
    authorSlug: "elena-marsh",
    genre: "Literary Fiction",
    genreSlug: "literary-fiction",
    isbn: "9780062315007",
    priceCents: 1799,
    coverPath: "/covers/cedar-walk.svg",
    hawthorneOnHand: 1,
    cedarOnHand: 0,
  },
  {
    id: "book-basement-atlas",
    title: "Basement Atlas",
    author: "Sofia Nguyen",
    authorSlug: "sofia-nguyen",
    genre: "Essays",
    genreSlug: "essays",
    isbn: "9781524748135",
    priceCents: 1699,
    coverPath: "/covers/basement-atlas.svg",
    hawthorneOnHand: 0,
    cedarOnHand: 0,
  },
  {
    id: "book-hawthorne-hours",
    title: "Hawthorne Hours",
    author: "James Okonkwo",
    authorSlug: "james-okonkwo",
    genre: "Mystery",
    genreSlug: "mystery",
    isbn: "9780316769488",
    priceCents: 1499,
    coverPath: "/covers/hawthorne-hours.svg",
    hawthorneOnHand: 6,
    cedarOnHand: 1,
  },
  {
    id: "book-shelf-notes",
    title: "Shelf Notes",
    author: "Sofia Nguyen",
    authorSlug: "sofia-nguyen",
    genre: "Essays",
    genreSlug: "essays",
    isbn: "9780307474278",
    priceCents: 1399,
    coverPath: "/covers/shelf-notes.svg",
    hawthorneOnHand: 2,
    cedarOnHand: 2,
  },
];

export const INITIAL_STAFF_PICKS: StaffPickList[] = [
  {
    id: "picks-staff-favorites",
    title: "Staff favorites this month",
    bookIds: ["book-river-light", "book-hawthorne-hours", "book-shelf-notes"],
  },
  {
    id: "picks-pnw-voices",
    title: "Pacific Northwest voices",
    bookIds: ["book-portland-rain", "book-cedar-walk"],
  },
];

export function loadCatalogFixtureCount(): number {
  return INITIAL_BOOKS.length;
}
