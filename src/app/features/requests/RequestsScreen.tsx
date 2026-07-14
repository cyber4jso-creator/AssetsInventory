import { useMemo, useState } from "react";
import { Search, Plus, Eye, Check, X, Inbox } from "lucide-react";
import type { AssetRequest, RequestType } from "../../types";
import { Btn, Card, EmptyState, ConfirmDialog, Modal, PaginationBar, toast } from "../../components/shared";
import { useAuth, hasPermission } from "../../auth";
import { useAssetsData } from "../assets/contexts/AssetsDataContext";
import { getVisibleAssetsForUser } from "../../utils/assetScope";
import { getUserFirstName } from "../../utils/userDisplay";
import { matchesQuery } from "../../utils/search";
import { getTotalPages, paginateArray } from "../../utils/paginate";
import { useRequestsData } from "./contexts/RequestsDataContext";
import { NewRequestModal } from "./NewRequestModal";

const PER_PAGE = 10;

const TABS: { id: "all" | RequestType; label: string }[] = [
  { id: "all",         label: "الكل" },
  { id: "transfer",    label: "طلبات النقل" },
  { id: "maintenance", label: "طلبات الصيانة" },
  { id: "purchase",    label: "طلبات الشراء" },
  { id: "disposal",    label: "طلبات الشطب" },
];

const REQ_STATUS = {
  pending:   { label: "بانتظار الموافقة", bg: "#FDF6ED", text: "#8B6914" },
  approved:  { label: "معتمد",            bg: "#EDF3EF", text: "#3D6B47" },
  rejected:  { label: "مرفوض",            bg: "#FAEDED", text: "#9E3A3A" },
  completed: { label: "مكتمل",            bg: "#EEF0F8", text: "#2A3172" },
};

const PRIORITY_LABELS: Record<string, string> = {
  low: "منخفضة", medium: "متوسطة", high: "عالية", urgent: "عاجلة",
};

const TABLE_HEADERS = [
  { key: "id", label: "رقم الطلب" },
  { key: "type", label: "النوع" },
  { key: "asset", label: "الأصل" },
  { key: "requester", label: "مقدم الطلب" },
  { key: "priority", label: "الأولوية" },
  { key: "date", label: "التاريخ" },
  { key: "status", label: "الحالة" },
  { key: "actions", label: "إجراءات" },
] as const;

