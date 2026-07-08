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
    primary:   "bg-[#556B2F] text-[#F7F4EE] hover:bg-[#4A5E28] active:bg-[#3E5022]",
    secondary: "bg-white text-[#3E3124] border border-[#D8D3C8] hover:bg-[#F7F4EE] active:bg-[#EDE8DF]",
    ghost:     "text-[#556B2F] hover:bg-[#EEF1E8] active:bg-[#E0E8D4]",
    danger:    "bg-[#B04A4A] text-white hover:bg-[#9A3E3E]",
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
        <label className="text-sm font-medium text-[#3E3124]">
          {label}{required && <span className="text-[#B04A4A] mr-1">*</span>}
        </label>
      )}
      <input type={type} placeholder={placeholder} value={value}
        onChange={e => onChange?.(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8D3C8] bg-white text-[#3E3124] text-sm
          placeholder:text-[#A09580] focus:outline-none focus:ring-2 focus:ring-[#556B2F]/25 focus:border-[#556B2F] transition-all" />
    </div>
  );
}

export function Sel({ label, options, placeholder, required }: {
  label?: string; options: string[]; placeholder?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#3E3124]">
          {label}{required && <span className="text-[#B04A4A] mr-1">*</span>}
        </label>
      )}
      <select className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8D3C8] bg-white text-[#3E3124] text-sm
        focus:outline-none focus:ring-2 focus:ring-[#556B2F]/25 focus:border-[#556B2F] transition-all appearance-none cursor-pointer">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function Card({ children, className = "", p = true }: { children: ReactNode; className?: string; p?: boolean }) {
  return (
    <div className={`bg-white rounded-xl border border-[#D8D3C8] shadow-sm ${p ? "p-6" : ""} ${className}`}>
      {children}
    </div>
  );
}

