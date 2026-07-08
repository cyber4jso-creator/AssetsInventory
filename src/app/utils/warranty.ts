export type WarrantyState = "expired" | "expiring" | "valid";

const DAY_MS = 24 * 60 * 60 * 1000;

export function getWarrantyState(expirationISO: string, now: Date = new Date()): WarrantyState {
  const daysLeft = (new Date(expirationISO).getTime() - now.getTime()) / DAY_MS;
  if (daysLeft < 0) return "expired";
  if (daysLeft <= 60) return "expiring";
  return "valid";
}

export const WARRANTY_META: Record<WarrantyState, { label: string; bg: string; text: string; dot: string }> = {
  expired:  { label: "منتهي",         bg: "#FAEDED", text: "#9E3A3A", dot: "#C44D4D" },
  expiring: { label: "قريب الانتهاء", bg: "#FDF6ED", text: "#8B6914", dot: "#D0A165" },
  valid:    { label: "ساري",          bg: "#EDF3EF", text: "#3D6B47", dot: "#4F7C5A" },
};

export function getWarrantyStatus(expirationISO: string, now: Date = new Date()) {
  return WARRANTY_META[getWarrantyState(expirationISO, now)];
}