export function RequestsScreen() {
  const [tab, setTab] = useState<"all" | RequestType>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [decision, setDecision] = useState<{ id: string; approve: boolean } | null>(null);
  const [viewing, setViewing] = useState<AssetRequest | null>(null);
  const { currentUser } = useAuth();
  const { assets } = useAssetsData();
  const { requests, setRequestStatus } = useRequestsData();

  const canCreate = hasPermission(currentUser, "requests.create");
  const canApprove = hasPermission(currentUser, "requests.approve");

  const visibleAssetIds = useMemo(
    () => new Set(getVisibleAssetsForUser(assets, currentUser).map(a => a.id)),
    [assets, currentUser],
  );

  const scopedRequests = useMemo(
    () => requests.filter(r => visibleAssetIds.has(r.assetId)),
    [requests, visibleAssetIds],
  );

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: scopedRequests.length };
    for (const t of TABS) {
      if (t.id === "all") continue;
      counts[t.id] = scopedRequests.filter(r => r.type === t.id).length;
    }
    return counts;
  }, [scopedRequests]);

  const filteredRequests = useMemo(() => {
    const byTab = tab === "all" ? scopedRequests : scopedRequests.filter(r => r.type === tab);
    return byTab.filter(r => {
      const typeLabel = TABS.find(t => t.id === r.type)?.label ?? r.type;
      return matchesQuery(
        search,
        r.id,
        r.asset,
        r.assetId,
        getUserFirstName(r.requesterUserId),
        typeLabel,
        REQ_STATUS[r.status].label,
        r.from,
        r.to,
        r.reason,
      );
    });
  }, [scopedRequests, tab, search]);

  const totalPages = getTotalPages(filteredRequests.length, PER_PAGE);
  const paginated = paginateArray(filteredRequests, page, PER_PAGE);

  const confirmDecision = () => {
    if (!decision) return;
    setRequestStatus(decision.id, decision.approve ? "approved" : "rejected");
    toast.success(decision.approve ? "تم اعتماد الطلب" : "تم رفض الطلب");
    setDecision(null);
  };

  return (
    <div className="space-y-5 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-[#2B2B2B]">الطلبات</h1>
        {canCreate && (
          <Btn variant="primary" icon={<Plus size={15} />} onClick={() => setShowNewRequest(true)}>طلب جديد</Btn>
        )}
      </div>

      <div className="flex gap-1 bg-[#F7F6F3] p-1 rounded-xl w-fit flex-wrap">
        {TABS.map(t => (
          <button key={t.id} type="button" onClick={() => { setTab(t.id); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer
              ${tab === t.id ? "bg-white text-[#2B2B2B] shadow-sm" : "text-[#6B7280] hover:text-[#2B2B2B]"}`}>
            {t.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
              ${tab === t.id ? "bg-[#EEF0F8] text-[#2A3172]" : "bg-[#E5E7EB] text-[#6B7280]"}`}>{tabCounts[t.id] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="relative max-w-xl">
        <Search size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#6B7280]" aria-hidden />
        <input
          placeholder="بحث في الطلبات..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          aria-label="بحث في الطلبات"
          className="w-full pr-9 pl-3 py-2.5 text-sm rounded-lg border border-[#E5E7EB] bg-white
            placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165]"
        />
      </div>

      <Card p={false} className="w-full">
        {filteredRequests.length === 0 ? (
          <EmptyState icon={Inbox} title="لا توجد طلبات مطابقة" subtitle="جرّب تعديل البحث أو التصنيف" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[760px]">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]">
                    {TABLE_HEADERS.map(h => (
                      <th key={h.key} className="text-right text-xs text-[#6B7280] font-medium px-5 py-3">{h.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((r, i) => {
                    const s = REQ_STATUS[r.status];
                    const typeLabel = TABS.find(t => t.id === r.type)?.label.replace("طلبات ال", "") ?? r.type;
                    return (
                      <tr key={r.id} className={`hover:bg-[#FAFAF9] ${i < paginated.length - 1 ? "border-b border-[#F7F6F3]" : ""}`}>
                        <td className="px-5 py-3.5 font-mono text-xs text-[#3D4589] font-medium">{r.id}</td>
                        <td className="px-5 py-3.5 text-[#6B7280]">{typeLabel}</td>
                        <td className="px-5 py-3.5 text-[#2B2B2B] font-medium">{r.asset}</td>
                        <td className="px-5 py-3.5 text-[#6B7280]">{getUserFirstName(r.requesterUserId) ?? "—"}</td>
                        <td className="px-5 py-3.5 text-[#6B7280]">{PRIORITY_LABELS[r.priority] ?? r.priority}</td>
                        <td className="px-5 py-3.5 text-[#6B7280] font-mono text-xs">{r.date}</td>
                        <td className="px-5 py-3.5">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.text }}>{s.label}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => setViewing(r)} aria-label="عرض الطلب"
                              className="p-1.5 text-[#6B7280] hover:text-[#2A3172] hover:bg-[#EEF0F8] rounded-md transition-colors cursor-pointer">
                              <Eye size={14} />
                            </button>
                            {canApprove && r.status === "pending" && (
                              <>
                                <button type="button" onClick={() => setDecision({ id: r.id, approve: true })} aria-label="اعتماد"
                                  className="p-1.5 text-[#4F7C5A] hover:bg-[#EDF3EF] rounded-md transition-colors cursor-pointer">
                                  <Check size={14} />
                                </button>
                                <button type="button" onClick={() => setDecision({ id: r.id, approve: false })} aria-label="رفض"
                                  className="p-1.5 text-[#C44D4D] hover:bg-[#FAEDED] rounded-md transition-colors cursor-pointer">
                                  <X size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <PaginationBar page={page} totalPages={totalPages} totalItems={filteredRequests.length} perPage={PER_PAGE} onPageChange={setPage} />
          </>
        )}
      </Card>

      <NewRequestModal open={showNewRequest} onOpenChange={setShowNewRequest} />

      <Modal open={viewing !== null} onOpenChange={open => !open && setViewing(null)} title={viewing?.id ?? ""} description="تفاصيل الطلب">
        {viewing && (
          <div className="space-y-3 text-sm">
            {[
              ["النوع", TABS.find(t => t.id === viewing.type)?.label.replace("طلبات ال", "") ?? viewing.type],
              ["الأصل", viewing.asset],
              ["مقدم الطلب", getUserFirstName(viewing.requesterUserId) ?? "—"],
              ["الأولوية", PRIORITY_LABELS[viewing.priority] ?? viewing.priority],
              ["الحالة", REQ_STATUS[viewing.status].label],
              ["التاريخ", viewing.date],
              ["السبب", viewing.reason],
              ...(viewing.from ? [["من", viewing.from]] : []),
              ...(viewing.to ? [["إلى", viewing.to]] : []),
              ...(viewing.notes ? [["ملاحظات", viewing.notes]] : []),
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-start justify-between gap-4 pb-2.5 border-b border-[#F7F6F3] last:border-0">
                <span className="text-[#6B7280] flex-shrink-0">{label}</span>
                <span className="text-[#2B2B2B] font-medium text-left">{value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={decision !== null} onOpenChange={open => !open && setDecision(null)}
        title={decision?.approve ? "اعتماد الطلب" : "رفض الطلب"}
        description={decision?.approve ? "هل تريد اعتماد هذا الطلب؟" : "هل تريد رفض هذا الطلب؟"}
        confirmLabel={decision?.approve ? "اعتماد" : "رفض"}
        variant={decision?.approve ? "primary" : "danger"}
        onConfirm={confirmDecision}
      />
    </div>
  );
}
