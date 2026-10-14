import Link from "next/link";
import { PriceTag } from "./PriceTag";
import { PRODUCT_TYPE_LABELS, ProductType } from "@/lib/types";

interface ProductCardProps {
  slug: string;
  name: string;
  type: string;
  price: number;
  compareAtPrice?: number | null;
  sampleImageUrl: string;
}

export function ProductCard({ slug, name, type, price, compareAtPrice, sampleImageUrl }: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="card-surface group overflow-hidden transition hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-brand-cream">
        <img
          src={sampleImageUrl}
          alt={name}
          className="absolute inset-0 h-full w-full object-contain transition group-hover:scale-105"
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand shadow-sm">
          {PRODUCT_TYPE_LABELS[type as ProductType] ?? type}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-stone-800">{name}</h3>
        <div className="mt-2">
          <PriceTag price={price} compareAtPrice={compareAtPrice} />
        </div>
      </div>
    </Link>
  );
}
