"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatEGP } from "@/lib/currency";
import { BackButton } from "./BackButton";
import { QuantityStepper } from "./QuantityStepper";

export function CartPageClient({ deliveryFee }: { deliveryFee: number }) {
  const { items, removeItem, updateQuantity, subtotal, coupon, applyCoupon, clearCoupon, discount, isHydrated } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  if (!isHydrated) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-stone-800">Your cart is empty</h1>
        <p className="mt-2 text-stone-500">Add a magnet or event card to get started.</p>
        <Link href="/products" className="btn-primary mt-6 inline-flex">Shop Now</Link>
      </div>
    );
  }

  const total = Math.max(0, subtotal - discount) + deliveryFee;

  async function handleApplyCoupon() {
    setApplying(true);
    const result = await applyCoupon(couponInput);
    setCouponMessage(result.message);
    setApplying(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <BackButton />
      <h1 className="text-3xl font-bold text-stone-800">Your Cart</h1>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.key} className="card-surface flex gap-4 p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-cream">
              <img src={item.uploadedImageUrls[0] || item.imageUrl} alt={item.name} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-stone-800">{item.name}</h3>
                  {item.customText?.names && (
                    <p className="text-xs text-stone-500">{item.customText.names} — {item.customText.eventDate}</p>
                  )}
                  {item.uploadedImageUrls.length > 1 && (
                    <p className="text-xs text-stone-500">{item.uploadedImageUrls.length} photos uploaded</p>
                  )}
                </div>
                <button onClick={() => removeItem(item.key)} className="text-xs text-stone-400 hover:text-red-600">
                  Remove
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <QuantityStepper value={item.quantity} onChange={(q) => updateQuantity(item.key, q)} />
                <span className="font-semibold text-brand">{formatEGP(item.unitPrice * item.quantity)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card-surface p-6">
        <div className="flex gap-2">
          <input
            className="input-field"
            placeholder="Coupon code"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
          />
          <button onClick={handleApplyCoupon} disabled={applying} className="btn-outline shrink-0">
            {applying ? "Checking..." : "Apply"}
          </button>
        </div>
        {couponMessage && <p className="mt-2 text-sm text-stone-600">{couponMessage}</p>}
        {coupon && (
          <button onClick={() => { clearCoupon(); setCouponMessage(null); setCouponInput(""); }} className="mt-1 text-xs text-stone-400 hover:text-red-600">
            Remove coupon
          </button>
        )}

        <div className="mt-6 space-y-2 border-t border-stone-100 pt-4 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span>{formatEGP(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Discount ({coupon?.code})</span>
              <span>-{formatEGP(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-stone-600">
            <span>Delivery</span>
            <span>{formatEGP(deliveryFee)}</span>
          </div>
          <div className="flex justify-between border-t border-stone-100 pt-2 text-base font-bold text-stone-800">
            <span>Total</span>
            <span>{formatEGP(total)}</span>
          </div>
        </div>

        <Link href="/checkout" className="btn-primary mt-6 w-full text-center">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
