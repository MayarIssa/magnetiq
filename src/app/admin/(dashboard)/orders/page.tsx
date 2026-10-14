import Link from "next/link";
import { db } from "@/lib/db";
import { formatEGP } from "@/lib/currency";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/types";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = searchParams.status;
  const orders = await db.order.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">Orders</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`rounded-full border px-3 py-1.5 text-sm font-medium ${!status ? "border-brand bg-brand text-white" : "border-stone-300 text-stone-600"}`}
        >
          All
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${status === s ? "border-brand bg-brand text-white" : "border-stone-300 text-stone-600"}`}
          >
            {ORDER_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="mt-6 card-surface overflow-x-auto p-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-stone-500">
              <th className="py-2 pr-4">Order #</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-stone-100">
                <td className="py-2 pr-4 font-medium">{o.orderNumber}</td>
                <td className="py-2 pr-4 text-stone-500">{o.createdAt.toLocaleDateString()}</td>
                <td className="py-2 pr-4">{o.customerName}</td>
                <td className="py-2 pr-4">{o.phone}</td>
                <td className="py-2 pr-4">{formatEGP(o.total)}</td>
                <td className="py-2 pr-4"><OrderStatusSelect orderId={o.id} status={o.status} /></td>
                <td className="py-2 pr-4">
                  <Link href={`/admin/orders/${o.id}`} className="font-semibold text-brand hover:underline">View</Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={7} className="py-6 text-center text-stone-400">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
