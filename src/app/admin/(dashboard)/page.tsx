import Link from "next/link";
import { db } from "@/lib/db";
import { formatEGP } from "@/lib/currency";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [ordersToday, pendingCount, monthlyOrders, recentOrders] = await Promise.all([
    db.order.count({ where: { createdAt: { gte: startOfToday } } }),
    db.order.count({ where: { status: "PENDING" } }),
    db.order.findMany({ where: { createdAt: { gte: startOfMonth }, status: { not: "CANCELLED" } } }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Orders Today", value: ordersToday },
    { label: "Pending Orders", value: pendingCount },
    { label: "Revenue This Month", value: formatEGP(monthlyRevenue) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card-surface p-6">
            <p className="text-sm text-stone-500">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-brand">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 card-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-stone-800">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-brand hover:underline">View all →</Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500">
                <th className="py-2 pr-4">Order #</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-stone-100">
                  <td className="py-2 pr-4">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-brand hover:underline">{o.orderNumber}</Link>
                  </td>
                  <td className="py-2 pr-4">{o.customerName}</td>
                  <td className="py-2 pr-4">{o.status}</td>
                  <td className="py-2 pr-4">{formatEGP(o.total)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={4} className="py-4 text-center text-stone-400">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
