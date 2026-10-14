import { NextRequest, NextResponse } from "next/server";
import { findValidCoupon } from "@/lib/orders";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (typeof code !== "string" || !code.trim()) {
    return NextResponse.json({ valid: false, message: "Enter a coupon code." });
  }
  const coupon = await findValidCoupon(code);
  if (!coupon) {
    return NextResponse.json({ valid: false, message: "This coupon is invalid or expired." });
  }
  return NextResponse.json({ valid: true, code: coupon.code, percent: coupon.percent });
}
