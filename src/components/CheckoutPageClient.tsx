"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatEGP } from "@/lib/currency";
import { createOrder } from "@/app/checkout/actions";
import { PaymentMethod } from "@/lib/types";
import { BackButton } from "./BackButton";

interface CheckoutPrefill {
  customerName: string;
  phone: string;
  address: string;
  city: string;
}

export function CheckoutPageClient({
  deliveryFee,
  instapayNumber,
  whatsappNumber,
  prefill,
}: {
  deliveryFee: number;
  instapayNumber: string;
  whatsappNumber: string;
  prefill: CheckoutPrefill | null;
}) {
  const { items, subtotal, discount, coupon, clearCart, isHydrated } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    customerName: prefill?.customerName ?? "",
    phone: prefill?.phone ?? "",
    address: prefill?.address ?? "",
    city: prefill?.city ?? "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // `placed` keeps this guard from bouncing to /cart after a successful
  // order empties the cart while we navigate to the confirmation page.
  if (isHydrated && items.length === 0 && !placed) {
    router.replace("/cart");
    return null;
  }

  const total = Math.max(0, subtotal - discount) + deliveryFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await createOrder(form, items, coupon?.code || null, paymentMethod);
      if (!result.success || !result.orderNumber) {
        setError(result.message || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setPlaced(true);
      clearCart();
      router.push(`/order/${result.orderNumber}/confirmation`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <BackButton />
      <h1 className="text-3xl font-bold text-stone-800">Checkout</h1>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <form onSubmit={handleSubmit} className="card-surface space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Full name</label>
            <input
              required
              className="input-field"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Phone number</label>
            <input
              required
              type="tel"
              className="input-field"
              placeholder="01xxxxxxxxx"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Address</label>
            <input
              required
              className="input-field"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">City</label>
            <input
              required
              className="input-field"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Notes (optional)</label>
            <textarea
              className="input-field"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-stone-700">Payment method</p>
            <div className="space-y-2">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${
                  paymentMethod === "COD" ? "border-brand bg-brand/5" : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="accent-brand"
                />
                <span>
                  <span className="font-semibold text-stone-800">Cash on Delivery</span>
                  <span className="block text-xs text-stone-500">Pay in cash when your order arrives.</span>
                </span>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${
                  paymentMethod === "INSTAPAY" ? "border-brand bg-brand/5" : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "INSTAPAY"}
                  onChange={() => setPaymentMethod("INSTAPAY")}
                  className="accent-brand"
                />
                <span>
                  <span className="font-semibold text-stone-800">InstaPay</span>
                  <span className="block text-xs text-stone-500">
                    Transfer via InstaPay, then send the receipt on WhatsApp.
                  </span>
                </span>
              </label>
            </div>

            {paymentMethod === "INSTAPAY" && (
              <div className="mt-3 space-y-2 rounded-lg bg-brand-cream p-4 text-sm text-stone-700">
                <p>
                  Transfer <strong>{formatEGP(total)}</strong> to our InstaPay number:
                </p>
                <div className="flex items-center gap-2">
                  <code className="rounded bg-white px-3 py-1.5 font-semibold text-brand">{instapayNumber}</code>
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(instapayNumber);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium hover:border-brand hover:text-brand"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-xs text-stone-500">
                  After placing your order, send the transfer screenshot with your order number to our{" "}
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-brand underline"
                  >
                    WhatsApp
                  </a>
                  .
                </p>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Placing order..." : `Place Order — ${formatEGP(total)}`}
          </button>
        </form>

        <div className="card-surface p-6">
          <h2 className="font-semibold text-stone-800">Order Summary</h2>
          <div className="mt-4 space-y-2 divide-y divide-stone-100">
            {items.map((item) => (
              <div key={item.key} className="flex justify-between py-2 text-sm">
                <span className="text-stone-600">{item.name} x{item.quantity}</span>
                <span className="font-medium">{formatEGP(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-stone-100 pt-4 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>{formatEGP(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Discount</span>
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
        </div>
      </div>
    </div>
  );
}
