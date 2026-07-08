import { Cpu, Info, Send } from "lucide-react";
import type { NavigateFn } from "../../types";
import { ASSETS } from "../../data/mock";
import { Btn, Card, Chip, Inp, Sel } from "../../components/shared";

// ─────────────────────────────────────────────
// Transfer
// ─────────────────────────────────────────────

export function TransferScreen({ onNavigate, assetId }: { onNavigate: NavigateFn; assetId?: string | null }) {
  const asset = ASSETS.find(a => a.id === assetId) ?? ASSETS[0];
  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#2B2B2B]">نقل أصل</h1>

      <Card>
        <h3 className="text-sm font-semibold text-[#2B2B2B] mb-4">الأصل المراد نقله</h3>
        <div className="flex items-center gap-4 p-4 bg-[#F7F6F3] rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-[#EEF0F8] flex items-center justify-center flex-shrink-0">
            <Cpu size={18} className="text-[#2A3172]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#2B2B2B]">{asset.name}</p>
            <p className="text-xs text-[#6B7280] mt-0.5 font-mono">{asset.id}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-[#6B7280]">
              <span>{asset.department}</span>
              <span>·</span>
              <span>{asset.location}</span>
            </div>
          </div>
          <Chip status={asset.status} />
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-[#2B2B2B] mb-5">وجهة النقل</h3>
        <div className="grid grid-cols-2 gap-5">
          <Sel label="القسم الجديد" required options={["تقنية المعلومات","المالية","الإدارة","الإدارة العليا","الموارد البشرية","الخدمات اللوجستية","السجلات والأرشيف"]} placeholder="اختر القسم الجديد" />
          <Inp label="الموقع الجديد"    placeholder="مثال: مبنى ب، الطابق 1" required />
          <Inp label="المسؤول الجديد"   placeholder="اسم الموظف المستلم" required />
          <Inp label="تاريخ النقل"      type="date" required />
          <div className="col-span-2">
            <Sel label="سبب النقل" required options={["إعادة توزيع الموارد","نقل موظف","احتياج القسم","إعادة هيكلة تنظيمية","أخرى"]} placeholder="اختر السبب" />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#2B2B2B]">ملاحظات</label>
            <textarea rows={3} placeholder="أي تعليمات أو ملاحظات خاصة بعملية النقل..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-sm
                placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165] resize-none" />
          </div>
        </div>
      </Card>

      <div className="flex items-start gap-3 p-4 bg-[#EEF0F8] border border-[#B8CDD8] rounded-xl">
        <Info size={16} className="text-[#3D4589] mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-[#2A3172]">يتطلب الموافقة</p>
          <p className="text-xs text-[#3D4589] mt-0.5">
            سيتم إرسال طلب النقل إلى مدير القسم المستلم للموافقة قبل تنفيذه رسمياً.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Btn variant="primary"   icon={<Send size={14} />}>إرسال طلب النقل</Btn>
        <Btn variant="secondary" onClick={() => onNavigate("assets")}>إلغاء</Btn>
      </div>
    </div>
  );
}
