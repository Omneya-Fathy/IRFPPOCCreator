import type { ReactNode } from "react";
import { Nav } from "../components/Nav";
import "./globals.css";

export const metadata = {
  title: "Willow & Page Booksellers",
  description: "Local proof of concept. Fake data only.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="page-content">{children}</main>
      </body>
    </html>
  );
}
