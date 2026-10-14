import { OfferForm } from "@/components/admin/OfferForm";

export default function NewOfferPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">New Offer</h1>
      <div className="mt-6">
        <OfferForm />
      </div>
    </div>
  );
}
