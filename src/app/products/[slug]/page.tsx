import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BackButton } from "@/components/BackButton";
import { ProductCustomizer } from "@/components/ProductCustomizer";
import { ProductType } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await db.product.findUnique({ where: { slug: params.slug } });
  if (!product || !product.active) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <BackButton />
      <h1 className="text-3xl font-bold text-stone-800">{product.name}</h1>
      <p className="mt-2 max-w-2xl text-stone-600">{product.description}</p>

      <div className="mt-8">
        <ProductCustomizer
          id={product.id}
          slug={product.slug}
          name={product.name}
          type={product.type as ProductType}
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          sampleImageUrl={product.sampleImageUrl}
        />
      </div>
    </div>
  );
}
