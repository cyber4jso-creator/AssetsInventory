import type { ElementType } from "react";
import { Card } from "./primitives";

export function StatCard({ label, value, subtext, icon: Icon, iconBg, iconColor }: {
  label: string;
  value: string;
  subtext?: string;
  icon: ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-xs text-[#8B7F72] mb-2 leading-tight">{label}</p>
        <p className="text-3xl font-bold text-[#3E3124] leading-none">{value}</p>
        {subtext && <p className="text-xs mt-2 font-medium text-[#8B7F72]">{subtext}</p>}
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
        <Icon size={18} style={{ color: iconColor }} />
      </div>
    </Card>
  );
}
