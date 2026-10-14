"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/app/admin/(dashboard)/orders/actions";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, OrderStatus } from "@/lib/types";

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: OrderStatus) {
    setCurrent(next);
    setSaving(true);
    await updateOrderStatus(orderId, next);
    setSaving(false);
  }

  return (
    <select
      value={current}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      className="input-field !w-auto text-sm"
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
      ))}
    </select>
  );
}
