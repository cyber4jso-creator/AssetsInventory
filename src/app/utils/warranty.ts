export type WarrantyState = "expired" | "expiring" | "valid";

const DAY_MS = 24 * 60 * 60 * 1000;

export function getWarrantyState(expirationISO: string, now: Date = new Date()): WarrantyState {
  const daysLeft = (new Date(expirationISO).getTime() - now.getTime()) / DAY_MS;
  if (daysLeft < 0) return "expired";
  if (daysLeft <= 60) return "expiring";
  return "valid";
}

export const WARRANTY_META: Record<WarrantyState, { label: string; bg: string; text: string; dot: string }> = {
  expired:  { label: "منتهي",         bg: "#FAEAEA", text: "#7A2E2E", dot: "#B04A4A" },
  expiring: { label: "قريب الانتهاء", bg: "#FDF4DC", text: "#7A5A15", dot: "#C79A32" },
  valid:    { label: "ساري",          bg: "#EBF4E8", text: "#2E5E23", dot: "#5E8B4A" },
};

export function getWarrantyStatus(expirationISO: string, now: Date = new Date()) {
  return WARRANTY_META[getWarrantyState(expirationISO, now)];
}
