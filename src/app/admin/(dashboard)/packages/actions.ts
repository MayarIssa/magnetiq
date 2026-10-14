"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

const packageSchema = z.object({
  name: z.string().trim().min(2),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only."),
  description: z.string().trim().min(1),
  price: z.coerce.number().int().min(0),
  compareAtPrice: z.coerce.number().int().min(0).optional().nullable(),
  badge: z.string().trim().optional().nullable(),
  composition: z.string().trim().min(1),
  sampleImageUrl: z.string().trim().min(1),
  photoSlots: z.coerce.number().int().min(1).max(20),
  active: z.coerce.boolean(),
});

export async function savePackage(id: string | null, formData: FormData) {
  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || undefined,
    badge: formData.get("badge") || undefined,
    composition: formData.get("composition"),
    sampleImageUrl: formData.get("sampleImageUrl"),
    photoSlots: formData.get("photoSlots"),
    active: formData.get("active") === "on",
  };
  const parsed = packageSchema.parse(raw);

  if (id) {
    await db.package.update({ where: { id }, data: parsed });
  } else {
    await db.package.create({ data: parsed });
  }

  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath("/");
  redirect("/admin/packages");
}

export async function togglePackageActive(id: string, active: boolean) {
  await db.package.update({ where: { id }, data: { active } });
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath("/");
}
