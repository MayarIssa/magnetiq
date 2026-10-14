import { db } from "@/lib/db";
import { BackButton } from "@/components/BackButton";
import { PackageCard } from "@/components/PackageCard";

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const packages = await db.package.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <BackButton />
      <h1 className="text-3xl font-bold text-stone-800">Deals &amp; Packages</h1>
      <p className="mt-2 text-stone-500">Bundle up your favorite magnets and cards for a better price.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} {...pkg} />
        ))}
      </div>
    </div>
  );
}
