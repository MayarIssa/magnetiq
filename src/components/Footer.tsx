import Link from "next/link";

export function Footer({ whatsappNumber }: { whatsappNumber: string }) {
  const whatsapp = whatsappNumber;

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="font-script text-2xl text-brand">Magnetiq</div>
          <p className="mt-2 text-sm text-stone-600">Moments That Stick.</p>
          <p className="mt-1 text-sm text-stone-600">Turning your memories into magnets — custom photo magnets and event cards, delivered all over Egypt.</p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-stone-800">Shop</h4>
          <ul className="space-y-2 text-sm text-stone-600">
            <li><Link href="/products" className="hover:text-brand">All Products</Link></li>
            <li><Link href="/event-cards" className="hover:text-brand">Event Cards</Link></li>
            <li><Link href="/packages" className="hover:text-brand">Deals &amp; Packages</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-stone-800">Get in touch</h4>
          <ul className="space-y-2 text-sm text-stone-600">
            {whatsapp && (
              <li>
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-brand">
                  WhatsApp us
                </a>
              </li>
            )}
            <li>
              <a href="https://instagram.com/magnetiq.eg" target="_blank" rel="noreferrer" className="hover:text-brand">
                @magnetiq.eg on Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-100 py-4 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} Magnetiq. All rights reserved.
      </div>
    </footer>
  );
}
