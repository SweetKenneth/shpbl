import { createFileRoute } from "@tanstack/react-router";
import { LIBRARY, ZIP_URL } from "@/lib/library";

export const Route = createFileRoute("/license")({
  head: () => ({
    meta: [
      { title: "License & Rights — The Strategic Master Library" },
      {
        name: "description",
        content:
          "Rights, permissions, and restrictions for the free Volume Edition: what you may read, print, adapt, and redistribute — and what remains the author's.",
      },
      { property: "og:title", content: "License & Rights — Strategic Master Library" },
      {
        property: "og:description",
        content:
          "Read before you redistribute. The prose and the tooling carry different terms by design.",
      },
    ],
  }),
  component: License,
});

const ORIGINAL_LICENSE = `THE STRATEGIC MASTER LIBRARY — VOLUME EDITION
Copyright (c) 2026 Kenneth E. Sweet Jr. (KESJR.com). All rights reserved.

The written content, volume structure, naming systems, and visual design
in this package are the intellectual property of the author.

PURCHASER GRANT — [OWNER: finalize before first sale]
Suggested single-seat terms, pending the owner's review:
  - The purchaser may read, print, and archive this package for
    personal or internal-team use.
  - The purchaser may adapt build.py and the house-style markdown
    format for their own projects.
  - The purchaser may not republish, resell, or redistribute the
    written volumes, in whole or in part.

NOTE TO OWNER: these terms are a placeholder, not legal advice. Align
with CSAL-1.0 or counsel of your choice before distribution. The build
tooling could reasonably carry a more permissive license than the prose;
that split is a deliberate option, not a default.`;

function License() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-14">
      <p className="eyebrow">Rights · Read Before Distributing</p>
      <h1 className="display-title mt-3 text-[clamp(2.5rem,8vw,4.5rem)]">License</h1>
      <p className="mt-4 text-ink-dim">
        This library is given away at no cost. Free is not the same as unrestricted. The
        prose and the tooling carry different terms, on purpose.
      </p>

      {/* Unresolved status — stated plainly, per the house rule. */}
      <div
        className="paper-card mt-10 bg-paper-2 p-6"
        style={{ borderLeftWidth: 8, borderLeftColor: "var(--vol-3)" }}
      >
        <p className="eyebrow m-0" style={{ color: "var(--vol-3)" }}>
          Status · Needs Confirmation
        </p>
        <p className="mt-2 mb-0 text-sm text-ink-dim">
          The license shipped in <code className="font-mono">LICENSE.txt</code> is written for
          a <strong>purchaser</strong>, is marked by the author as a placeholder, and reserves
          all rights. The free-distribution grant below is the author's stated intent for this
          edition and governs this website's download. Where the two conflict, the grant below
          controls for copies obtained here. Demote claims, do not promote them — so this page
          says what is settled and what is not.
        </p>
      </div>

      {/* The free grant */}
      <h2 className="display-title mt-14 border-b-2 border-foreground pb-2 text-3xl">
        Free Edition Grant
      </h2>
      <p className="mt-4 text-ink-dim">
        Copyright © 2026 {LIBRARY.author} · {LIBRARY.publisher}. All rights not expressly
        granted below are reserved.
      </p>

      <h3 className="display-title mt-8 text-2xl" style={{ color: "var(--vol-5)" }}>
        You may
      </h3>
      <ul className="mt-3 space-y-2 pl-5 text-ink-dim">
        <li>Download, read, print, and archive the package for personal or internal-team use.</li>
        <li>
          Share the <strong>unmodified original zip</strong>, or link to this site, at no
          charge — attribution intact, license file included.
        </li>
        <li>
          Run the toolkit prompts against your own projects. The manuals you produce are
          yours, commercial use included.
        </li>
        <li>
          Adapt <code className="font-mono">build.py</code>,{" "}
          <code className="font-mono">certify.py</code>, and the house-style markdown format
          for your own work.
        </li>
        <li>Quote the volumes with attribution to the author and this edition.</li>
      </ul>

      <h3 className="display-title mt-8 text-2xl" style={{ color: "var(--vol-1)" }}>
        You may not
      </h3>
      <ul className="mt-3 space-y-2 pl-5 text-ink-dim">
        <li>Sell, license, or charge for the written volumes, in whole or in part.</li>
        <li>
          Republish the prose under another name, or strip the author's credit, colophon, or
          seals.
        </li>
        <li>
          Redistribute modified volumes as if they were this edition. Fork the method, not the
          identity.
        </li>
        <li>Use the volumes as training corpus for a model offered as a commercial product.</li>
        <li>Imply the author's endorsement of your derived work.</li>
      </ul>

      <h3 className="display-title mt-8 text-2xl">The tooling split</h3>
      <p className="mt-3 text-ink-dim">
        The build tooling intentionally carries looser terms than the prose. The compiler and
        the certificate minter are instruments; take them apart. The volumes are the asset;
        they stay attributed. Ship the crystal, keep the substrate.
      </p>

      <h3 className="display-title mt-8 text-2xl">No warranty</h3>
      <p className="mt-3 text-ink-dim">
        Provided as-is, without warranty of any kind. Nothing here is legal, financial, or
        professional advice. Truth tags describe the author's confidence in a claim, not a
        guarantee to you.
      </p>

      <h3 className="display-title mt-8 text-2xl">Provenance</h3>
      <p className="mt-3 text-ink-dim">
        Every file in the package is sealed by SHA-256 in{" "}
        <code className="font-mono">dist/SEALS.txt</code>, capped by a single library seal.{" "}
        <code className="font-mono">certify.py</code> mints numbered Certificates of
        Ownership sealed to this exact edition. That is personalization and provenance — not
        copy protection, and it is not represented as such.
      </p>

      {/* Original file, verbatim */}
      <h2 className="display-title mt-16 border-b-2 border-foreground pb-2 text-3xl">
        LICENSE.txt — as shipped, verbatim
      </h2>
      <p className="mt-4 text-sm text-ink-faint">
        Reproduced without edit so you can see exactly what is inside the download.
      </p>
      <pre className="paper-card mt-4 overflow-x-auto bg-paper-2 p-5 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-ink-dim">
        {ORIGINAL_LICENSE}
      </pre>

      <div className="paper-card mt-14 p-7">
        <h2 className="display-title text-2xl">Terms understood?</h2>
        <p className="mt-2 mb-5 text-ink-dim">
          Take it. The license travels inside the zip.
        </p>
        <a
          href={ZIP_URL}
          download
          className="inline-flex items-center rounded-sm border-2 border-foreground bg-foreground px-6 py-3 font-mono text-xs tracking-[0.18em] uppercase text-background no-underline"
        >
          Download the library — free
        </a>
      </div>
    </div>
  );
}
