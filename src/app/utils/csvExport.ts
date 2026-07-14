// ─────────────────────────────────────────────
// Client-side CSV export — no backend, no library.
// Genuinely works today; real report/PDF generation stays deferred.
// ─────────────────────────────────────────────

function escapeCsvCell(value: unknown): string {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function exportToCsv(filename: string, headers: string[], rows: (string | number)[][]): void {
  const lines = [headers, ...rows].map(row => row.map(escapeCsvCell).join(","));
  const csv = "﻿" + lines.join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
