"use client";

import { ActiveToggle } from "./ActiveToggle";
import { toggleOfferActive } from "@/app/admin/(dashboard)/offers/actions";

export function OfferActiveToggle({ id, active }: { id: string; active: boolean }) {
  return <ActiveToggle active={active} onToggle={(next) => toggleOfferActive(id, next)} />;
}
