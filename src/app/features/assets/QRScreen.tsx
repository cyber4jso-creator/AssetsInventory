import { useMemo, useRef, useState } from "react";
import { Search, Printer, Download, Inbox } from "lucide-react";
import { Btn, Card, Chip, EmptyState, QrCodeGraphic, toast } from "../../components/shared";
import { useAuth } from "../../auth";
import { getVisibleAssetsForUser } from "../../utils/assetScope";
import { useAssetsData } from "./contexts/AssetsDataContext";
import { matchesSearch } from "./utils/assetExplorer";
import { downloadSvgAsPng } from "../../utils/qrExport";

// ─────────────────────────────────────────────
// QR Management
// ─────────────────────────────────────────────

export function QRScreen({ initialAssetId }: { initialAssetId?: string } = {}) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelected] = useState(initialAssetId ?? "");
  const qrRef = useRef<SVGSVGElement>(null);
  const { currentUser } = useAuth();
  const { assets } = useAssetsData();

  const visibleAssets = useMemo(
    () => getVisibleAssetsForUser(assets, currentUser),
    [assets, currentUser],
  );

  const filtered = useMemo(
    () => visibleAssets.filter(a => matchesSearch(a, search)),
    [visibleAssets, search],
  );

  const selected = visibleAssets.find(a => a.id === selectedId);

  const handlePrint = () => {
    if (!selected) return;
    window.print();
  };

  const handleDownload = async () => {
    if (!selected || !qrRef.current) return;
    try {
      await downloadSvgAsPng(qrRef.current, `qr-${selected.id}.png`);
      toast.success("تم تنزيل رمز QR");
    } catch {
      toast.error("تعذّر تنزيل الصورة");
    }
  };

  return (
    <div className="space-y-5 w-full">
      <h1 className="text-2xl font-bold text-[#2B2B2B]">إدارة رموز QR</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
        {/* Asset picker — hidden when printing */}
        <Card className="print:hidden">
          <h3 className="text-sm font-semibold text-[#2B2B2B] mb-4">اختر الأصل</h3>
          <div className="relative mb-4">
            <Search size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#6B7280]" aria-hidden />
            <input
              placeholder="ابحث عن الأصل برقمه أو اسمه..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="بحث عن أصل"
              className="w-full pr-9 pl-3 py-2.5 text-sm rounded-lg border border-[#E5E7EB]
                placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165]"
            />
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {filtered.length === 0 ? (
              <EmptyState icon={Inbox} title="لا توجد أصول مطابقة" subtitle="جرّب تعديل كلمة البحث" />
            ) : (
              filtered.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setSelected(a.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-right transition-all cursor-pointer
                    ${selectedId === a.id ? "border-[#2A3172] bg-[#EEF0F8]" : "border-[#E5E7EB] hover:border-[#9CA3AF] hover:bg-[#FAFAF9]"}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2B2B2B] truncate">{a.name}</p>
                    <p className="text-xs font-mono text-[#3D4589] mt-0.5">{a.id}</p>
                  </div>
                  <Chip status={a.status} />
                </button>
              ))
            )}
          </div>
        </Card>

        {/* QR display */}
        <div className="space-y-4">
          {selected ? (
            <Card id="qr-print-card" className="text-center qr-print-card">
              <div className="w-48 h-48 mx-auto bg-white rounded-xl border border-[#E5E7EB] flex items-center justify-center mb-4 p-3">
                <QrCodeGraphic ref={qrRef} assetId={selected.id} className="w-full h-full" />
              </div>
              <p className="text-sm font-semibold text-[#2B2B2B]">{selected.name}</p>
              <p className="text-xs font-mono text-[#3D4589] mt-1">{selected.id}</p>
              <p className="text-xs text-[#6B7280] mt-1">{selected.department} · {selected.location}</p>
              <div className="flex items-center justify-center gap-2 mt-4 print:hidden">
                <Btn variant="secondary" size="sm" icon={<Printer size={13} />} onClick={handlePrint}>طباعة</Btn>
                <Btn variant="secondary" size="sm" icon={<Download size={13} />} onClick={handleDownload}>تنزيل PNG</Btn>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-12 print:hidden">
              <EmptyState icon={Inbox} title="اختر أصلاً" subtitle="اختر أصلاً من القائمة لعرض رمز QR الخاص به" />
            </Card>
          )}

          <Card className="print:hidden">
            <h3 className="text-sm font-semibold text-[#2B2B2B] mb-3">أصول مقترحة</h3>
            <div className="space-y-2">
              {visibleAssets.slice(0, 3).map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setSelected(a.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F7F6F3] transition-colors text-right cursor-pointer"
                >
                  <span className="text-xs font-mono text-[#3D4589]">{a.id}</span>
                  <span className="text-sm text-[#2B2B2B] truncate mr-2">{a.name}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
