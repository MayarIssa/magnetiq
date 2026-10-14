"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/products?type=MAGNET_SMALL", label: "Small Magnets" },
  { href: "/products?type=MAGNET_LARGE", label: "Large Magnets" },
  { href: "/event-cards", label: "Event Cards" },
  { href: "/packages", label: "Deals & Packages" },
];

export function Header({ customerName }: { customerName: string | null }) {
  const { itemCount, isHydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  const accountHref = customerName ? "/account" : "/login";
  const accountLabel = customerName ? `Hi, ${customerName.split(" ")[0]}` : "Login";

  return (
    <header className="border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-700 transition hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={accountHref}
            className="flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2 text-sm font-medium hover:border-brand hover:text-brand"
          >
            <span aria-hidden>👤</span>
            <span className="hidden sm:inline">{accountLabel}</span>
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2 text-sm font-medium hover:border-brand hover:text-brand"
          >
            <span aria-hidden>🛒</span>
            <span className="hidden sm:inline">Cart</span>
            {isHydrated && itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="rounded-full border border-stone-200 p-2 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-stone-200 bg-white px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-brand/10 hover:text-brand"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={accountHref}
            className="rounded-lg px-3 py-2 text-sm font-medium text-brand hover:bg-brand/10"
            onClick={() => setMenuOpen(false)}
          >
            {customerName ? `My Account (${customerName.split(" ")[0]})` : "Login / Sign up"}
          </Link>
        </nav>
      )}
    </header>
  );
}
