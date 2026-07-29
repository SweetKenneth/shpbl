import { createFileRoute, Link } from "@tanstack/react-router";
import { LIBRARY, OG_IMAGE, SITE_URL, ZIP_URL } from "@/lib/library";

const TITLE = "License — Free Edition Grant v1.0 | SHPBL";
const DESC =
  "Free Edition Grant v1.0: read, print, and pass the library on whole at no cost. Loose terms for the tooling, protected prose, no resale.";

export const Route = createFileRoute("/license")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: `${SITE_URL}/license` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/license` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "License", item: `${SITE_URL}/license` },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: "Free Edition Grant v1.0",
          about: LIBRARY.title,
          url: `${SITE_URL}/license`,
          license: `${SITE_URL}/license`,
          isAccessibleForFree: true,
          copyrightHolder: { "@type": "Person", name: LIBRARY.author },
          copyrightYear: 2026,
        }),
      },
    ],
  }),
  component: License,
});

/** Reproduced byte-for-byte from LICENSE.txt inside the download. */
const LICENSE_TXT = `THE STRATEGIC MASTER LIBRARY — VOLUME EDITION
FREE EDITION GRANT (v1.0)

Copyright (c) 2026 Kenneth E. Sweet Jr. · SHPBL.com · Abilene, Texas.
Distributed free of charge at https://shpbl.com

The written content, volume structure, naming systems, and visual design
in this package are the intellectual property of the author. This grant
gives you broad permission to use them; it does not transfer ownership.

