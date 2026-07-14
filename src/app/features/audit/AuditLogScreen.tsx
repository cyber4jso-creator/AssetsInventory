import { useMemo, useState } from "react";
import { Search, Download, Inbox } from "lucide-react";
import { AUDIT_LOGS } from "../../data/mock";
import { Btn, Card, Inp, EmptyState, PaginationBar, toast } from "../../components/shared";
import { useAuth, hasReportsExport } from "../../auth";
import { getUserFirstName } from "../../utils/userDisplay";
import { exportToCsv } from "../../utils/csvExport";
import { matchesQuery } from "../../utils/search";
import { getTotalPages, paginateArray } from "../../utils/paginate";

const PER_PAGE = 15;

const TYPE_STYLES = {
  create: { bg: "#EDF3EF", text: "#3D6B47", label: "إنشاء" },
  update: { bg: "#EEF0F8", text: "#2A3172", label: "تعديل" },
  delete: { bg: "#FAEDED", text: "#9E3A3A", label: "حذف" },
  auth: { bg: "#FDF6ED", text: "#8B6914", label: "مصادقة" },
};

const TYPE_OPTIONS = Object.entries(TYPE_STYLES).map(([value, s]) => ({ value, label: s.label }));

const TABLE_HEADERS = [
  { key: "time", label: "التوقيت" },
  { key: "user", label: "المستخدم" },
  { key: "action", label: "الإجراء" },
  { key: "type", label: "نوع العملية" },
  { key: "entity", label: "الكيان" },
  { key: "details", label: "التفاصيل" },
] as const;

export function AuditLogScreen() {
  const { currentUser } = useAuth();
  const canExport = hasReportsExport(currentUser);

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return AUDIT_LOGS.filter(l => {
      const userName = l.userId ? (getUserFirstName(l.userId) ?? "") : "النظام";
      const matchesSearch = matchesQuery(search, l.action, l.details, l.entity, userName);
      const day = l.time.slice(0, 10);
      const matchesFrom = !dateFrom || day >= dateFrom;
      const matchesTo = !dateTo || day <= dateTo;
      const matchesType = !type || l.type === type;
      return matchesSearch && matchesFrom && matchesTo && matchesType;
    });
  }, [search, dateFrom, dateTo, type]);

  const totalPages = getTotalPages(filtered.length, PER_PAGE);
  const paginated = paginateArray(filtered, page, PER_PAGE);

  const exportLogs = () => {
    exportToCsv(
      "audit-log-export",
      ["التوقيت", "المستخدم", "الإجراء", "نوع العملية", "الكيان", "التفاصيل"],
      filtered.map(l => [l.time, l.userId ? (getUserFirstName(l.userId) ?? "—") : "النظام", l.action, TYPE_STYLES[l.type].label, l.entity, l.details]),
    );
    toast.success("تم تصدير سجل المراجعة بنجاح", `${filtered.length} سجل`);
  };

  return (
    <div className="space-y-5 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#2B2B2B]">سجل المراجعة</h1>
        {canExport && <Btn variant="secondary" icon={<Download size={14} />} onClick={exportLogs}>تصدير CSV</Btn>}
      </div>
      <Card p={false}>
        <div className="p-4 flex items-center gap-3 border-b border-[#E5E7EB] flex-wrap">
          <div className="relative flex-1 min-w-40">
            <Search size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#6B7280]" aria-hidden />
            <input
              placeholder="بحث في السجل..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              aria-label="بحث في سجل المراجعة"
              className="w-full pr-9 pl-3 py-2 text-sm rounded-lg border border-[#E5E7EB]
              placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165]"
            />
          </div>
          <Inp label="من تاريخ" type="date" value={dateFrom} onChange={v => { setDateFrom(v); setPage(1); }} />
          <Inp label="إلى تاريخ" type="date" value={dateTo} onChange={v => { setDateTo(v); setPage(1); }} />
          <select
            value={type}
            onChange={e => { setType(e.target.value); setPage(1); }}
            aria-label="نوع العملية"
            className="text-sm px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#6B7280] focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">كل الأنواع</option>
            {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={Inbox} title="لا توجد سجلات مطابقة" subtitle="جرّب تعديل البحث أو الفلاتر" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[780px]">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]">
                    {TABLE_HEADERS.map(h => (
                      <th key={h.key} className="text-right text-xs text-[#6B7280] font-medium px-5 py-3">{h.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((l, i) => {
                    const ts = TYPE_STYLES[l.type];
                    return (
                      <tr key={l.id} className={`hover:bg-[#FAFAF9] ${i < paginated.length - 1 ? "border-b border-[#F7F6F3]" : ""}`}>
                        <td className="px-5 py-3.5 font-mono text-xs text-[#6B7280]">{l.time}</td>
                        <td className="px-5 py-3.5 text-sm font-medium text-[#2B2B2B]">
                          {l.userId ? (getUserFirstName(l.userId) ?? "—") : "النظام"}
                        </td>
                        <td className="px-5 py-3.5 text-[#6B7280]">{l.action}</td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 rounded-md text-xs font-medium" style={{ background: ts.bg, color: ts.text }}>{ts.label}</span>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-[#3D4589]">{l.entity}</td>
                        <td className="px-5 py-3.5 text-[#6B7280] text-xs max-w-xs">
                          <span className="line-clamp-1">{l.details}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <PaginationBar page={page} totalPages={totalPages} totalItems={filtered.length} perPage={PER_PAGE} onPageChange={setPage} />
          </>
        )}
      </Card>
    </div>
  );
}
