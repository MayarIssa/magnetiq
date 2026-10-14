"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageUploader } from "./ImageUploader";
import { QuantityStepper } from "./QuantityStepper";
import { PriceTag } from "./PriceTag";
import { useCart } from "@/context/CartContext";
import { CartItem, EventCardText, ProductType } from "@/lib/types";
import { formatEGP } from "@/lib/currency";

interface ProductCustomizerProps {
  id: string;
  slug: string;
  name: string;
  type: ProductType;
  price: number;
  compareAtPrice?: number | null;
  sampleImageUrl: string;
}

export function ProductCustomizer({ id, slug, name, type, price, compareAtPrice, sampleImageUrl }: ProductCustomizerProps) {
  const { addItem } = useCart();
  const [image, setImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [names, setNames] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const isEventCard = type === "EVENT_CARD";

  function handleAddToCart() {
    if (!image) {
      setError("Please upload a photo first.");
      return;
    }
    setError(null);

    const customText: EventCardText | undefined = isEventCard
      ? { names, eventDate, message }
      : undefined;

    const item: CartItem = {
      key: `${slug}-${Date.now()}`,
      kind: "product",
      id,
      slug,
      name,
      quantity,
      unitPrice: price,
      compareAtPrice,
      imageUrl: sampleImageUrl,
      uploadedImageUrls: [image],
      customText,
    };
    addItem(item);
    setAdded(true);
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-brand-cream p-8">
        <ImageUploader value={image} onChange={setImage} shape={isEventCard ? "card" : "magnet"} />
        <p className="text-center text-xs text-stone-500">This is where your uploaded photo will be printed.</p>
      </div>

      <div>
        <PriceTag price={price} compareAtPrice={compareAtPrice} size="lg" />
        <p className="mt-1 text-sm text-stone-500">Price per {isEventCard ? "card" : "magnet"}</p>

        {isEventCard && (
          <div className="mt-6 space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Names</label>
              <input
                className="input-field"
                placeholder="e.g. Kirolos & Mariam"
                value={names}
                onChange={(e) => setNames(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Event date</label>
              <input
                className="input-field"
                placeholder="e.g. 20.06.2026"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Message (optional)</label>
              <textarea
                className="input-field"
                rows={2}
                placeholder="Any custom text for the card"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <span className="text-sm font-medium text-stone-700">Quantity</span>
          <QuantityStepper value={quantity} onChange={setQuantity} />
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button onClick={handleAddToCart} className="btn-primary mt-6 w-full sm:w-auto">
          Add to cart — {formatEGP(price * quantity)}
        </button>

        {added && (
          <p className="mt-3 text-sm text-green-700">
            Added to cart! <Link href="/cart" className="font-semibold underline">View cart →</Link>
          </p>
        )}
      </div>
    </div>
  );
}