1. THE PROSE (content/, dist/*.html, docs/)
   You may:
     - read, print, and archive this package, for yourself, your team,
       or your clients, commercially or not, at no cost;
     - redistribute the package UNMODIFIED and IN FULL — the whole zip,
       or the whole of any single volume file — including this license;
     - quote from it with attribution to Kenneth E. Sweet Jr. and a link
       to https://shpbl.com.
   You may not:
     - sell, resell, license, or paywall the volumes, in whole or in part;
     - redistribute modified volumes, or strip attribution, seals, or
       this license from any copy you pass on;
     - use the volumes as training data for machine-learning models, or
       submit them to any service that does so.

2. THE TOOLING (build.py, certify.py, verify.py, toolkit/, manifest.json)
   The tooling carries looser terms than the prose, deliberately.
   You may use, modify, and redistribute the tooling — including inside
   commercial and closed-source work — provided the copyright line above
   is retained in derived source files. Anything the toolkit produces
   about YOUR projects is yours outright: your manuals, your audits, your
   output, no strings, no revenue share, no attribution required.

3. CERTIFICATES
   A Certificate of Ownership is a sealed receipt of provenance, not a
   license key and not a purchase. Certificates are free, are issued on
   request at https://shpbl.com/certificate, and grant no rights beyond
   those in this document. Nothing in this package is copy-protected.

4. NO WARRANTY
   THIS PACKAGE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   EXPRESS OR IMPLIED. THE AUTHOR IS NOT LIABLE FOR ANY CLAIM, DAMAGE,
   OR OTHER LIABILITY ARISING FROM ITS USE.

This is the license that governs the Free Edition. It supersedes every
earlier draft, including the purchaser placeholder shipped with previous
printings. The edition on disk and the edition on shpbl.com are the
same edition, under these terms.`;

function License() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-12 sm:px-6 sm:pt-14">
      <p className="eyebrow ink-rise">Rights · Free Edition Grant v1.0</p>
      <h1 className="display-title mt-3 text-[clamp(2.5rem,8vw,4.5rem)]">License</h1>
      <p className="mt-4 text-ink-dim">
        This library is given away at no cost. Free is not the same as unrestricted. The
        prose and the tooling carry different terms, on purpose.
      </p>

      <div
        className="paper-card ink-spot mt-10 bg-paper-2 p-6"
        style={{ borderLeftWidth: 8, borderLeftColor: "var(--vol-5)" }}
      >
        <p className="eyebrow m-0" style={{ color: "var(--vol-5)" }}>
          Status · Confirmed
        </p>
        <p className="mt-2 mb-0 text-sm text-ink-dim">
          The <code className="font-mono">LICENSE.txt</code> inside the download is the same
          Free Edition Grant reproduced on this page, verbatim. The purchaser placeholder that
          shipped with earlier printings is superseded. Site and zip agree; there is no
          conflict left to resolve.
        </p>
      </div>

      <h2 className="display-title mt-14 border-b-2 border-foreground pb-2 text-[clamp(1.75rem,7vw,2rem)]">
        In one screen
      </h2>
      <p className="mt-4 text-ink-dim">
        Copyright © 2026 {LIBRARY.author} · {LIBRARY.publisher}. All rights not expressly
        granted are reserved.
      </p>

      <h3 className="display-title mt-8 text-2xl" style={{ color: "var(--vol-5)" }}>
        You may
      </h3>
      <ul className="mt-3 space-y-2 pl-5 text-ink-dim">
        <li>
          Download, read, print, and archive the package — personally, inside a company, or
          for clients, commercially or not.
        </li>
        <li>
          Pass on the <strong>unmodified</strong> zip, or a whole volume file, license
          included, at no charge.
        </li>
        <li>
          Run the toolkit against your own projects. The manuals and audits you produce are
          yours outright — no attribution required, commercial use included.
        </li>
        <li>
          Use, modify, and ship <code className="font-mono">build.py</code>,{" "}
          <code className="font-mono">certify.py</code>, and{" "}
          <code className="font-mono">verify.py</code> inside your own work, closed-source
          included, keeping the copyright line.
        </li>
        <li>
          Quote the volumes with attribution to the author and a link to {LIBRARY.domain}.
        </li>
      </ul>

      <h3 className="display-title mt-8 text-2xl" style={{ color: "var(--vol-1)" }}>
        You may not
      </h3>
      <ul className="mt-3 space-y-2 pl-5 text-ink-dim">
        <li>Sell, resell, license, or paywall the written volumes, in whole or in part.</li>
        <li>
          Redistribute modified volumes, or strip attribution, seals, or the license from a
          copy you pass on.
        </li>
        <li>
          Feed the volumes to model training, or hand them to a service that does. Fork the
          method, not the identity.
        </li>
        <li>Imply the author's endorsement of your derived work.</li>
      </ul>

      <h3 className="display-title mt-8 text-2xl">The tooling split</h3>
      <p className="mt-3 text-ink-dim">
        The compiler and the certificate minter are instruments; take them apart. The volumes
        are the asset; they stay attributed. Ship the crystal, keep the substrate.
      </p>

      <h3 className="display-title mt-8 text-2xl">Provenance, not protection</h3>
      <p className="mt-3 text-ink-dim">
        Every file is sealed by SHA-256 in <code className="font-mono">dist/SEALS.txt</code>,
        capped by the library seal{" "}
        <span className="font-mono text-[12px] break-all">{LIBRARY.librarySeal}</span>.{" "}
        <Link to="/certificate" className="underline">
          A free Certificate of Ownership
        </Link>{" "}
        binds a name and a copy number to that seal. It unlocks nothing. Nothing here is
        copy-protected, and it is not represented as such.
      </p>

      <h2 className="display-title mt-16 border-b-2 border-foreground pb-2 text-[clamp(1.75rem,7vw,2rem)]">
        LICENSE.txt — as shipped, verbatim
      </h2>
      <p className="mt-4 text-sm text-ink-faint">
        Reproduced without edit so you can see exactly what is inside the download.
      </p>
      <pre className="paper-card mt-4 overflow-x-auto bg-paper-2 p-5 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-ink-dim">
        {LICENSE_TXT}
      </pre>

      <div className="paper-card ink-spot mt-14 p-7">
        <h2 className="display-title text-2xl">Terms understood?</h2>
        <p className="mt-2 mb-5 text-ink-dim">Take it. The license travels inside the zip.</p>
        <a
          href={ZIP_URL}
          download
          className="ink-button inline-flex items-center rounded-sm border-2 border-foreground bg-foreground px-5 py-3.5 font-mono text-[11px] sm:px-6 sm:py-3 sm:text-xs tracking-[0.18em] text-background uppercase no-underline"
        >
          Download the library — free
        </a>
      </div>
    </div>
  );
}
