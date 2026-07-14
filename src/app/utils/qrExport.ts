// ─────────────────────────────────────────────
// Local QR export — no backend dependency
// ─────────────────────────────────────────────

export async function downloadSvgAsPng(svgEl: SVGSVGElement, filename: string, size = 512): Promise<void> {
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const img = new Image();
  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      canvas.toBlob(pngBlob => {
        if (!pngBlob) {
          reject(new Error("PNG export failed"));
          return;
        }
        const link = document.createElement("a");
        link.href = URL.createObjectURL(pngBlob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
        resolve();
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("SVG load failed"));
    };
    img.src = url;
  });
}
