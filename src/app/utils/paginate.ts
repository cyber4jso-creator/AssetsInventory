// ─────────────────────────────────────────────
// Pagination helpers
// ─────────────────────────────────────────────

export function paginateArray<T>(items: T[], page: number, perPage: number): T[] {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  return items.slice((safePage - 1) * perPage, safePage * perPage);
}

export function getTotalPages(count: number, perPage: number): number {
  return Math.max(1, Math.ceil(count / perPage));
}

export function getPaginationRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("ellipsis");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("ellipsis");
  pages.push(total);

  return pages;
}
