"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addToCart as addLine,
  cartItemCount,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/cart";
import type { CartLine } from "@/lib/types";

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  addToCart: (bookId: string, quantity?: number) => void;
  setQuantity: (bookId: string, quantity: number) => void;
  removeLine: (bookId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addToCart = useCallback((bookId: string, quantity = 1) => {
    setLines((prev) => addLine(prev, bookId, quantity));
  }, []);

  const setQuantity = useCallback((bookId: string, quantity: number) => {
    setLines((prev) => updateCartQuantity(prev, bookId, quantity));
  }, []);

  const removeLine = useCallback((bookId: string) => {
    setLines((prev) => removeFromCart(prev, bookId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({
      lines,
      itemCount: cartItemCount(lines),
      addToCart,
      setQuantity,
      removeLine,
      clearCart,
    }),
    [lines, addToCart, setQuantity, removeLine, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
