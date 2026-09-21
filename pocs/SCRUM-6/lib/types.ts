export type Genre = {
  id: string;
  name: string;
  slug: string;
};

export type Author = {
  id: string;
  name: string;
  slug: string;
};

export type Book = {
  id: string;
  title: string;
  authorId: string;
  isbn: string;
  genreId: string;
  coverColor: string;
  price: number;
  quantityHawthorne: number;
  quantityCedar: number;
};

export type CartLine = {
  bookId: string;
  quantity: number;
};

export type DeliveryAddress = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
};

export type PaymentDetails = {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

export type OrderLine = {
  bookId: string;
  title: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  email: string;
  lines: OrderLine[];
  deliveryAddress: DeliveryAddress;
  createdAt: string;
};
