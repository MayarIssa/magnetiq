import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatEGP } from "@/lib/currency";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { EventCardText } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await db.order.findUnique({ where: { id: params.id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-stone-800">Order {order.orderNumber}</h1>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div className="card-surface p-6 sm:col-span-1">
          <h2 className="font-semibold text-stone-800">Customer</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div><dt className="text-stone-500">Name</dt><dd>{order.customerName}</dd></div>
            <div><dt className="text-stone-500">Phone</dt><dd>{order.phone}</dd></div>
            <div><dt className="text-stone-500">Address</dt><dd>{order.address}, {order.city}</dd></div>
            {order.notes && <div><dt className="text-stone-500">Notes</dt><dd>{order.notes}</dd></div>}
            <div><dt className="text-stone-500">Payment</dt><dd>{order.paymentMethod}</dd></div>
            <div><dt className="text-stone-500">Placed</dt><dd>{order.createdAt.toLocaleString()}</dd></div>
          </dl>

          <div className="mt-6 space-y-1 border-t border-stone-100 pt-4 text-sm">
            <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>{formatEGP(order.subtotal)}</span></div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                <span>-{formatEGP(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600"><span>Delivery</span><span>{formatEGP(order.deliveryFee)}</span></div>
            <div className="flex justify-between border-t border-stone-100 pt-2 text-base font-bold text-stone-800">
              <span>Total</span><span>{formatEGP(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2 space-y-4">
          {order.items.map((item) => {
            const images: string[] = JSON.parse(item.uploadedImageUrls || "[]");
            const customText: EventCardText | null = item.customText ? JSON.parse(item.customText) : null;
            return (
              <div key={item.id} className="card-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-stone-800">{item.name} x{item.quantity}</h3>
                    {customText?.names && <p className="text-sm text-stone-500">{customText.names} — {customText.eventDate}</p>}
                    {customText?.message && <p className="text-sm text-stone-500">"{customText.message}"</p>}
                  </div>
                  <span className="font-semibold text-brand">{formatEGP(item.unitPrice * item.quantity)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {images.map((url, idx) => (
                    <a key={idx} href={url} target="_blank" rel="noreferrer" className="relative h-28 w-28 overflow-hidden rounded-lg border border-stone-200">
                      <img src={url} alt={`Uploaded photo ${idx + 1}`} className="absolute inset-0 h-full w-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
