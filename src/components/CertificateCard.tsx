import { LIBRARY } from "@/lib/library";

export type CertificateData = {
  copy_no: number;
  owner: string;
  issue_date: string;
  cert_seal: string;
  library_seal: string;
  note?: string | null;
};


/**
 * The web rendering of the certificate certify.py mints. Same fields, same
 * seal derivation, same layout — so a printed web certificate and a locally
 * minted one are the same artifact.
 */
export function CertificateCard({
  cert,
  staging = false,
}: {
  cert: CertificateData;
  staging?: boolean;
}) {
  const copy = String(cert.copy_no).padStart(3, "0");

  return (
    <div className="relative">
      {staging && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
        >
          <span className="font-display rotate-[-18deg] text-[clamp(2.5rem,12vw,5.5rem)] tracking-[0.2em] text-vol-4/15 uppercase select-none">
            Specimen
          </span>
        </div>
      )}
      <div className="cert-sheet cert-emboss mx-auto w-full max-w-[680px] border-[3px] border-foreground bg-white px-6 py-10 text-center outline outline-[1.5px] outline-offset-[6px] outline-foreground sm:px-12 sm:py-14">
      <p className="eyebrow m-0">{LIBRARY.publisher}</p>
      <h1 className="display-title mt-4 mb-1 text-[clamp(2rem,7vw,3.25rem)] leading-none">
        {LIBRARY.title}
      </h1>
      <p className="font-display m-0 text-[22px] tracking-[3px] text-ink-dim uppercase">
        {LIBRARY.subtitle} · Certificate of Ownership
      </p>
      <div className="spectrum-rule mx-auto mt-5 mb-8 h-[7px] max-w-[300px] rounded-full shadow-[0_0_22px_-6px_var(--vol-4)]" />

      <p className="m-0 text-base">This certifies that</p>
      <div className="font-display ink-rise mx-auto mt-2 inline-block border-b-2 border-foreground px-6 pb-1 text-[clamp(1.75rem,6vw,2.75rem)] tracking-wide">
        {cert.owner}
      </div>
      <p className="mt-4 mb-7 font-mono text-[13px] tracking-[0.18em] text-ink-dim">
        COPY No. {copy} · ISSUED {cert.issue_date}
      </p>

      {cert.note && (
        <p className="mx-auto -mt-4 mb-7 max-w-[520px] font-mono text-[11.5px] leading-relaxed tracking-[0.08em] text-ink-faint">
          REGISTRAR'S NOTE · {cert.note}
        </p>
      )}


      <p className="mx-auto mb-6 max-w-[520px] text-[13.5px] leading-relaxed text-ink-dim">
        is the registered holder of this copy of the Volume Edition, issued free of charge
        under the Free Edition Grant v1.0 (LICENSE.txt). This certificate binds the copy to
        the exact sealed content of the edition. It is a receipt of provenance — not a
        license key, not a purchase, and not copy protection.
      </p>
      <p className="mb-7 font-mono text-[11px] tracking-[0.28em] text-ink-faint uppercase">
        shpbl.com
      </p>

      <div className="border-t-[1.5px] border-foreground pt-4 text-left font-mono text-[11.5px] leading-loose break-all text-ink-dim">
        <div>
          <b className="text-foreground">LIBRARY SEAL</b> sha256:{cert.library_seal}
        </div>
        <div>
          <b className="text-foreground">CERTIFICATE SEAL</b>{" "}
          <span className="seal-glow">sha256:{cert.cert_seal}</span>
        </div>
        <div>
          verify: sha256("{cert.library_seal.slice(0, 12)}…|{cert.owner}|{copy}|
          {cert.issue_date}") · ledger: dist/SEALS.txt
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-between gap-5 font-mono text-[11px] text-ink-dim">
        <div className="flex-1 border-t-[1.5px] border-foreground pt-1.5 text-left">
          {LIBRARY.author.toUpperCase()} — AUTHOR
        </div>
        <div className="flex-1 border-t-[1.5px] border-foreground pt-1.5 text-left">
          EDITION · {LIBRARY.edition}
        </div>
      </div>
    </div>
  );
}
