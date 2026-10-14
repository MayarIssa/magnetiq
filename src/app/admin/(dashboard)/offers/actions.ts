"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

const offerSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().min(1),
  badgeText: z.string().trim().optional().nullable(),
  active: z.coerce.boolean(),
});

export async function saveOffer(id: string | null, formData: FormData) {
  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    badgeText: formData.get("badgeText") || undefined,
    active: formData.get("active") === "on",
  };
  const parsed = offerSchema.parse(raw);

  if (id) {
    await db.offer.update({ where: { id }, data: parsed });
  } else {
    await db.offer.create({ data: parsed });
  }

  revalidatePath("/admin/offers");
  revalidatePath("/");
  redirect("/admin/offers");
}

export async function deleteOffer(id: string) {
  await db.offer.delete({ where: { id } });
  revalidatePath("/admin/offers");
  revalidatePath("/");
}

export async function toggleOfferActive(id: string, active: boolean) {
  await db.offer.update({ where: { id }, data: { active } });
  revalidatePath("/admin/offers");
  revalidatePath("/");
}
