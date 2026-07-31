import { useRef, useState } from "react";

import { CertificateCard, type CertificateData } from "@/components/CertificateCard";
import { track } from "@/lib/analytics";
import { certificateFilename, saveCertificateImage } from "@/lib/save-certificate";

/**
 * The certificate plus its two ways off the screen: paper (print / PDF) and
 * pixels (PNG). Both render the same sheet, so a saved photo and a printed
 * copy are the same artifact.
 */
export function CertificateSheet({
  cert,
  staging = false,
  children,
}: {
  cert: CertificateData;
  staging?: boolean;
  children?: React.ReactNode;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  async function savePhoto() {
    if (!sheetRef.current || saving) return;
    setSaving(true);
    setFailed(false);
    try {
      await saveCertificateImage(sheetRef.current, certificateFilename(cert.copy_no));
      track("cert_saved_image", { copy_no: cert.copy_no, staging });
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div ref={sheetRef}>
        <CertificateCard cert={cert} staging={staging} />
      </div>

      <div className="no-print mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => window.print()}
          className="ink-button inline-flex items-center rounded-sm border-2 border-foreground bg-foreground px-5 py-3.5 font-mono text-[11px] tracking-[0.18em] text-background uppercase sm:px-6 sm:py-3 sm:text-xs"
        >
          Print / save as PDF
        </button>
        <button
          onClick={savePhoto}
          disabled={saving}
          aria-live="polite"
          className="ink-button inline-flex items-center rounded-sm border-2 border-foreground px-5 py-3.5 font-mono text-[11px] tracking-[0.18em] uppercase disabled:opacity-60 sm:px-6 sm:py-3 sm:text-xs"
        >
          {saving ? "Rendering…" : "Save as photo (PNG)"}
        </button>
        {children}
      </div>

      {failed && (
        <p className="no-print mt-3 font-mono text-[11px] tracking-[0.12em] text-vol-4 uppercase">
          The image render failed in this browser — use Print / save as PDF instead.
        </p>
      )}
    </>
  );
}
