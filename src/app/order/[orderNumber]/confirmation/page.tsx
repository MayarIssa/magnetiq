import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import { formatEGP } from "@/lib/currency";
import { PAYMENT_METHOD_LABELS, PaymentMethod } from "@/lib/types";
import { ConfettiBurst } from "@/components/ConfettiBurst";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }: { params: { orderNumber: string } }) {
  const order = await db.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: { items: true },
  });
  if (!order) notFound();

  const settings = await getSettings();
  const whatsappLink = buildWhatsAppOrderLink(
    {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      city: order.city,
      subtotal: order.subtotal,
      discount: order.discount,
      deliveryFee: order.deliveryFee,
      total: order.total,
      paymentMethod: order.paymentMethod,
      items: order.items.map((i) => ({ name: i.name, size: i.size, quantity: i.quantity, unitPrice: i.unitPrice })),
    },
    settings.whatsappNumber
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <ConfettiBurst />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
      <h1 className="mt-4 text-4xl font-bold text-stone-800">Your order has been placed! 🎉</h1>
      <p className="mt-3 text-stone-600">
        Thank you, {order.customerName} — order <strong>{order.orderNumber}</strong> is confirmed
        and we&apos;ll start working on it right away.
      </p>

      <div className="card-surface mt-8 p-6 text-left">
        <h2 className="font-semibold text-stone-800">Order Summary</h2>
        <div className="mt-4 space-y-2 divide-y divide-stone-100">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span className="text-stone-600">{item.name} x{item.quantity}</span>
              <span className="font-medium">{formatEGP(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 border-t border-stone-100 pt-4 text-sm">
          <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>{formatEGP(order.subtotal)}</span></div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-700"><span>Discount</span><span>-{formatEGP(order.discount)}</span></div>
          )}
          <div className="flex justify-between text-stone-600"><span>Delivery</span><span>{formatEGP(order.deliveryFee)}</span></div>
          <div className="flex justify-between border-t border-stone-100 pt-2 text-base font-bold text-stone-800">
            <span>Total</span><span>{formatEGP(order.total)}</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-stone-500">
          Payment: {PAYMENT_METHOD_LABELS[order.paymentMethod as PaymentMethod] ?? order.paymentMethod} — {order.address}, {order.city}
        </p>
        {order.paymentMethod === "INSTAPAY" && (
          <div className="mt-3 rounded-lg bg-brand-cream p-4 text-left text-sm text-stone-700">
            <p>
              Please transfer <strong>{formatEGP(order.total)}</strong> via InstaPay to{" "}
              <strong className="text-brand">{settings.instapayNumber}</strong>, then send the receipt
              screenshot with your order number on WhatsApp so we can confirm your payment.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn-primary">
          Confirm order via WhatsApp
        </a>
        <Link href="/" className="btn-outline">
          Shop for More
        </Link>
      </div>
    </div>
  );
}
