'use client'

import { Food } from "@/constant/foods";
import { MenuItem } from "@/types/MenuItemType";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction
} from "react";

/* ---------------- TYPES ---------------- */

export type CartItem = MenuItem & {
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
};

/* ---------------- CONTEXT ---------------- */

export const CartContext = createContext<CartContextType | null>(null);

/* ---------------- PROVIDER ---------------- */

export const CartProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};
