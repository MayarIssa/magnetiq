import { db } from "@/lib/db";
import { createCoupon, deleteCoupon } from "./actions";
import { CouponActiveToggle } from "@/components/admin/CouponActiveToggle";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">Coupons</h1>

      <form action={createCoupon} className="card-surface mt-6 flex flex-wrap items-end gap-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Code</label>
          <input name="code" required className="input-field" placeholder="e.g. VALENTINE20" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Discount %</label>
          <input name="percent" type="number" min={1} max={100} required className="input-field w-24" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Usage limit (optional)</label>
          <input name="usageLimit" type="number" min={1} className="input-field w-32" />
        </div>
        <button type="submit" className="btn-primary">Add Coupon</button>
      </form>

      <div className="mt-6 card-surface overflow-x-auto p-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-stone-500">
              <th className="py-2 pr-4">Code</th>
              <th className="py-2 pr-4">Discount</th>
              <th className="py-2 pr-4">Used</th>
              <th className="py-2 pr-4">Limit</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-stone-100">
                <td className="py-2 pr-4 font-medium">{c.code}</td>
                <td className="py-2 pr-4">{c.percent}%</td>
                <td className="py-2 pr-4">{c.usedCount}</td>
                <td className="py-2 pr-4">{c.usageLimit ?? "—"}</td>
                <td className="py-2 pr-4"><CouponActiveToggle id={c.id} active={c.active} /></td>
                <td className="py-2 pr-4">
                  <form action={deleteCoupon.bind(null, c.id)}>
                    <button type="submit" className="text-stone-400 hover:text-red-600">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan={6} className="py-6 text-center text-stone-400">No coupons yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
