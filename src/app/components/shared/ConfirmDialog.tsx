import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  open, onOpenChange, title, description, confirmLabel = "تأكيد", cancelLabel = "إلغاء",
  variant = "danger", onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
}) {
  const confirmClass = variant === "danger"
    ? "bg-[#C44D4D] text-white hover:bg-[#B03E3E]"
    : "bg-[#D0A165] text-[#2B2B2B] hover:bg-[#B8894E]";

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40 z-40 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
        <AlertDialog.Content
          dir="rtl"
          className="fixed z-50 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md
            bg-white rounded-2xl border border-[#E5E7EB] shadow-lg p-5 focus:outline-none
            data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95
            data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAEDED] flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={18} className="text-[#C44D4D]" />
            </div>
            <div className="min-w-0">
              <AlertDialog.Title className="text-base font-bold text-[#2B2B2B]">{title}</AlertDialog.Title>
              <AlertDialog.Description className="text-sm text-[#6B7280] mt-1">{description}</AlertDialog.Description>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-5">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className="text-sm px-4 py-2 gap-2 rounded-lg font-medium transition-colors cursor-pointer bg-white text-[#2B2B2B] border border-[#E5E7EB] hover:bg-[#F7F6F3]"
              >
                {cancelLabel}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                onClick={onConfirm}
                className={`text-sm px-4 py-2 gap-2 rounded-lg font-medium transition-colors cursor-pointer ${confirmClass}`}
              >
                {confirmLabel}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
