"use client";

import { useState } from "react";

export function ActiveToggle({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: (next: boolean) => Promise<void>;
}) {
  const [current, setCurrent] = useState(active);
  const [saving, setSaving] = useState(false);

  async function handleClick() {
    const next = !current;
    setCurrent(next);
    setSaving(true);
    await onToggle(next);
    setSaving(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={saving}
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        current ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"
      }`}
    >
      {current ? "Active" : "Inactive"}
    </button>
  );
}
