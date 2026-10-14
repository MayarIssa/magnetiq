"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { getCustomerSession } from "@/lib/auth";
import { generateOrderNumber, findValidCoupon } from "@/lib/orders";
import { CartItem, PAYMENT_METHODS, PaymentMethod } from "@/lib/types";

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name."),
  phone: z.string().trim().min(8, "Please enter a valid phone number."),
  address: z.string().trim().min(5, "Please enter your address."),
  city: z.string().trim().min(2, "Please enter your city."),
  notes: z.string().trim().optional(),
});

export interface CheckoutResult {
  success: boolean;
  message?: string;
  orderNumber?: string;
}

export async function createOrder(
  formInput: {
    customerName: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  },
  items: CartItem[],
  couponCode: string | null,
  paymentMethod: PaymentMethod = "COD"
): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(formInput);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Invalid details." };
  }
  if (!items || items.length === 0) {
    return { success: false, message: "Your cart is empty." };
  }
  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    return { success: false, message: "Invalid payment method." };
  }

  const settings = await db.settings.findUnique({ where: { id: "singleton" } });
  const deliveryFee = settings?.deliveryFee ?? 50;

  let subtotal = 0;
  const resolvedItems: {
    productId?: string;
    packageId?: string;
    name: string;
    size?: string;
    quantity: number;
    unitPrice: number;
    uploadedImageUrls: string;
    customText?: string;
  }[] = [];

  for (const item of items) {
    const quantity = Math.max(1, Math.min(99, Math.floor(item.quantity)));
    let unitPrice: number;
    let name: string;

    if (item.kind === "product") {
      const product = await db.product.findUnique({ where: { id: item.id } });
      if (!product || !product.active) {
        return { success: false, message: `"${item.name}" is no longer available.` };
      }
      unitPrice = product.price;
      name = product.name;
    } else {
      const pkg = await db.package.findUnique({ where: { id: item.id } });
      if (!pkg || !pkg.active) {
        return { success: false, message: `"${item.name}" is no longer available.` };
      }
      unitPrice = pkg.price;
      name = pkg.name;
    }

    subtotal += unitPrice * quantity;
    resolvedItems.push({
      productId: item.kind === "product" ? item.id : undefined,
      packageId: item.kind === "package" ? item.id : undefined,
      name,
      size: item.size,
      quantity,
      unitPrice,
      uploadedImageUrls: JSON.stringify(item.uploadedImageUrls),
      customText: item.customText ? JSON.stringify(item.customText) : undefined,
    });
  }

  let discount = 0;
  let appliedCouponCode: string | undefined;
  if (couponCode) {
    const coupon = await findValidCoupon(couponCode);
    if (coupon) {
      discount = Math.round((subtotal * coupon.percent) / 100);
      appliedCouponCode = coupon.code;
    }
  }

  const total = Math.max(0, subtotal - discount) + deliveryFee;
  const orderNumber = await generateOrderNumber();
  const customerSession = await getCustomerSession();

  await db.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber,
        customerName: parsed.data.customerName,
        phone: parsed.data.phone,
        address: parsed.data.address,
        city: parsed.data.city,
        notes: parsed.data.notes || null,
        subtotal,
        discount,
        deliveryFee,
        total,
        paymentMethod,
        couponCode: appliedCouponCode,
        customerId: customerSession?.customerId,
        items: {
          create: resolvedItems,
        },
      },
    });

    if (appliedCouponCode) {
      await tx.coupon.update({
        where: { code: appliedCouponCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    return order;
  });

  // Remember the customer's latest delivery details for next checkout.
  if (customerSession) {
    try {
      await db.customer.update({
        where: { id: customerSession.customerId },
        data: {
          phone: parsed.data.phone,
          address: parsed.data.address,
          city: parsed.data.city,
        },
      });
    } catch {
      // non-critical — the order itself is already saved
    }
  }

  return { success: true, orderNumber };
}
