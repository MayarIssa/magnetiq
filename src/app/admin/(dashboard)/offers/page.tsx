import Link from "next/link";
import { db } from "@/lib/db";
import { deleteOffer } from "./actions";
import { OfferActiveToggle } from "@/components/admin/OfferActiveToggle";

export const dynamic = "force-dynamic";

export default async function AdminOffersPage() {
  const offers = await db.offer.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Offers</h1>
        <Link href="/admin/offers/new" className="btn-primary">New Offer</Link>
      </div>

      <div className="mt-6 space-y-3">
        {offers.map((offer) => (
          <div key={offer.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-semibold text-stone-800">
                {offer.badgeText && <span className="mr-2 rounded-full bg-brand px-2 py-0.5 text-xs text-white">{offer.badgeText}</span>}
                {offer.title}
              </p>
              <p className="text-sm text-stone-500">{offer.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <OfferActiveToggle id={offer.id} active={offer.active} />
              <Link href={`/admin/offers/${offer.id}`} className="text-sm font-semibold text-brand hover:underline">Edit</Link>
              <form action={deleteOffer.bind(null, offer.id)}>
                <button type="submit" className="text-sm text-stone-400 hover:text-red-600">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {offers.length === 0 && <p className="text-stone-400">No offers yet.</p>}
      </div>
    </div>
  );
}
