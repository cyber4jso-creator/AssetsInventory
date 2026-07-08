import type { ElementType } from "react";

export function EmptyState({ icon: Icon, title, subtitle }: {
  icon: ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14">
      <div className="w-14 h-14 rounded-full bg-[#F7F6F3] flex items-center justify-center mb-3">
        <Icon size={22} className="text-[#9CA3AF]" />
      </div>
      <p className="text-sm font-medium text-[#2B2B2B]">{title}</p>
      {subtitle && <p className="text-xs text-[#6B7280] mt-1">{subtitle}</p>}
    </div>
  );
}
