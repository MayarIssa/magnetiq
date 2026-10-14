"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

const settingsSchema = z.object({
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{8,15}$/, "Enter digits only, with country code, no + or spaces (e.g. 201234567890)."),
  instapayNumber: z.string().trim().min(3, "Enter your InstaPay number or address."),
  deliveryFee: z.coerce.number().int().min(0),
});

export async function updateSettings(formData: FormData) {
  const parsed = settingsSchema.parse({
    whatsappNumber: formData.get("whatsappNumber"),
    instapayNumber: formData.get("instapayNumber"),
    deliveryFee: formData.get("deliveryFee"),
  });

  await db.settings.upsert({
    where: { id: "singleton" },
    update: parsed,
    create: { id: "singleton", ...parsed },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/cart");
  revalidatePath("/checkout");
}
