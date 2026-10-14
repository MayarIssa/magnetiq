import { db } from "@/lib/db";
import { BackButton } from "@/components/BackButton";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function EventCardsPage() {
  const cards = await db.product.findMany({
    where: { active: true, type: "EVENT_CARD" },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <BackButton />
      <h1 className="text-3xl font-bold text-stone-800">Event Cards</h1>
      <p className="mt-2 max-w-2xl text-stone-500">
        Printed cards with an embedded custom-photo magnet insert — perfect for save-the-dates,
        engagement announcements, proposals and wedding invitations. Upload your photo and add
        your names &amp; date.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {cards.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
