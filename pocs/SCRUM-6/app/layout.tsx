import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Willow & Page Booksellers",
  description: "Independent bookstore e-commerce demo. Fake data only.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
