"use client";

import { saveOffer } from "@/app/admin/(dashboard)/offers/actions";

interface OfferFormProps {
  offer?: {
    id: string;
    title: string;
    description: string;
    badgeText: string | null;
    active: boolean;
  };
}

export function OfferForm({ offer }: OfferFormProps) {
  const action = saveOffer.bind(null, offer?.id || null);

  return (
    <form action={action} className="card-surface max-w-xl space-y-4 p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Title</label>
        <input name="title" required defaultValue={offer?.title} className="input-field" placeholder="e.g. Valentine Sale — up to 50% off" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Description</label>
        <textarea name="description" required rows={2} defaultValue={offer?.description} className="input-field" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Badge text (optional)</label>
        <input name="badgeText" defaultValue={offer?.badgeText ?? ""} className="input-field" placeholder="e.g. -50%" />
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
        <input type="checkbox" name="active" defaultChecked={offer?.active ?? true} />
        Active (shown on homepage)
      </label>

      <button type="submit" className="btn-primary">Save Offer</button>
    </form>
  );
}
