import type { ElementType } from "react";

export function EmptyState({ icon: Icon, title, subtitle }: {
  icon: ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14">
      <div className="w-14 h-14 rounded-full bg-[#F7F5F0] flex items-center justify-center mb-3">
        <Icon size={22} className="text-[#C4B9A8]" />
      </div>
      <p className="text-sm font-medium text-[#3E3124]">{title}</p>
      {subtitle && <p className="text-xs text-[#A09580] mt-1">{subtitle}</p>}
    </div>
  );
}
