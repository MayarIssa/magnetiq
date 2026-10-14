"use client";

import { useState } from "react";
import { saveProduct } from "@/app/admin/(dashboard)/products/actions";
import { ImageUploader } from "@/components/ImageUploader";
import { PRODUCT_TYPES, PRODUCT_TYPE_LABELS } from "@/lib/types";

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    slug: string;
    type: string;
    description: string;
    price: number;
    compareAtPrice: number | null;
    sampleImageUrl: string;
    active: boolean;
  };
}

export function ProductForm({ product }: ProductFormProps) {
  const [sampleImageUrl, setSampleImageUrl] = useState<string | null>(product?.sampleImageUrl || null);
  const action = saveProduct.bind(null, product?.id || null);

  return (
    <form action={action} className="card-surface max-w-xl space-y-4 p-6">
      <input type="hidden" name="sampleImageUrl" value={sampleImageUrl || ""} />

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Sample image</label>
        <ImageUploader value={sampleImageUrl} onChange={setSampleImageUrl} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Name</label>
        <input name="name" required defaultValue={product?.name} className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Slug</label>
        <input name="slug" required defaultValue={product?.slug} className="input-field" placeholder="e.g. small-magnet" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Type</label>
        <select name="type" required defaultValue={product?.type || PRODUCT_TYPES[0]} className="input-field">
          {PRODUCT_TYPES.map((t) => (
            <option key={t} value={t}>{PRODUCT_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Description</label>
        <textarea name="description" required rows={3} defaultValue={product?.description} className="input-field" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Price (EGP)</label>
          <input name="price" type="number" min={0} required defaultValue={product?.price} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Compare-at price (optional)</label>
          <input name="compareAtPrice" type="number" min={0} defaultValue={product?.compareAtPrice ?? ""} className="input-field" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
        <input type="checkbox" name="active" defaultChecked={product?.active ?? true} />
        Active (visible in shop)
      </label>

      <button type="submit" className="btn-primary">Save Product</button>
    </form>
  );
}
