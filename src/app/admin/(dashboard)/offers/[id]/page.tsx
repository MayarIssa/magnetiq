import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { OfferForm } from "@/components/admin/OfferForm";

export const dynamic = "force-dynamic";

export default async function EditOfferPage({ params }: { params: { id: string } }) {
  const offer = await db.offer.findUnique({ where: { id: params.id } });
  if (!offer) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">Edit Offer</h1>
      <div className="mt-6">
        <OfferForm offer={offer} />
      </div>
    </div>
  );
}
