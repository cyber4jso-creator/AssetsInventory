import { Printer, Download } from "lucide-react";
import type { Asset } from "../../../../types";
import { Btn, Card, toast } from "../../../../components/shared";
import { PlaceholderInsightCard } from "./InfoSectionCard";

export function AssetDetailSidebar({ asset }: { asset: Asset }) {
  return (
    <div className="space-y-4">
      <Card className="text-center">
        <h3 className="text-sm font-semibold text-[#2B2B2B] mb-4">رمز QR</h3>
        <div className="w-36 h-36 mx-auto bg-[#F7F6F3] rounded-xl border border-[#E5E7EB] flex items-center justify-center mb-4 p-3">
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-80" aria-hidden="true">
            <rect x="10" y="10" width="30" height="30" fill="none" stroke="#2B2B2B" strokeWidth="5" />
            <rect x="17" y="17" width="16" height="16" fill="#2B2B2B" />
            <rect x="60" y="10" width="30" height="30" fill="none" stroke="#2B2B2B" strokeWidth="5" />
            <rect x="67" y="17" width="16" height="16" fill="#2B2B2B" />
            <rect x="10" y="60" width="30" height="30" fill="none" stroke="#2B2B2B" strokeWidth="5" />
            <rect x="17" y="67" width="16" height="16" fill="#2B2B2B" />
            {[60, 70, 80, 90].map(x =>
              [60, 65, 70, 75, 80, 85, 90, 95].map(y =>
                Math.sin(x * y) > 0.2
                  ? <rect key={`${x}${y}`} x={x} y={y} width="4" height="4" fill="#2B2B2B" />
                  : null,
              ),
            )}
          </svg>
        </div>
        <p className="text-xs font-mono text-[#6B7280] mb-4">{asset.id}</p>
        <div className="flex items-center justify-center gap-2">
          <Btn variant="secondary" size="sm" icon={<Printer size={13} />} onClick={() => window.print()}>طباعة</Btn>
          <Btn variant="ghost" size="sm" icon={<Download size={13} />} onClick={() => toast.deferred("تحميل QR بصيغة PNG")}>PNG</Btn>
        </div>
      </Card>

      <PlaceholderInsightCard
        label="صحة الأصل"
        description="مؤشرات الأداء والتوفر — سيتم حسابها من Backend"
      />
      <PlaceholderInsightCard
        label="الامتثال"
        description="حالة الامتثال للسياسات والمعايير"
      />
      <PlaceholderInsightCard
        label="مستوى المخاطر"
        description="تقييم المخاطر التشغيلية والأمنية"
      />
      <PlaceholderInsightCard
        label="آخر مسح"
        description="تاريخ آخر مسح QR أو جرد ميداني"
      />
    </div>
  );
}
