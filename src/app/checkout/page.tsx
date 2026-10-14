import { getSettings } from "@/lib/settings";
import { getCustomerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CheckoutPageClient } from "@/components/CheckoutPageClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const [settings, session] = await Promise.all([getSettings(), getCustomerSession()]);

  let prefill = null;
  if (session) {
    const customer = await db.customer.findUnique({ where: { id: session.customerId } });
    if (customer) {
      prefill = {
        customerName: customer.name,
        phone: customer.phone,
        address: customer.address ?? "",
        city: customer.city ?? "",
      };
    }
  }

  return (
    <CheckoutPageClient
      deliveryFee={settings.deliveryFee}
      instapayNumber={settings.instapayNumber}
      whatsappNumber={settings.whatsappNumber}
      prefill={prefill}
    />
  );
}
