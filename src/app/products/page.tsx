import Link from "next/link";
import { db } from "@/lib/db";
import { BackButton } from "@/components/BackButton";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCT_TYPE_LABELS, ProductType } from "@/lib/types";

export const dynamic = "force-dynamic";

const FILTERS: { label: string; type?: ProductType }[] = [
  { label: "All" },
  { label: PRODUCT_TYPE_LABELS.MAGNET_SMALL, type: "MAGNET_SMALL" },
  { label: PRODUCT_TYPE_LABELS.MAGNET_LARGE, type: "MAGNET_LARGE" },
  { label: PRODUCT_TYPE_LABELS.EVENT_CARD, type: "EVENT_CARD" },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const type = searchParams.type;
  const products = await db.product.findMany({
    where: { active: true, ...(type ? { type } : {}) },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <BackButton />
      <h1 className="text-3xl font-bold text-stone-800">All Products</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const href = f.type ? `/products?type=${f.type}` : "/products";
          const active = f.type === type || (!f.type && !type);
          return (
            <Link
              key={f.label}
              href={href}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                active ? "border-brand bg-brand text-white" : "border-stone-300 text-stone-600 hover:border-brand hover:text-brand"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-stone-500">No products found in this category yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
