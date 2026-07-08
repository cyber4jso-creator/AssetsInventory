import type { ReactNode } from "react";
import type { AssetStatus, BusinessCriticality } from "../../types";
import { CRITICALITY, STATUS } from "../../data/mock";

export function Chip({ status }: { status: AssetStatus }) {
  const c = STATUS[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ background: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

export function CriticalityChip({ criticality }: { criticality: BusinessCriticality }) {
  const c = CRITICALITY[criticality];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ background: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

export function Btn({ children, variant = "primary", size = "md", onClick, icon, disabled, className = "" }: {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const v = {
    primary:   "bg-[#D0A165] text-[#2B2B2B] hover:bg-[#B8894E] active:bg-[#A07840]",
    secondary: "bg-white text-[#2B2B2B] border border-[#E5E7EB] hover:bg-[#F7F6F3] active:bg-[#F0EFE9]",
    ghost:     "text-[#2A3172] hover:bg-[#EEF0F8] active:bg-[#E5E8F5]",
    danger:    "bg-[#C44D4D] text-white hover:bg-[#B03E3E]",
  }[variant];
  const s = { sm: "text-xs px-3 py-1.5 gap-1.5 rounded-lg", md: "text-sm px-4 py-2 gap-2 rounded-lg", lg: "text-base px-5 py-2.5 gap-2.5 rounded-xl" }[size];
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${v} ${s} ${className}`}>
      {icon}<span>{children}</span>
    </button>
  );
}

export function Inp({ label, placeholder, value, onChange, type = "text", required }: {
  label?: string; placeholder?: string; value?: string;
  onChange?: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#2B2B2B]">
          {label}{required && <span className="text-[#C44D4D] mr-1">*</span>}
        </label>
      )}
      <input type={type} placeholder={placeholder} value={value}
        onChange={e => onChange?.(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#2B2B2B] text-sm
          placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165] transition-all" />
    </div>
  );
}

export function Sel({ label, options, placeholder, required }: {
  label?: string; options: string[]; placeholder?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#2B2B2B]">
          {label}{required && <span className="text-[#C44D4D] mr-1">*</span>}
        </label>
      )}
      <select className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#2B2B2B] text-sm
        focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165] transition-all appearance-none cursor-pointer">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function Card({ children, className = "", p = true }: { children: ReactNode; className?: string; p?: boolean }) {
  return (
    <div className={`bg-white rounded-xl border border-[#E5E7EB] shadow-sm ${p ? "p-6" : ""} ${className}`}>
      {children}
    </div>
  );
}
