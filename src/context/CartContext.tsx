"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { CartItem } from "@/lib/types";

const STORAGE_KEY = "magnetiq_cart_v1";
const COUPON_STORAGE_KEY = "magnetiq_coupon_v1";

interface CouponState {
  code: string;
  percent: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  isHydrated: boolean;
  coupon: CouponState | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  clearCoupon: () => void;
  discount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<CouponState | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      const rawCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (rawCoupon) setCoupon(JSON.parse(rawCoupon));
    } catch {
      // ignore corrupt storage
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (coupon) localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
    else localStorage.removeItem(COUPON_STORAGE_KEY);
  }, [coupon, isHydrated]);

  function addItem(item: CartItem) {
    setItems((prev) => [...prev, item]);
  }

  function removeItem(key: string) {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  function updateQuantity(key: string, quantity: number) {
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  }

  function clearCart() {
    setItems([]);
    setCoupon(null);
  }

  async function applyCoupon(code: string) {
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.valid) {
        setCoupon({ code: data.code, percent: data.percent });
        return { success: true, message: `Coupon applied: -${data.percent}%` };
      }
      setCoupon(null);
      return { success: false, message: data.message || "Invalid coupon." };
    } catch {
      return { success: false, message: "Could not validate coupon. Try again." };
    }
  }

  function clearCoupon() {
    setCoupon(null);
  }

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items]
  );
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const discount = useMemo(
    () => (coupon ? Math.round((subtotal * coupon.percent) / 100) : 0),
    [coupon, subtotal]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
        isHydrated,
        coupon,
        applyCoupon,
        clearCoupon,
        discount,
      }}
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
