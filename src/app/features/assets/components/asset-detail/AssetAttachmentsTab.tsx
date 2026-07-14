import { Upload, FileText, Inbox } from "lucide-react";
import type { AssetAttachment } from "../../../../types";
import { Btn, EmptyState, toast } from "../../../../components/shared";
import { getUserFirstName } from "../../../../utils/userDisplay";
import { InfoSectionCard } from "./InfoSectionCard";

const SUPPORTED_TYPES = "PDF, DOCX, XLSX, JPG, PNG — الحجم الأقصى 20MB";

export function AssetAttachmentsTab({ attachments }: { attachments: AssetAttachment[] }) {
  const notifyDeferred = () => toast.deferred("رفع المرفقات");

  return (
    <InfoSectionCard
      title="المرفقات"
      subtitle="مستندات وصور الأصل — جاهز للربط مع Backend"
      action={<Btn variant="secondary" size="sm" icon={<Upload size={13} />} onClick={notifyDeferred}>رفع ملف</Btn>}
    >
      <button
        type="button"
        onClick={notifyDeferred}
        className="w-full border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:border-[#2A3172] hover:bg-[#F7F6F3] transition-all cursor-pointer mb-5"
      >
        <Upload size={22} className="mx-auto text-[#9CA3AF] mb-2" />
        <p className="text-sm text-[#6B7280]">اسحب وأفلت الملفات هنا، أو انقر للاختيار</p>
        <p className="text-xs text-[#6B7280] mt-1">{SUPPORTED_TYPES}</p>
      </button>

      {attachments.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="لا توجد مرفقات لهذا الأصل"
          subtitle="ارفع مستندات الشراء، الصور، أو ملفات الصيانة المرتبطة بهذا الأصل"
        />
      ) : (
        <div className="space-y-2">
          {attachments.map(file => (
            <div
              key={file.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAF9]"
            >
              <FileText size={16} className="text-[#2A3172] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#2B2B2B] truncate">{file.name}</p>
                <p className="text-xs text-[#6B7280]">
                  {file.size} · {file.uploadedAt} · {getUserFirstName(file.uploadedByUserId) ?? "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </InfoSectionCard>
  );
}
