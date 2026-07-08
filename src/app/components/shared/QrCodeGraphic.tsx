export function QrCodeGraphic({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <rect x="5"  y="5"  width="35" height="35" fill="none" stroke="#2B2B2B" strokeWidth="5"/>
      <rect x="13" y="13" width="19" height="19" fill="#2B2B2B"/>
      <rect x="60" y="5"  width="35" height="35" fill="none" stroke="#2B2B2B" strokeWidth="5"/>
      <rect x="68" y="13" width="19" height="19" fill="#2B2B2B"/>
      <rect x="5"  y="60" width="35" height="35" fill="none" stroke="#2B2B2B" strokeWidth="5"/>
      <rect x="13" y="68" width="19" height="19" fill="#2B2B2B"/>
      {Array.from({ length: 10 }, (_, row) =>
        Array.from({ length: 10 }, (_, col) => {
          const x = 60 + col * 4, y = 60 + row * 4;
          return Math.abs(Math.sin(row * 7 + col * 13)) > 0.4
            ? <rect key={`${row}${col}`} x={x} y={y} width="3" height="3" fill="#2B2B2B"/>
            : null;
        })
      )}
      <rect x="47" y="5"  width="4" height="4" fill="#2B2B2B"/>
      <rect x="47" y="13" width="4" height="4" fill="#2B2B2B"/>
      <rect x="5"  y="47" width="4" height="4" fill="#2B2B2B"/>
      <rect x="47" y="47" width="4" height="4" fill="#2B2B2B"/>
    </svg>
  );
}
