"use client";

import { ActiveToggle } from "./ActiveToggle";
import { toggleProductActive } from "@/app/admin/(dashboard)/products/actions";

export function ProductActiveToggle({ id, active }: { id: string; active: boolean }) {
  return <ActiveToggle active={active} onToggle={(next) => toggleProductActive(id, next)} />;
}
