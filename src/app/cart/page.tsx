import { getSettings } from "@/lib/settings";
import { CartPageClient } from "@/components/CartPageClient";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const settings = await getSettings();
  return <CartPageClient deliveryFee={settings.deliveryFee} />;
}
