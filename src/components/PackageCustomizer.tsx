"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageUploader } from "./ImageUploader";
import { QuantityStepper } from "./QuantityStepper";
import { PriceTag } from "./PriceTag";
import { useCart } from "@/context/CartContext";
import { CartItem, EventCardText } from "@/lib/types";
import { formatEGP } from "@/lib/currency";

interface PackageCustomizerProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  sampleImageUrl: string;
  photoSlots: number;
  composition: string;
}

export function PackageCustomizer({
  id,
  slug,
  name,
  price,
  compareAtPrice,
  sampleImageUrl,
  photoSlots,
  composition,
}: PackageCustomizerProps) {
  const { addItem } = useCart();
  const [images, setImages] = useState<(string | null)[]>(Array(photoSlots).fill(null));
  const [quantity, setQuantity] = useState(1);
  const [names, setNames] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const includesCard = composition.toLowerCase().includes("card");

  function setImageAt(index: number, url: string | null) {
    setImages((prev) => prev.map((v, i) => (i === index ? url : v)));
  }

  function handleAddToCart() {
    const uploaded = images.filter((i): i is string => Boolean(i));
    if (uploaded.length < photoSlots) {
      setError(`Please upload all ${photoSlots} photo${photoSlots > 1 ? "s" : ""} for this bundle.`);
      return;
    }
    setError(null);

    const customText: EventCardText | undefined = includesCard ? { names, eventDate } : undefined;

    const item: CartItem = {
      key: `${slug}-${Date.now()}`,
      kind: "package",
      id,
      slug,
      name,
      quantity,
      unitPrice: price,
      compareAtPrice,
      imageUrl: sampleImageUrl,
      uploadedImageUrls: uploaded,
      customText,
    };
    addItem(item);
    setAdded(true);
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div className="rounded-2xl bg-brand-cream p-6">
        <div className="flex flex-wrap justify-center gap-4">
          {Array.from({ length: photoSlots }).map((_, i) => (
            <ImageUploader key={i} label={`Photo ${i + 1}`} value={images[i]} onChange={(url) => setImageAt(i, url)} />
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-stone-500">Upload one photo for each item in this bundle.</p>
      </div>

      <div>
        <PriceTag price={price} compareAtPrice={compareAtPrice} size="lg" />
        <p className="mt-1 text-sm text-stone-500">{composition}</p>

        {includesCard && (
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
