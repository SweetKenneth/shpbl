import { toPng } from "html-to-image";

const FONT_CSS_URL =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap";

let fontEmbedCache: string | null = null;

/**
 * html-to-image cannot read cross-origin stylesheet rules, so the Google font
 * faces silently fall back to system type in the raster. Fetch the stylesheet
 * ourselves and inline every font file as a data URI instead.
 */
async function buildFontEmbedCSS(): Promise<string> {
  if (fontEmbedCache !== null) return fontEmbedCache;
  try {
    const css = await fetch(FONT_CSS_URL).then((r) => r.text());
    const urls = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)]+/g) ?? [])];
    const pairs = await Promise.all(
      urls.map(async (url) => {
        const blob = await fetch(url).then((r) => r.blob());
        const data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        return [url, data] as const;
      }),
    );
    fontEmbedCache = pairs.reduce((out, [url, data]) => out.split(url).join(data), css);
  } catch {
    fontEmbedCache = "";
  }
  return fontEmbedCache;
}

/**
 * Rasterise a certificate node to a PNG the way it renders on paper: white
 * ground, generous margin so the offset outline is not clipped, and 2x pixel
 * density so the seals stay legible when zoomed.
 */
export async function saveCertificateImage(node: HTMLElement, filename: string) {
  const fontEmbedCSS = await buildFontEmbedCSS();
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    cacheBust: true,
    fontEmbedCSS,
    skipFonts: fontEmbedCSS === "",
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
