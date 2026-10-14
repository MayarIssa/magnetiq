"use client";

import { ActiveToggle } from "./ActiveToggle";
import { togglePackageActive } from "@/app/admin/(dashboard)/packages/actions";

export function PackageActiveToggle({ id, active }: { id: string; active: boolean }) {
  return <ActiveToggle active={active} onToggle={(next) => togglePackageActive(id, next)} />;
}
