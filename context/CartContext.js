"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token, user } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [error, setError] = useState(null);

  const refreshCart = useCallback(async () => {
    if (!token) {
      setCart({ items: [], subtotal: 0 });
      return;
    }
    try {
      const data = await api.getCart(token);
      setCart(data);
    } catch {
      setCart({ items: [], subtotal: 0 });
    }
  }, [token]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  async function addItem(productId, quantity = 1) {
    setError(null);
    if (!user) {
      // Auth is required to add to cart — send them to login and back here.
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    try {
      const data = await api.addToCart(productId, quantity, token);
      setCart(data);
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }

  async function updateItem(productId, quantity) {
    setError(null);
    try {
      const data = await api.updateCartItem(productId, quantity, token);
      setCart(data);
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }

  async function removeItem(productId) {
    const data = await api.removeCartItem(productId, token);
    setCart(data);
  }

  async function clearCart() {
    const data = await api.clearCart(token);
    setCart(data);
  }

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, itemCount, error, addItem, updateItem, removeItem, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
