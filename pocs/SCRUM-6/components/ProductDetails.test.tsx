import React from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { Book } from "../lib/store";
import { ProductDetails } from "./ProductDetails";

const inStockBook: Book = {
  isbn: "9780141439518",
  title: "Pride and Prejudice",
  author: "Jane Austen",
  genre: "Classic",
  price: 12.99,
  hawthorneQty: 5,
  cedarQty: 0,
};

const outOfStockBook: Book = {
  isbn: "9780451524935",
  title: "1984",
  author: "George Orwell",
  genre: "Science Fiction",
  price: 11.99,
  hawthorneQty: 0,
  cedarQty: 0,
};

afterEach(() => {
  cleanup();
});

describe("ProductDetails", () => {
  it("renders cover, title, author, ISBN, price, and in-stock flag", () => {
    const view = render(<ProductDetails book={inStockBook} />);

    expect(view.getByTestId("product-title")).toHaveTextContent(
      "Pride and Prejudice",
    );
    expect(view.getByTestId("product-author")).toHaveTextContent(
      "Jane Austen",
    );
    expect(view.getByTestId("product-isbn")).toHaveTextContent(
      "9780141439518",
    );
    expect(view.getByTestId("product-price")).toHaveTextContent("12.99");
    expect(view.getByTestId("product-stock")).toHaveTextContent("In stock");
    expect(
      view.getByLabelText("Cover placeholder for Pride and Prejudice"),
    ).toBeInTheDocument();
  });

  it("shows out of stock when location quantities sum to zero", () => {
    const view = render(<ProductDetails book={outOfStockBook} />);
    expect(view.getByTestId("product-stock")).toHaveTextContent(
      "Out of stock",
    );
  });
});
