import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";

export const metadata = {
  title: "Willow & Page Booksellers",
  description: "Independent bookstore demo. Local fake data only.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
