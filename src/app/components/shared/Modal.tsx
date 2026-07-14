import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function Modal({ open, onOpenChange, title, description, children, maxWidth = "max-w-lg" }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
        <Dialog.Content
          dir="rtl"
          className={`fixed z-50 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] ${maxWidth}
            bg-white rounded-2xl border border-[#E5E7EB] shadow-lg max-h-[85vh] flex flex-col
            focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95
            data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95`}
        >
          <div className="flex items-start justify-between gap-4 p-5 border-b border-[#E5E7EB] flex-shrink-0">
            <div className="min-w-0">
              <Dialog.Title className="text-lg font-bold text-[#2B2B2B]">{title}</Dialog.Title>
              {description && (
                <Dialog.Description className="text-sm text-[#6B7280] mt-0.5">{description}</Dialog.Description>
              )}
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="إغلاق"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F7F6F3] hover:text-[#2B2B2B] transition-colors flex-shrink-0 cursor-pointer"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>
          <div className="p-5 overflow-y-auto">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
