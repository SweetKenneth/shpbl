import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { CertificateCard } from "@/components/CertificateCard";
import { lookupCertificate } from "@/lib/certificates.functions";
import { OG_IMAGE, SITE_URL } from "@/lib/library";

export const Route = createFileRoute("/certificate/$seal")({
  loader: async ({ params }) => {
    const cert = await lookupCertificate({ data: { seal: params.seal } });
    if (!cert) throw notFound();
    return cert;
  },
  head: ({ params, loaderData }) => {
    const copy = loaderData ? String(loaderData.copy_no).padStart(3, "0") : "—";
    const title = loaderData
      ? `Copy No. ${copy} — ${loaderData.owner} | The Strategic Master Library`
      : "Certificate of Ownership | The Strategic Master Library";
    const description = loaderData
      ? `Certificate of Ownership for copy ${copy} of the Strategic Master Library, Volume Edition, issued ${loaderData.issue_date} and sealed to the edition.`
      : "A sealed Certificate of Ownership for the Strategic Master Library.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `${SITE_URL}/certificate/${params.seal}` },
        { property: "og:image", content: OG_IMAGE },
        { name: "twitter:image", content: OG_IMAGE },
        { name: "robots", content: "noindex, follow" },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/certificate/${params.seal}` }],
    };
  },
  component: CertificatePermalink,
});

function CertificatePermalink() {
  const cert = Route.useLoaderData();

  return (
    <section className="mx-auto max-w-5xl px-6 pt-14">
      <p className="eyebrow no-print">Registered copy · Verified against the ledger</p>
      <div className="mt-6">
        <CertificateCard cert={cert} />
      </div>
      <div className="no-print mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center rounded-sm border-2 border-foreground bg-foreground px-6 py-3 font-mono text-xs tracking-[0.18em] text-background uppercase"
        >
          Print / save as PDF
        </button>
        <Link
          to="/certificate"
          className="inline-flex items-center rounded-sm border-2 border-foreground px-6 py-3 font-mono text-xs tracking-[0.18em] uppercase no-underline hover:bg-foreground hover:text-background"
        >
          The register
        </Link>
      </div>
    </section>
  );
}
