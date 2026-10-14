"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

const couponSchema = z.object({
  code: z.string().trim().min(3).max(30),
  percent: z.coerce.number().int().min(1).max(100),
  usageLimit: z.coerce.number().int().min(1).optional().nullable(),
});

export async function createCoupon(formData: FormData) {
  const raw = {
    code: formData.get("code"),
    percent: formData.get("percent"),
    usageLimit: formData.get("usageLimit") || undefined,
  };
  const parsed = couponSchema.parse(raw);

  await db.coupon.create({
    data: {
      code: parsed.code.toUpperCase(),
      percent: parsed.percent,
      usageLimit: parsed.usageLimit ?? null,
    },
  });

  revalidatePath("/admin/coupons");
}

export async function toggleCouponActive(id: string, active: boolean) {
  await db.coupon.update({ where: { id }, data: { active } });
  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(id: string) {
  await db.coupon.delete({ where: { id } });
  revalidatePath("/admin/coupons");
}
