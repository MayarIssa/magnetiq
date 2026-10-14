import Link from "next/link";
import { db } from "@/lib/db";
import { OfferBanner } from "@/components/OfferBanner";
import { PackageCard } from "@/components/PackageCard";
import { ProductCard } from "@/components/ProductCard";
import { Parallax, Reveal } from "@/components/ScrollFX";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [offers, packages, magnets, cards] = await Promise.all([
    db.offer.findMany({ where: { active: true } }),
    db.package.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" }, take: 4 }),
    db.product.findMany({
      where: { active: true, type: { in: ["MAGNET_SMALL", "MAGNET_LARGE"] } },
      orderBy: { sortOrder: "asc" },
    }),
    db.product.findMany({ where: { active: true, type: "EVENT_CARD" }, orderBy: { sortOrder: "asc" }, take: 3 }),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-cream">
        {/* floating magnet stickers drifting at their own speeds */}
        <Parallax speed={0.3} rotate={0.03} className="pointer-events-none absolute -left-8 top-16 hidden opacity-70 lg:block">
          <img src="/samples/small-magnet.svg" alt="" className="h-28 w-28 -rotate-12 rounded-2xl shadow-lg" />
        </Parallax>
        <Parallax speed={-0.22} rotate={-0.04} className="pointer-events-none absolute right-[44%] top-8 hidden opacity-60 lg:block">
          <img src="/samples/small-magnet.svg" alt="" className="h-16 w-16 rotate-6 rounded-xl shadow-md" />
        </Parallax>
        <Parallax speed={0.18} rotate={-0.02} className="pointer-events-none absolute -right-6 bottom-6 hidden opacity-70 lg:block">
          <img src="/samples/large-magnet.svg" alt="" className="h-24 w-24 rotate-12 rounded-2xl shadow-lg" />
        </Parallax>

        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:grid-cols-2">
          <div>
            <p className="font-script text-2xl text-brand">Moments That Stick</p>
            <h1 className="mt-3 text-4xl font-bold leading-snug text-stone-800 sm:text-5xl sm:leading-snug">
              Turn your favorite photos into custom magnets
            </h1>
            <p className="mt-4 text-stone-600">
              Upload any picture, pick a small or large magnet, and we print and deliver it anywhere in Egypt.
              Also perfect for save-the-date, engagement and wedding cards.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">Shop Magnets</Link>
              <Link href="/event-cards" className="btn-outline">Shop Event Cards</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Parallax speed={0.1} tilt>
              <div className="relative aspect-square overflow-hidden rounded-2xl shadow-md">
                <img src="/samples/small-magnet.svg" alt="Small magnet" className="absolute inset-0 h-full w-full object-contain" />
              </div>
            </Parallax>
            <Parallax speed={0.16} tilt>
              <div className="relative aspect-square overflow-hidden rounded-2xl shadow-md">
                <img src="/samples/large-magnet.svg" alt="Large magnet" className="absolute inset-0 h-full w-full object-contain" />
              </div>
            </Parallax>
            <Parallax speed={0.07} tilt className="col-span-2">
              <div className="relative aspect-[2/1] overflow-hidden rounded-2xl shadow-md">
                <img src="/samples/hero-banner.svg" alt="Photo magnets collage" className="absolute inset-0 h-full w-full object-contain" />
              </div>
            </Parallax>
          </div>
        </div>
      </section>

      {offers.length > 0 && (
        <section className="mx-auto max-w-6xl space-y-3 px-4 py-8">
          {offers.map((offer, i) => (
            <Reveal key={offer.id} delay={i * 120}>
              <OfferBanner title={offer.title} description={offer.description} badgeText={offer.badgeText} />
            </Reveal>
          ))}
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-8">
        <Reveal>
          <h2 className="text-2xl font-bold text-stone-800">Shop Magnets</h2>
          <p className="mt-1 text-stone-500">Choose small or large, upload your photo, done.</p>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {magnets.map((product, i) => (
            <Reveal key={product.id} delay={i * 90}>
              <ProductCard {...product} />
            </Reveal>
          ))}
        </div>
      </section>

      {packages.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <Reveal>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-stone-800">Deals &amp; Packages</h2>
                <p className="mt-1 text-stone-500">Bundle up and save.</p>
              </div>
              <Link href="/packages" className="text-sm font-semibold text-brand hover:underline">View all →</Link>
            </div>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 90}>
                <PackageCard {...pkg} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {cards.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <Reveal>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-stone-800">Event Cards</h2>
                <p className="mt-1 text-stone-500">Save-the-date, engagement, proposal &amp; wedding cards with a magnet insert.</p>
              </div>
              <Link href="/event-cards" className="text-sm font-semibold text-brand hover:underline">View all →</Link>
            </div>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {cards.map((product, i) => (
              <Reveal key={product.id} delay={i * 90}>
                <ProductCard {...product} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="relative mx-auto max-w-6xl overflow-visible px-4 py-12">
        <Parallax speed={-0.18} rotate={0.05} className="pointer-events-none absolute -right-4 -top-8 hidden opacity-60 lg:block">
          <img src="/samples/small-magnet.svg" alt="" className="h-20 w-20 rotate-6 rounded-xl shadow-md" />
        </Parallax>
        <Reveal>
          <h2 className="text-center text-2xl font-bold text-stone-800">How it works</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            { step: "1", title: "Choose a product", desc: "Pick a magnet size, event card, or a bundle deal." },
            { step: "2", title: "Upload your photo", desc: "Drag & drop your favorite picture, add names/date for cards." },
            { step: "3", title: "We deliver", desc: "Cash on delivery anywhere in Egypt, or confirm your order via WhatsApp." },
          ].map((s, i) => (
            <Reveal key={s.step} delay={i * 140}>
              <div className="card-surface p-6 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white font-bold">
                  {s.step}
                </div>
                <h3 className="mt-3 font-semibold text-stone-800">{s.title}</h3>
                <p className="mt-1 text-sm text-stone-500">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
