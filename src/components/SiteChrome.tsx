"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { OfferTicker } from "./OfferTicker";

export function SiteChrome({
  whatsappNumber,
  offerItems,
  customerName,
  children,
}: {
  whatsappNumber: string;
  offerItems: string[];
  customerName: string | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <div className="sticky top-0 z-50">
        <OfferTicker items={offerItems} />
        <Header customerName={customerName} />
      </div>
      <main className="min-h-screen">{children}</main>
      <Footer whatsappNumber={whatsappNumber} />
    </>
  );
}
