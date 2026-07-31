import { toPng } from "html-to-image";

/**
 * Rasterise a certificate node to a PNG the way it renders on paper: white
 * ground, generous margin so the offset outline is not clipped, and 2x pixel
 * density so the seals stay legible when zoomed.
 */
export async function saveCertificateImage(node: HTMLElement, filename: string) {
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    cacheBust: true,
    style: { margin: "0", padding: "18px" },
    filter: (el) =>
      !(el instanceof HTMLElement && el.classList?.contains("no-print")),
  });

  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function certificateFilename(copyNo: number) {
  return `shpbl-certificate-copy-${String(copyNo).padStart(3, "0")}.png`;
}
