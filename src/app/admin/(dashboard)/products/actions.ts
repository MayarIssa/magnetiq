"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { PRODUCT_TYPES } from "@/lib/types";

const productSchema = z.object({
  name: z.string().trim().min(2),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only."),
  type: z.enum(PRODUCT_TYPES),
  description: z.string().trim().min(1),
  price: z.coerce.number().int().min(0),
  compareAtPrice: z.coerce.number().int().min(0).optional().nullable(),
  sampleImageUrl: z.string().trim().min(1),
  active: z.coerce.boolean(),
});

export async function saveProduct(id: string | null, formData: FormData) {
  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    type: formData.get("type"),
    description: formData.get("description"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || undefined,
    sampleImageUrl: formData.get("sampleImageUrl"),
    active: formData.get("active") === "on",
  };
  const parsed = productSchema.parse(raw);

  if (id) {
    await db.product.update({ where: { id }, data: parsed });
  } else {
    await db.product.create({ data: parsed });
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function toggleProductActive(id: string, active: boolean) {
  await db.product.update({ where: { id }, data: { active } });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}
