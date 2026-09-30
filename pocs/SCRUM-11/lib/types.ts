export type Book = {
  id: string;
  title: string;
  author: string;
  authorSlug: string;
  genre: string;
  genreSlug: string;
  isbn: string;
  priceCents: number;
  hawthorneOnHand: number;
  cedarOnHand: number;
};

export type StaffPickList = {
  id: string;
  title: string;
  bookIds: string[];
};

export type PortlandAddress = {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
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
  address: PortlandAddress;
  lineItems: OrderLine[];
  subtotalCents: number;
  shippingFeeCents: number;
  shippingFeeNote: string;
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
