import { getSettings } from "@/lib/settings";
import { updateSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">Settings</h1>

      <form action={updateSettings} className="card-surface mt-6 max-w-lg space-y-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">WhatsApp business number</label>
          <input
            name="whatsappNumber"
            required
            defaultValue={settings.whatsappNumber}
            className="input-field"
            placeholder="201234567890"
          />
          <p className="mt-1 text-xs text-stone-400">Digits only with country code, no + or spaces.</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">InstaPay number / address</label>
          <input
            name="instapayNumber"
            required
            defaultValue={settings.instapayNumber}
            className="input-field"
            placeholder="e.g. 01001234567 or yourname@instapay"
          />
          <p className="mt-1 text-xs text-stone-400">Shown to customers who choose to pay via InstaPay.</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Delivery fee (EGP)</label>
          <input name="deliveryFee" type="number" min={0} required defaultValue={settings.deliveryFee} className="input-field" />
        </div>
        <button type="submit" className="btn-primary">Save Settings</button>
      </form>
    </div>
  );
}
