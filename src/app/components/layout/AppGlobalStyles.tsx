export function AppGlobalStyles() {
  return (
    <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D0A165; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #B8894E; }
        select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: left 10px center; padding-left: 28px !important; }
        @media print {
          body { background: #fff !important; }
          * { box-shadow: none !important; }
          .print\\:hidden { display: none !important; }
          aside, header { display: none !important; }
          main { padding: 0 !important; overflow: visible !important; }
          .qr-print-card { border: 1px solid #E5E7EB !important; page-break-inside: avoid; }
          .asset-report-section { page-break-inside: avoid; }
          table { width: 100% !important; }
          @page { margin: 1.5cm; }
        }
      `}</style>
  );
}
