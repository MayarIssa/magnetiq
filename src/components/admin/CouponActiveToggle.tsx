"use client";

import { ActiveToggle } from "./ActiveToggle";
import { toggleCouponActive } from "@/app/admin/(dashboard)/coupons/actions";

export function CouponActiveToggle({ id, active }: { id: string; active: boolean }) {
  return <ActiveToggle active={active} onToggle={(next) => toggleCouponActive(id, next)} />;
}
