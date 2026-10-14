import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PackageForm } from "@/components/admin/PackageForm";

export const dynamic = "force-dynamic";

export default async function EditPackagePage({ params }: { params: { id: string } }) {
  const pkg = await db.package.findUnique({ where: { id: params.id } });
  if (!pkg) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">Edit Package</h1>
      <div className="mt-6">
        <PackageForm pkg={pkg} />
      </div>
    </div>
  );
}
