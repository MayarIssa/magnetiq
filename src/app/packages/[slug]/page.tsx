import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BackButton } from "@/components/BackButton";
import { PackageCustomizer } from "@/components/PackageCustomizer";

export const dynamic = "force-dynamic";

export default async function PackageDetailPage({ params }: { params: { slug: string } }) {
  const pkg = await db.package.findUnique({ where: { slug: params.slug } });
  if (!pkg || !pkg.active) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <BackButton />
      <h1 className="text-3xl font-bold text-stone-800">{pkg.name}</h1>
      <p className="mt-2 max-w-2xl text-stone-600">{pkg.description}</p>

      <div className="mt-8">
        <PackageCustomizer
          id={pkg.id}
          slug={pkg.slug}
          name={pkg.name}
          price={pkg.price}
          compareAtPrice={pkg.compareAtPrice}
          sampleImageUrl={pkg.sampleImageUrl}
          photoSlots={pkg.photoSlots}
          composition={pkg.composition}
        />
      </div>
    </div>
  );
}
