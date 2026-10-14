"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { setCustomerSessionCookie, clearCustomerSessionCookie } from "@/lib/auth";

const signupSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email."),
  phone: z.string().trim().min(8, "Please enter a valid phone number."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export async function signup(
  _prevState: { error?: string } | void,
  formData: FormData
): Promise<{ error?: string } | void> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid details." };
  }

  const existing = await db.customer.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { error: "An account with this email already exists. Try logging in instead." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const customer = await db.customer.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash,
    },
  });

  await setCustomerSessionCookie({ customerId: customer.id, name: customer.name });
  redirect("/account");
}

export async function login(
  _prevState: { error?: string } | void,
  formData: FormData
): Promise<{ error?: string } | void> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const customer = await db.customer.findUnique({ where: { email } });
  if (!customer) {
    return { error: "Invalid email or password." };
  }

  const valid = await bcrypt.compare(password, customer.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await setCustomerSessionCookie({ customerId: customer.id, name: customer.name });
  redirect("/account");
}

export async function logoutCustomer() {
  clearCustomerSessionCookie();
  redirect("/");
}
