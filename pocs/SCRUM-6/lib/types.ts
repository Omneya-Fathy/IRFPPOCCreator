export type Book = {
  id: string;
  title: string;
  author: string;
  authorSlug: string;
  genre: string;
  genreSlug: string;
  isbn: string;
  priceCents: number;
  coverPath: string;
  hawthorneOnHand: number;
  cedarOnHand: number;
};

export type StaffPickList = {
  id: string;
  title: string;
  bookIds: string[];
};

export type UsAddress = {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type CartLine = {
  bookId: string;
  quantity: number;
};

export type OrderLine = {
  bookId: string;
  title: string;
  quantity: number;
  unitPriceCents: number;
};

export type Order = {
  id: string;
  email: string;
  status: "paid";
  address: UsAddress;
  lineItems: OrderLine[];
  totalCents: number;
  createdAt: string;
  fulfilmentNote: string;
  confirmationEmailQueued: boolean;
};

export type PaymentFields = {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};
