// ─────────────────────────────────────────────
// Shared search helpers — case-insensitive, Arabic/English safe
// ─────────────────────────────────────────────

export function normalizeQuery(query: string): string {
  return query.trim().toLocaleLowerCase("ar");
}

export function matchesQuery(query: string, ...fields: (string | null | undefined)[]): boolean {
  const q = normalizeQuery(query);
  if (!q) return true;
  return fields.some(f => (f ?? "").toLocaleLowerCase("ar").includes(q));
}
