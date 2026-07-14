import { useMemo, useState } from "react";
import { Cpu, Info, Send } from "lucide-react";
import type { NavigateFn } from "../../types";
import { Btn, Card, Chip, Inp, Sel, toast } from "../../components/shared";
import { useAuth } from "../../auth";
import { getVisibleAssetsForUser } from "../../utils/assetScope";
import { useAssetsData } from "./contexts/AssetsDataContext";
import { useRequestsData } from "../requests/contexts/RequestsDataContext";
import { ORG_DEPARTMENTS } from "../../data/orgConstants";

const REASON_OPTIONS = ["إعادة توزيع الموارد", "نقل موظف", "احتياج القسم", "إعادة هيكلة تنظيمية", "أخرى"];

// ─────────────────────────────────────────────
// Transfer
// ─────────────────────────────────────────────

export function TransferScreen({ onNavigate, assetId }: { onNavigate: NavigateFn; assetId?: string | null }) {
  const { currentUser } = useAuth();
  const { assets } = useAssetsData();
  const { addRequest } = useRequestsData();

  const visibleAssets = useMemo(
    () => getVisibleAssetsForUser(assets, currentUser),
    [assets, currentUser],
  );
  const asset = visibleAssets.find(a => a.id === assetId) ?? visibleAssets[0];

  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [assignee, setAssignee] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!asset) {
    return (
      <div className="space-y-5 w-full">
        <h1 className="text-2xl font-bold text-[#2B2B2B]">نقل أصل</h1>
        <Card><p className="text-sm text-[#6B7280]">لا توجد أصول متاحة للنقل ضمن نطاق صلاحياتك.</p></Card>
      </div>
    );
  }

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (!department) nextErrors.department = "اختر القسم الجديد";
    if (!location.trim()) nextErrors.location = "أدخل الموقع الجديد";
    if (!assignee.trim()) nextErrors.assignee = "أدخل اسم المسؤول الجديد";
    if (!date) nextErrors.date = "أدخل تاريخ النقل";
    if (!reason) nextErrors.reason = "اختر سبب النقل";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("تعذّر إرسال الطلب", "يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }

    addRequest({
      type: "transfer",
      assetId: asset.id,
      asset: asset.name,
      reason,
      priority: "medium",
      notes: notes.trim() || undefined,
      requesterUserId: currentUser!.id,
      from: asset.department,
      to: department,
    });

    toast.success("تم إرسال طلب النقل بنجاح", "بانتظار موافقة مدير القسم المستلم");
    onNavigate("requests");
  };

  return (
    <div className="space-y-5 w-full">
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

      <Card className="max-w-3xl">
        <h3 className="text-sm font-semibold text-[#2B2B2B] mb-5">وجهة النقل</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Sel label="القسم الجديد" required options={ORG_DEPARTMENTS.map(d => d.name)} placeholder="اختر القسم الجديد" value={department} onChange={setDepartment} />
            {errors.department && <p className="text-xs text-[#C44D4D] mt-1">{errors.department}</p>}
          </div>
          <div>
            <Inp label="الموقع الجديد" placeholder="مثال: مبنى ب، الطابق 1" required value={location} onChange={setLocation} />
            {errors.location && <p className="text-xs text-[#C44D4D] mt-1">{errors.location}</p>}
          </div>
          <div>
            <Inp label="المسؤول الجديد" placeholder="اسم الموظف المستلم" required value={assignee} onChange={setAssignee} />
            {errors.assignee && <p className="text-xs text-[#C44D4D] mt-1">{errors.assignee}</p>}
          </div>
          <div>
            <Inp label="تاريخ النقل" type="date" required value={date} onChange={setDate} />
            {errors.date && <p className="text-xs text-[#C44D4D] mt-1">{errors.date}</p>}
          </div>
          <div className="md:col-span-2">
            <Sel label="سبب النقل" required options={REASON_OPTIONS} placeholder="اختر السبب" value={reason} onChange={setReason} />
            {errors.reason && <p className="text-xs text-[#C44D4D] mt-1">{errors.reason}</p>}
          </div>
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#2B2B2B]">ملاحظات</label>
            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="أي تعليمات أو ملاحظات خاصة بعملية النقل..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-sm
                placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165] resize-none" />
          </div>
        </div>
      </Card>

      <div className="flex items-start gap-3 p-4 bg-[#EEF0F8] border border-[#B8CDD8] rounded-xl max-w-3xl">
        <Info size={16} className="text-[#3D4589] mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-[#2A3172]">يتطلب الموافقة</p>
          <p className="text-xs text-[#3D4589] mt-0.5">
            سيتم إرسال طلب النقل إلى مدير القسم المستلم للموافقة قبل تنفيذه رسمياً.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Btn variant="primary" icon={<Send size={14} />} onClick={handleSubmit}>إرسال طلب النقل</Btn>
        <Btn variant="secondary" onClick={() => onNavigate("assets")}>إلغاء</Btn>
      </div>
    </div>
  );
}
