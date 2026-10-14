import { formatEGP } from "@/lib/currency";

export function PriceTag({
  price,
  compareAtPrice,
  size = "base",
}: {
  price: number;
  compareAtPrice?: number | null;
  size?: "base" | "lg";
}) {
  const priceClass = size === "lg" ? "text-2xl font-bold" : "text-lg font-semibold";
  return (
    <div className="flex items-baseline gap-2">
      <span className={`${priceClass} text-brand`}>{formatEGP(price)}</span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-sm text-stone-400 line-through">{formatEGP(compareAtPrice)}</span>
      )}
    </div>
  );
}
