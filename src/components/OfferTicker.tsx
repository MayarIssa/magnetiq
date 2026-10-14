"use client";

import { useEffect, useState } from "react";

export function OfferTicker({ items }: { items: string[] }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 250);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (items.length === 0) return null;

  // One half of the marquee track; the track renders it twice and animates
  // -50% so the loop point is invisible. Repeat items so a half is always
  // wider than the viewport.
  const half = Array.from({ length: 4 }).flatMap(() => items);

  return (
    <div
      className={`overflow-hidden bg-brand text-white transition-all duration-500 ${
        visible ? "max-h-10" : "max-h-0"
      }`}
    >
      <div className="flex h-10 items-center overflow-hidden">
        <div className="animate-marquee flex w-max items-center whitespace-nowrap">
          {[...half, ...half].map((text, i) => (
            <span key={i} className="flex items-center text-sm font-medium">
              <span className="px-6">{text}</span>
              <span aria-hidden className="text-white/50">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
