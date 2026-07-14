import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPaginationRange } from "../../utils/paginate";

export function PaginationBar({ page, totalPages, totalItems, perPage, onPageChange }: {
  page: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
}) {
  if (totalItems === 0) return null;

  const safePage = Math.min(page, totalPages);
  const rangeStart = (safePage - 1) * perPage + 1;
  const rangeEnd = Math.min(safePage * perPage, totalItems);
  const pageNumbers = getPaginationRange(safePage, totalPages);

  return (
    <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between flex-wrap gap-3">
      <span className="text-xs text-[#6B7280]">
        عرض {rangeStart}–{rangeEnd} من {totalItems}
      </span>
      {totalPages > 1 && (
        <nav className="flex items-center gap-1" aria-label="التصفح بين الصفحات">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
            aria-label="الصفحة السابقة"
            className="w-8 h-8 rounded-lg text-[#6B7280] hover:bg-[#F0EFE9] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <ChevronRight size={14} />
          </button>
          {pageNumbers.map((p, i) =>
            p === "ellipsis" ? (
              <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-[#9CA3AF]">…</span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-label={`الصفحة ${p}`}
                aria-current={p === safePage ? "page" : undefined}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  p === safePage ? "bg-[#2A3172] text-white" : "text-[#6B7280] hover:bg-[#F0EFE9]"
                }`}
              >
                {p}
              </button>
            ),
          )}
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
            disabled={safePage === totalPages}
            aria-label="الصفحة التالية"
            className="w-8 h-8 rounded-lg text-[#6B7280] hover:bg-[#F0EFE9] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <ChevronLeft size={14} />
          </button>
        </nav>
      )}
    </div>
  );
}
