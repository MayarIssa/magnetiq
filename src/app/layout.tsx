import type { Metadata } from "next";
import { Poppins, Great_Vibes } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { SiteChrome } from "@/components/SiteChrome";
import { getSettings } from "@/lib/settings";
import { getCustomerSession } from "@/lib/auth";
import { db } from "@/lib/db";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Magnetiq — Custom Photo Magnets & Event Cards",
  description:
    "Turn your memories into magnets. Custom photo magnets in small & large sizes, plus event cards for save-the-dates, engagements, proposals and weddings. Delivered all over Egypt.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, offers, customerSession] = await Promise.all([
    getSettings(),
    db.offer.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } }),
    getCustomerSession(),
  ]);
  const offerItems = offers.map((o) => [o.badgeText, o.title].filter(Boolean).join("  ·  "));

  return (
    <html lang="en">
      <body className={`${poppins.variable} ${greatVibes.variable} font-sans`}>
        <CartProvider>
          <SiteChrome
            whatsappNumber={settings.whatsappNumber}
            offerItems={offerItems}
            customerName={customerSession?.name ?? null}
          >
            {children}
          </SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
