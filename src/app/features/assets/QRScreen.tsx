import { useState } from "react";
import { Search, QrCode, Printer, Download } from "lucide-react";
import { ASSETS } from "../../data/mock";
import { Btn, Card, Chip } from "../../components/shared";

// ─────────────────────────────────────────────
// QR Management
// ─────────────────────────────────────────────

export function QRScreen({ initialAssetId }: { initialAssetId?: string } = {}) {
  const [search, setSearch]       = useState("");
  const [selectedId, setSelected] = useState(initialAssetId ?? "");

  const filtered = ASSETS.filter(a =>
    !search || a.name.includes(search) || a.id.includes(search)
  );
  const selected = ASSETS.find(a => a.id === selectedId);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#2B2B2B]">إدارة رموز QR</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Asset picker */}
        <Card>
          <h3 className="text-sm font-semibold text-[#2B2B2B] mb-4">اختر الأصل</h3>
          <div className="relative mb-4">
            <Search size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#6B7280]" />
            <input placeholder="ابحث عن الأصل برقمه أو اسمه..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pr-9 pl-3 py-2.5 text-sm rounded-lg border border-[#E5E7EB]
                placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165]" />
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {filtered.map(a => (
              <button key={a.id} onClick={() => setSelected(a.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-right transition-all
                  ${selectedId === a.id ? "border-[#2A3172] bg-[#EEF0F8]" : "border-[#E5E7EB] hover:border-[#9CA3AF] hover:bg-[#FAFAF9]"}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2B2B2B] truncate">{a.name}</p>
                  <p className="text-xs font-mono text-[#3D4589] mt-0.5">{a.id}</p>
                </div>
                <Chip status={a.status} />
              </button>
            ))}
          </div>
        </Card>

        {/* QR display */}
        <div className="space-y-4">
          <Card className="text-center">
            {selected ? (
              <>
                <h3 className="text-sm font-semibold text-[#2B2B2B] mb-0.5">{selected.name}</h3>
                <p className="text-xs font-mono text-[#3D4589] mb-5">{selected.id}</p>
                <div className="w-44 h-44 mx-auto bg-white border-2 border-[#E5E7EB] rounded-xl flex items-center justify-center mb-5 p-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect x="5"  y="5"  width="35" height="35" fill="none" stroke="#2B2B2B" strokeWidth="5"/>
                    <rect x="13" y="13" width="19" height="19" fill="#2B2B2B"/>
                    <rect x="60" y="5"  width="35" height="35" fill="none" stroke="#2B2B2B" strokeWidth="5"/>
                    <rect x="68" y="13" width="19" height="19" fill="#2B2B2B"/>
                    <rect x="5"  y="60" width="35" height="35" fill="none" stroke="#2B2B2B" strokeWidth="5"/>
                    <rect x="13" y="68" width="19" height="19" fill="#2B2B2B"/>
                    {Array.from({ length: 10 }, (_, row) =>
                      Array.from({ length: 10 }, (_, col) => {
                        const x = 60 + col * 4, y = 60 + row * 4;
                        return Math.abs(Math.sin(row * 7 + col * 13)) > 0.4
                          ? <rect key={`${row}${col}`} x={x} y={y} width="3" height="3" fill="#2B2B2B"/>
                          : null;
                      })
                    )}
                    <rect x="47" y="5"  width="4" height="4" fill="#2B2B2B"/>
                    <rect x="47" y="13" width="4" height="4" fill="#2B2B2B"/>
                    <rect x="5"  y="47" width="4" height="4" fill="#2B2B2B"/>
                    <rect x="47" y="47" width="4" height="4" fill="#2B2B2B"/>
                  </svg>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Btn variant="primary"    size="sm" icon={<Printer size={13} />}>طباعة</Btn>
                  <Btn variant="secondary"  size="sm" icon={<Download size={13} />}>تحميل PNG</Btn>
                </div>
              </>
            ) : (
              <div className="py-12">
                <QrCode size={40} className="mx-auto text-[#9CA3AF] mb-3" />
                <p className="text-sm text-[#6B7280]">اختر أصلاً لإنشاء رمز QR</p>
              </div>
            )}
          </Card>

          <Card p={false}>
            <div className="p-4 border-b border-[#E5E7EB]">
              <h3 className="text-sm font-semibold text-[#2B2B2B]">مطبوعة مؤخراً</h3>
            </div>
            <div className="divide-y divide-[#F7F6F3]">
              {ASSETS.slice(0, 3).map(a => (
                <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 bg-[#F7F6F3] rounded-lg flex items-center justify-center flex-shrink-0">
                    <QrCode size={14} className="text-[#6B7280]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#2B2B2B] truncate">{a.name}</p>
                    <p className="text-[10px] font-mono text-[#6B7280]">{a.id}</p>
                  </div>
                  <button className="text-xs text-[#2A3172] hover:underline flex-shrink-0">إعادة طباعة</button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
