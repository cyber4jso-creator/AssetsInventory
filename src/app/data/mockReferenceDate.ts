// ─────────────────────────────────────────────
// Prototype reference date — keeps dashboard KPIs
// and charts aligned with mock history events.
// Sprint 3: replace with server clock / user timezone.
// ─────────────────────────────────────────────

export const MOCK_TODAY = new Date("2026-07-14T12:00:00");

export function mockYearMonth(d: Date = MOCK_TODAY): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function isSameMonth(isoTimestamp: string, ref: Date = MOCK_TODAY): boolean {
  const d = new Date(isoTimestamp);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}
