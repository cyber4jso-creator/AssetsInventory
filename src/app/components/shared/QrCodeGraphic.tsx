import { forwardRef } from "react";

function hashAssetId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const QrCodeGraphic = forwardRef<SVGSVGElement, { className?: string; assetId?: string }>(
  function QrCodeGraphic({ className = "", assetId = "default" }, ref) {
    const seed = hashAssetId(assetId);

    const dataCells = Array.from({ length: 10 }, (_, row) =>
      Array.from({ length: 10 }, (_, col) => {
        const x = 60 + col * 4;
        const y = 60 + row * 4;
        const filled = Math.abs(Math.sin((row * 7 + col * 13 + seed) * 0.17)) > 0.42;
        return filled ? <rect key={`d-${row}-${col}`} x={x} y={y} width="3" height="3" fill="#2B2B2B" /> : null;
      }),
    );

    return (
      <svg ref={ref} viewBox="0 0 100 100" className={className} role="img" aria-label={`رمز QR للأصل ${assetId}`}>
        <rect x="5" y="5" width="35" height="35" fill="none" stroke="#2B2B2B" strokeWidth="5" />
        <rect x="13" y="13" width="19" height="19" fill="#2B2B2B" />
        <rect x="60" y="5" width="35" height="35" fill="none" stroke="#2B2B2B" strokeWidth="5" />
        <rect x="68" y="13" width="19" height="19" fill="#2B2B2B" />
        <rect x="5" y="60" width="35" height="35" fill="none" stroke="#2B2B2B" strokeWidth="5" />
        <rect x="13" y="68" width="19" height="19" fill="#2B2B2B" />
        <g>{dataCells}</g>
        <rect x="47" y="5" width="4" height="4" fill="#2B2B2B" />
        <rect x="47" y="13" width="4" height="4" fill="#2B2B2B" />
        <rect x="5" y="47" width="4" height="4" fill="#2B2B2B" />
        <rect x="47" y="47" width="4" height="4" fill="#2B2B2B" />
      </svg>
    );
  },
);
