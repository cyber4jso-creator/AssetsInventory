import { useEffect, useMemo, useState } from "react";
import type { RequestPriority, RequestType } from "../../types";
import { Modal, Btn, Sel, toast } from "../../components/shared";
import { useAuth } from "../../auth";
import { useAssetsData } from "../assets/contexts/AssetsDataContext";
import { getVisibleAssetsForUser } from "../../utils/assetScope";
import { useRequestsData } from "./contexts/RequestsDataContext";

const TYPE_OPTIONS: { value: RequestType; label: string }[] = [
  { value: "transfer",    label: "نقل" },
  { value: "maintenance", label: "صيانة" },
  { value: "purchase",    label: "شراء" },
  { value: "disposal",    label: "شطب" },
];

const PRIORITY_OPTIONS: { value: RequestPriority; label: string }[] = [
  { value: "low",    label: "منخفضة" },
  { value: "medium", label: "متوسطة" },
  { value: "high",   label: "عالية" },
  { value: "urgent", label: "عاجلة" },
];

export function NewRequestModal({ open, onOpenChange, presetAssetId, presetType }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presetAssetId?: string;
  presetType?: RequestType;
}) {
  const { currentUser } = useAuth();
  const { assets } = useAssetsData();
  const { addRequest } = useRequestsData();

  const visibleAssets = useMemo(
    () => getVisibleAssetsForUser(assets, currentUser),
    [assets, currentUser],
  );

  const [type, setType] = useState<RequestType | "">(presetType ?? "");
  const [assetId, setAssetId] = useState(presetAssetId ?? "");
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState<RequestPriority | "">("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setType(presetType ?? "");
      setAssetId(presetAssetId ?? "");
      setReason("");
      setPriority("");
      setNotes("");
      setErrors({});
    }
  }, [open, presetAssetId, presetType]);

  const assetOptionLabels = visibleAssets.map(a => `${a.id} — ${a.name}`);
  const selectedAssetLabel = assetOptionLabels.find(l => l.startsWith(assetId));

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (!type) nextErrors.type = "اختر نوع الطلب";
    if (!assetId) nextErrors.assetId = "اختر الأصل";
    if (!reason.trim()) nextErrors.reason = "أدخل سبب الطلب";
    if (!priority) nextErrors.priority = "اختر الأولوية";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("لا يمكن إرسال الطلب", "يرجى تعبئة الحقول المطلوبة");
      return;
    }

    const asset = visibleAssets.find(a => a.id === assetId)!;
    addRequest({
      type: type as RequestType,
      assetId: asset.id,
      asset: asset.name,
      reason: reason.trim(),
      priority: priority as RequestPriority,
      notes: notes.trim() || undefined,
      requesterUserId: currentUser!.id,
    });

    toast.success("تم إرسال الطلب بنجاح", "بانتظار موافقة المدير المختص");
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="طلب جديد" description="أدخل تفاصيل الطلب أدناه">
      <div className="space-y-4">
        <div>
          <Sel
            label="نوع الطلب" required placeholder="اختر نوع الطلب"
            options={TYPE_OPTIONS.map(o => o.label)}
            value={TYPE_OPTIONS.find(o => o.value === type)?.label}
            onChange={label => setType(TYPE_OPTIONS.find(o => o.label === label)?.value ?? "")}
          />
          {errors.type && <p className="text-xs text-[#C44D4D] mt-1">{errors.type}</p>}
        </div>

        <div>
          <Sel
            label="الأصل" required placeholder={visibleAssets.length === 0 ? "لا توجد أصول متاحة" : "اختر الأصل"}
            options={assetOptionLabels}
            value={selectedAssetLabel}
            onChange={label => setAssetId(label.split(" — ")[0] ?? "")}
          />
          {errors.assetId && <p className="text-xs text-[#C44D4D] mt-1">{errors.assetId}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#2B2B2B]">
            سبب الطلب<span className="text-[#C44D4D] mr-1">*</span>
          </label>
          <textarea
            rows={2} value={reason} onChange={e => setReason(e.target.value)}
            placeholder="اشرح سبب هذا الطلب..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#2B2B2B] text-sm
              placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165] resize-none transition-all"
          />
          {errors.reason && <p className="text-xs text-[#C44D4D] mt-1">{errors.reason}</p>}
        </div>

        <div>
          <Sel
            label="الأولوية" required placeholder="اختر الأولوية"
            options={PRIORITY_OPTIONS.map(o => o.label)}
            value={PRIORITY_OPTIONS.find(o => o.value === priority)?.label}
            onChange={label => setPriority(PRIORITY_OPTIONS.find(o => o.label === label)?.value ?? "")}
          />
          {errors.priority && <p className="text-xs text-[#C44D4D] mt-1">{errors.priority}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#2B2B2B]">ملاحظات</label>
          <textarea
            rows={2} value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="أي تفاصيل إضافية (اختياري)..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#2B2B2B] text-sm
              placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165] resize-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Btn variant="primary" onClick={handleSubmit}>إرسال الطلب</Btn>
          <Btn variant="secondary" onClick={() => onOpenChange(false)}>إلغاء</Btn>
        </div>
      </div>
    </Modal>
  );
}
