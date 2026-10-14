import { db } from "./db";

export async function generateOrderNumber(): Promise<string> {
  const count = await db.order.count();
  return `MQ-${1000 + count + 1}`;
}

export async function findValidCoupon(code: string) {
  if (!code) return null;
  const coupon = await db.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!coupon || !coupon.active) return null;
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return null;
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) return null;
  return coupon;
}
