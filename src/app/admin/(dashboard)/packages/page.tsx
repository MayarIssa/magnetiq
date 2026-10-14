import Link from "next/link";
import { db } from "@/lib/db";
import { formatEGP } from "@/lib/currency";
import { PackageActiveToggle } from "@/components/admin/PackageActiveToggle";

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  const packages = await db.package.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Packages</h1>
        <Link href="/admin/packages/new" className="btn-primary">New Package</Link>
      </div>

      <div className="mt-6 card-surface overflow-x-auto p-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-stone-500">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Composition</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {packages.map((p) => (
              <tr key={p.id} className="border-b border-stone-100">
                <td className="py-2 pr-4 font-medium">{p.name}</td>
                <td className="py-2 pr-4 text-stone-500">{p.composition}</td>
                <td className="py-2 pr-4">{formatEGP(p.price)}</td>
                <td className="py-2 pr-4"><PackageActiveToggle id={p.id} active={p.active} /></td>
                <td className="py-2 pr-4">
                  <Link href={`/admin/packages/${p.id}`} className="font-semibold text-brand hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
            {packages.length === 0 && (
              <tr><td colSpan={5} className="py-6 text-center text-stone-400">No packages yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
