import Link from "next/link";
import { PriceTag } from "./PriceTag";

interface PackageCardProps {
  slug: string;
  name: string;
  composition: string;
  price: number;
  compareAtPrice?: number | null;
  badge?: string | null;
  sampleImageUrl: string;
}

export function PackageCard({ slug, name, composition, price, compareAtPrice, badge, sampleImageUrl }: PackageCardProps) {
  return (
    <Link href={`/packages/${slug}`} className="card-surface group overflow-hidden transition hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-brand-cream">
        <img src={sampleImageUrl} alt={name} className="absolute inset-0 h-full w-full object-contain transition group-hover:scale-105" />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-stone-800">{name}</h3>
        <p className="mt-1 text-sm text-stone-500">{composition}</p>
        <div className="mt-2">
          <PriceTag price={price} compareAtPrice={compareAtPrice} />
        </div>
      </div>
    </Link>
  );
}
