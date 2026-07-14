export function CategoryChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-[#EEF0F8] text-[#2A3172]">
      {label}
    </span>
  );
}
