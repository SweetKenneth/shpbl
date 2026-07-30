import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { track } from "@/lib/analytics";
import { CertificateCard, type CertificateData } from "@/components/CertificateCard";
import { Reveal } from "@/components/Reveal";
import { dryRunCertificate, listRegister, mintCertificate } from "@/lib/certificates.functions";
import { CERT_SPECIMEN_URL, LIBRARY, OG_IMAGE, SITE_URL } from "@/lib/library";

const TITLE = "Mint a Certificate of Ownership — Free | SHPBL";
const DESC =
  "Register your copy of the Strategic Master Library. A numbered, SHA-256 sealed Certificate of Ownership, free in seconds. Provenance, not DRM.";

export const Route = createFileRoute("/certificate/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: `${SITE_URL}/certificate` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/certificate` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Certificate", item: `${SITE_URL}/certificate` },
          ],
        }),
      },
    ],
  }),
  component: CertificatePage,
});

function CertificatePage() {
  const [owner, setOwner] = useState("");
  const [cert, setCert] = useState<CertificateData | null>(null);
  const [staged, setStaged] = useState<
    (CertificateData & { alreadyRegistered?: boolean }) | null
  >(null);
  const [stagingOpen, setStagingOpen] = useState(false);
  const [stagedCopyNo, setStagedCopyNo] = useState("");
  const [stagedDate, setStagedDate] = useState("");
  const mintFn = useServerFn(mintCertificate);
  const dryRunFn = useServerFn(dryRunCertificate);
  const registerFn = useServerFn(listRegister);

  const register = useQuery({
    queryKey: ["register"],
    queryFn: () => registerFn({ data: undefined }),
  });

  const mint = useMutation({
    mutationFn: (name: string) => mintFn({ data: { owner: name } }),
    onSuccess: (data) => {
      setCert(data as CertificateData);
      setStaged(null);
      track("cert_minted", { copyNo: (data as CertificateData).copy_no });
      register.refetch();
    },
  });

  const dryRun = useMutation({
    mutationFn: () =>
      dryRunFn({
        data: {
          owner,
          copyNo: stagedCopyNo.trim() ? Number(stagedCopyNo) : undefined,
          issueDate: stagedDate.trim() ? stagedDate.trim() : undefined,
        },
      }),
    onSuccess: (data) => {
      setStaged(data as CertificateData & { alreadyRegistered?: boolean });
      setCert(null);
      track("cert_dry_run", { copyNo: (data as CertificateData).copy_no });
    },
  });


  return (
    <>
      <section className="no-print mx-auto max-w-5xl px-5 pt-12 sm:px-6 sm:pt-16">
        <p className="eyebrow ink-rise">Provenance · Free · No account</p>
        <h1
          className="display-title ink-rise mt-4 text-[clamp(2.5rem,8vw,5rem)]"
          style={{ animationDelay: "80ms" }}
        >
          Certificate of Ownership
        </h1>
        <div className="spectrum-rule ink-rise mt-5 h-2 rounded-full shadow-[0_0_24px_-6px_var(--vol-2)]" style={{ animationDelay: "160ms" }} />
        <p className="mt-6 max-w-2xl text-[19px] leading-relaxed text-ink-dim">
          Every copy of the library can be registered to a name and a number. The
          certificate seal is <code className="font-mono text-[15px]">sha256(library seal | owner | copy | date)</code>{" "}
          — the same derivation <code className="font-mono text-[15px]">certify.py</code> uses inside the zip, so
          anyone holding the download can re-derive yours and confirm it. It is a receipt of
          provenance. It unlocks nothing, and nothing here is copy-protected.
        </p>

        <form
          className="mt-8 flex max-w-xl flex-wrap gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (owner.trim().length >= 2) {
              track("cert_mint_started");
              mint.mutate(owner);
            }
          }}
        >
          <input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            maxLength={60}
            required
            minLength={2}
            aria-label="Name to register this copy to"
            placeholder="Name to register this copy to"
            className="min-w-[240px] flex-1 rounded-sm border-2 border-foreground bg-background px-4 py-3 font-mono text-sm outline-none transition-shadow duration-300 focus:bg-paper-2 focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--vol-2)_28%,transparent)]"
          />
          <button
            type="submit"
            disabled={mint.isPending}
            className="ink-button inline-flex items-center rounded-sm border-2 border-foreground bg-foreground px-5 py-3.5 font-mono text-[11px] sm:px-6 sm:py-3 sm:text-xs tracking-[0.18em] text-background uppercase disabled:opacity-60"
          >
            {mint.isPending ? (
              <>
                Sealing<span className="caret-blink ml-1">…</span>
              </>
            ) : (
              "Mint certificate"
            )}
          </button>
        </form>
        <p className="mt-3 font-mono text-[12px] text-ink-faint">
          One certificate per name, per edition. Names appear in the public register below —
          use a pen name if you'd rather not.
        </p>
        {mint.isError && (
          <p className="mt-3 font-mono text-[12px] text-vol-4">
            {(mint.error as Error).message}
          </p>
        )}

        <details
          open={stagingOpen}
          onToggle={(e) => setStagingOpen((e.currentTarget as HTMLDetailsElement).open)}
          className="mt-6 max-w-xl border-t border-border pt-4"
        >
          <summary className="cursor-pointer font-mono text-[12px] tracking-[0.14em] text-ink-faint uppercase">
            Dry run · staging mint
          </summary>
          <p className="mt-3 font-mono text-[12px] leading-relaxed text-ink-faint">
            Derives the exact certificate a real mint would produce — same seal derivation,
            same copy number — and writes nothing to the ledger. Leave the fields blank to
            preview the next copy in sequence.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <input
              value={stagedCopyNo}
              onChange={(e) => setStagedCopyNo(e.target.value.replace(/\D/g, "").slice(0, 3))}
              inputMode="numeric"
              aria-label="Copy number to stage"
              placeholder="Copy no. (e.g. 002)"
              className="w-[170px] rounded-sm border-2 border-border bg-background px-3 py-2.5 font-mono text-[12px] outline-none focus:border-foreground"
            />
            <input
              value={stagedDate}
              onChange={(e) => setStagedDate(e.target.value)}
              aria-label="Issue date to stage"
              placeholder="YYYY-MM-DD"
              className="w-[170px] rounded-sm border-2 border-border bg-background px-3 py-2.5 font-mono text-[12px] outline-none focus:border-foreground"
            />
            <button
              type="button"
              disabled={dryRun.isPending || owner.trim().length < 2}
              onClick={() => dryRun.mutate()}
              className="ghost-button inline-flex items-center rounded-sm border-2 border-foreground px-5 py-3 font-mono text-[11px] tracking-[0.18em] uppercase disabled:opacity-40"
            >
              {dryRun.isPending ? "Deriving…" : "Dry run"}
            </button>
          </div>
          {owner.trim().length < 2 && (
            <p className="mt-2 font-mono text-[11px] text-ink-faint">
              Enter a name above first.
            </p>
          )}
          {dryRun.isError && (
            <p className="mt-3 font-mono text-[12px] text-vol-4">
              {(dryRun.error as Error).message}
            </p>
          )}
        </details>
      </section>

      {staged && (
        <section className="ink-rise mx-auto max-w-5xl px-5 pt-10 sm:px-6 sm:pt-12">
          <div className="no-print mx-auto mb-5 max-w-[680px] border-l-4 border-vol-4 bg-paper-2 px-4 py-3 font-mono text-[12px] leading-relaxed text-ink-dim">
            <b className="tracking-[0.14em] uppercase">Staging specimen</b> · nothing was
            written to the register. This is the exact artifact a real mint of copy{" "}
            {String(staged.copy_no).padStart(3, "0")} would produce.
            {staged.alreadyRegistered && " This name already holds a registered copy."}
          </div>
          <CertificateCard cert={staged} staging />
          <div className="no-print mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setStaged(null)}
              className="ghost-button inline-flex items-center rounded-sm border-2 border-foreground px-5 py-3.5 font-mono text-[11px] sm:px-6 sm:py-3 sm:text-xs tracking-[0.18em] uppercase"
            >
              Discard specimen
            </button>
          </div>
        </section>
      )}


      {cert && (
        <section className="ink-rise mx-auto max-w-5xl px-5 pt-10 sm:px-6 sm:pt-12">
          <CertificateCard cert={cert} />
          <div className="no-print mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => window.print()}
              className="ink-button inline-flex items-center rounded-sm border-2 border-foreground bg-foreground px-5 py-3.5 font-mono text-[11px] sm:px-6 sm:py-3 sm:text-xs tracking-[0.18em] text-background uppercase"
            >
              Print / save as PDF
            </button>
            <Link
              to="/certificate/$seal"
              params={{ seal: cert.cert_seal }}
              className="ghost-button inline-flex items-center rounded-sm border-2 border-foreground px-5 py-3.5 font-mono text-[11px] sm:px-6 sm:py-3 sm:text-xs tracking-[0.18em] uppercase no-underline"
            >
              Permanent link
            </Link>
          </div>
        </section>
      )}

      <Reveal as="section" className="no-print mx-auto max-w-5xl px-5 pt-16 sm:px-6 sm:pt-20">
        <h2 className="display-title border-b-2 border-foreground pb-2 text-[clamp(1.75rem,7vw,2rem)]">
          The register
        </h2>
        <p className="mt-4 max-w-2xl text-ink-dim">
          The public ledger of issued copies, sealed against library{" "}
          <span className="seal-glow font-mono text-[12px]">{LIBRARY.librarySeal.slice(0, 16)}…</span>
        </p>
        {register.isLoading && (
          <p className="mt-4 font-mono text-[12px] text-ink-faint">Reading the ledger…</p>
        )}
        <ul className="mt-4 list-none p-0 font-mono text-[12px]">
          {(register.data ?? []).map((r) => (
            <li
              key={r.cert_seal}
              className="list-row grid grid-cols-[56px_1fr] items-baseline gap-3 border-b border-border py-2 sm:grid-cols-[56px_1fr_auto]"
            >
              <span className="text-ink-dim">
                {String(r.copy_no).padStart(3, "0")}
              </span>
              <span className="min-w-0">
                <Link
                  to="/certificate/$seal"
                  params={{ seal: r.cert_seal }}
                  className="rule-link block truncate"
                >
                  {r.owner}
                </Link>
                {r.note && (
                  <span className="mt-0.5 block text-[11px] leading-snug text-ink-faint">
                    {r.note}
                  </span>
                )}
              </span>
              <span className="text-ink-faint">{r.issue_date}</span>
            </li>
          ))}

        </ul>
        {register.data?.length === 0 && (
          <p className="mt-4 font-mono text-[12px] text-ink-faint">
            No copies registered yet. Copy 001 is available.
          </p>
        )}

        <p className="mt-8 text-sm text-ink-dim">
          Prefer to mint offline? The zip ships <code className="font-mono">certify.py</code> —{" "}
          <code className="font-mono">
            python3 certify.py --owner "Ada Lovelace" --copy 7 --date 2026-07-29
          </code>{" "}
          writes the same certificate locally, no network involved.{" "}
          <a href={CERT_SPECIMEN_URL} target="_blank" rel="noopener" className="rule-link">
            View the specimen copy
          </a>
          .
        </p>
      </Reveal>
    </>
  );
}
