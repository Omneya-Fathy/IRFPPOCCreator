"use client";

import type { ReactNode } from "react";
import { StoreNav } from "./store-nav";
import { useCart } from "@/components/cart/cart-provider";

export function StoreShell({ children }: { children: ReactNode }) {
  const { itemCount } = useCart();
  return (
    <>
      <StoreNav cartCount={itemCount} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </>
  );
}
