import type { ReactNode } from "react";
import { Card } from "../../../../components/shared";

export function InfoSectionCard({ title, subtitle, action, children }: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h3 className="text-sm font-semibold text-[#2B2B2B]">{title}</h3>
          {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

export function InfoFieldGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
      {children}
    </div>
  );
}

export function InfoField({ label, value, mono, children }: {
  label: string;
  value?: string;
  mono?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 pb-4 border-b border-[#E5E7EB] last:border-0 last:pb-0">
      <span className="text-xs text-[#6B7280]">{label}</span>
      {children ?? (
        <span className={`text-sm font-medium text-[#2B2B2B] ${mono ? "font-mono" : ""}`}>
          {value}
        </span>
      )}
    </div>
  );
}

export function PlaceholderInsightCard({ label, description }: {
  label: string;
  description: string;
}) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-[#2B2B2B] mb-3">{label}</h3>
      <p className="text-xs text-[#6B7280] leading-relaxed">{description}</p>
      <p className="text-xs text-[#9CA3AF] mt-3 font-medium">—</p>
    </Card>
  );
}
