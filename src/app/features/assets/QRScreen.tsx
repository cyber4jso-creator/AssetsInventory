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
      <h1 className="text-2xl font-bold text-[#3E3124]">إدارة رموز QR</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Asset picker */}
        <Card>
          <h3 className="text-sm font-semibold text-[#3E3124] mb-4">اختر الأصل</h3>
          <div className="relative mb-4">
            <Search size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#A09580]" />
            <input placeholder="ابحث عن الأصل برقمه أو اسمه..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pr-9 pl-3 py-2.5 text-sm rounded-lg border border-[#D8D3C8]
                placeholder:text-[#A09580] focus:outline-none focus:ring-2 focus:ring-[#556B2F]/25 focus:border-[#556B2F]" />
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {filtered.map(a => (
              <button key={a.id} onClick={() => setSelected(a.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-right transition-all
                  ${selectedId === a.id ? "border-[#556B2F] bg-[#EEF1E8]" : "border-[#E8E3D8] hover:border-[#C4B9A8] hover:bg-[#FAFAF8]"}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#3E3124] truncate">{a.name}</p>
                  <p className="text-xs font-mono text-[#6B7D45] mt-0.5">{a.id}</p>
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
                <h3 className="text-sm font-semibold text-[#3E3124] mb-0.5">{selected.name}</h3>
                <p className="text-xs font-mono text-[#6B7D45] mb-5">{selected.id}</p>
                <div className="w-44 h-44 mx-auto bg-white border-2 border-[#D8D3C8] rounded-xl flex items-center justify-center mb-5 p-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect x="5"  y="5"  width="35" height="35" fill="none" stroke="#3E3124" strokeWidth="5"/>
                    <rect x="13" y="13" width="19" height="19" fill="#3E3124"/>
                    <rect x="60" y="5"  width="35" height="35" fill="none" stroke="#3E3124" strokeWidth="5"/>
                    <rect x="68" y="13" width="19" height="19" fill="#3E3124"/>
                    <rect x="5"  y="60" width="35" height="35" fill="none" stroke="#3E3124" strokeWidth="5"/>
                    <rect x="13" y="68" width="19" height="19" fill="#3E3124"/>
                    {Array.from({ length: 10 }, (_, row) =>
                      Array.from({ length: 10 }, (_, col) => {
                        const x = 60 + col * 4, y = 60 + row * 4;
                        return Math.abs(Math.sin(row * 7 + col * 13)) > 0.4
                          ? <rect key={`${row}${col}`} x={x} y={y} width="3" height="3" fill="#3E3124"/>
                          : null;
                      })
                    )}
                    <rect x="47" y="5"  width="4" height="4" fill="#3E3124"/>
                    <rect x="47" y="13" width="4" height="4" fill="#3E3124"/>
                    <rect x="5"  y="47" width="4" height="4" fill="#3E3124"/>
                    <rect x="47" y="47" width="4" height="4" fill="#3E3124"/>
                  </svg>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Btn variant="primary"    size="sm" icon={<Printer size={13} />}>طباعة</Btn>
                  <Btn variant="secondary"  size="sm" icon={<Download size={13} />}>تحميل PNG</Btn>
                </div>
              </>
            ) : (
              <div className="py-12">
                <QrCode size={40} className="mx-auto text-[#C4B9A8] mb-3" />
                <p className="text-sm text-[#8B7F72]">اختر أصلاً لإنشاء رمز QR</p>
              </div>
            )}
          </Card>

          <Card p={false}>
            <div className="p-4 border-b border-[#F0EDE7]">
              <h3 className="text-sm font-semibold text-[#3E3124]">مطبوعة مؤخراً</h3>
            </div>
            <div className="divide-y divide-[#F7F5F0]">
              {ASSETS.slice(0, 3).map(a => (
                <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 bg-[#F7F5F0] rounded-lg flex items-center justify-center flex-shrink-0">
                    <QrCode size={14} className="text-[#8B7F72]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#3E3124] truncate">{a.name}</p>
                    <p className="text-[10px] font-mono text-[#A09580]">{a.id}</p>
                  </div>
                  <button className="text-xs text-[#556B2F] hover:underline flex-shrink-0">إعادة طباعة</button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
