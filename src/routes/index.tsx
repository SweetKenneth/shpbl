import { Link, createFileRoute } from "@tanstack/react-router";
import {
  LIBRARY,
  VOLUMES,
  ZIP_URL,
  ZIP_BYTES,
  SHELF_URL,
  TRUTH_LEGEND,
  SITE_URL,
  OG_IMAGE,
} from "@/lib/library";
import { Reveal } from "@/components/Reveal";
import { InstallSection } from "@/components/InstallSection";
import { track } from "@/lib/analytics";


const TITLE = "The Strategic Master Library — Free Download | SHPBL";
const DESC =
  "Six volumes distilled from twenty-nine audited owner's manuals, plus the two-stage toolkit that produced them. Free, sealed, print-ready. No email, no account.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: OG_IMAGE },

    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Book",
          name: LIBRARY.title,
          bookEdition: LIBRARY.subtitle,
          numberOfPages: undefined,
          author: { "@type": "Person", name: LIBRARY.author, url: SITE_URL },
          publisher: { "@type": "Organization", name: "SHPBL", url: SITE_URL },
          inLanguage: "en",
          url: SITE_URL,
          image: OG_IMAGE,
          description: DESC,
          license: `${SITE_URL}/license`,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: SITE_URL,
          },
        }),
      },
    ],
  }),
  component: Home,
});


function DownloadButtons({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <a
        href={ZIP_URL}
        download
        onClick={() => track("download_zip", { surface: compact ? "footer-cta" : "masthead" })}
        className="ink-button group inline-flex items-center justify-center gap-2 rounded-sm border-2 border-foreground bg-foreground px-5 py-3.5 text-center font-mono text-[11px] tracking-[0.16em] uppercase text-background no-underline sm:justify-start sm:gap-3 sm:px-6 sm:text-xs sm:tracking-[0.18em]"
      >
        Download the library
        <span className="opacity-60 transition-opacity duration-300 group-hover:opacity-100">
          {(ZIP_BYTES / 1024).toFixed(0)} KB · ZIP
        </span>
      </a>
      {!compact && (
        <a
          href={SHELF_URL}
          target="_blank"
          rel="noopener"
          onClick={() => track("read_shelf")}
          className="ghost-button inline-flex items-center justify-center rounded-sm border-2 border-foreground px-5 py-3.5 font-mono text-[11px] tracking-[0.16em] uppercase no-underline sm:px-6 sm:text-xs sm:tracking-[0.18em]"
        >
          Read the shelf online
        </a>
      )}
    </div>
  );
}

function Shelf() {
  return (
    <div>
      <div className="flex flex-wrap items-end gap-2 px-1 sm:gap-2.5 sm:px-1.5">
        {VOLUMES.map((v, i) => (
          <a
            key={v.n}
            href={v.url}
            target="_blank"
            rel="noopener"
            onClick={() => track("open_volume", { volume: v.numeral, surface: "shelf" })}
            style={{
              ["--s" as string]: `var(--vol-${v.n})`,
              animationDelay: `${120 + i * 90}ms`,
            }}
            className="spine ink-rise flex h-[218px] min-w-[52px] flex-1 items-center justify-between py-3 no-underline sm:h-[300px] sm:min-w-[74px] sm:flex-none sm:py-4"
            aria-label={`Volume ${v.numeral} — ${v.title}`}
          >
            <span
              className="font-display text-2xl tracking-widest sm:text-3xl"
              style={{ color: "var(--s)" }}
            >
              {v.numeral}
            </span>
            <span className="display-title px-1 text-[16px] tracking-wide sm:text-[21px] sm:tracking-wider">
              {v.title}
            </span>
            <span className="h-2 w-full flex-none sm:h-2.5" style={{ background: "var(--s)" }} />
          </a>
        ))}
      </div>
      <div className="mt-0 h-3 rounded-sm bg-foreground shadow-[0_10px_26px_-18px_var(--foreground)] sm:h-3.5" />
      <p className="eyebrow mt-2 text-[10px] sm:text-[11px]">
        Pull a spine to read it · Each volume is one self-contained file
      </p>
    </div>
  );
}


function Home() {
  return (
    <>
      {/* Masthead */}
      <section className="mx-auto max-w-5xl px-5 pt-12 pb-4 sm:px-6 sm:pt-16">
        <p className="eyebrow ink-rise">{LIBRARY.edition} · Free Edition</p>
        <h1
          className="display-title ink-rise mt-3 text-[clamp(2.75rem,13vw,6.5rem)] leading-[0.92] sm:mt-4"
          style={{ animationDelay: "80ms" }}
        >
          The Strategic
          <br />
          Master Library
        </h1>
        {/* The spectrum appears exactly once. */}
        <div
          className="spectrum-rule ink-rise mt-4 h-1.5 origin-left rounded-full shadow-[0_0_24px_-6px_var(--vol-2)] sm:mt-5 sm:h-2"
          style={{ animationDelay: "180ms" }}
        />
        <p
          className="eyebrow ink-rise mt-3 text-[10px] text-ink-dim sm:text-[11px]"
          style={{ animationDelay: "240ms" }}
        >
          {LIBRARY.tagline}
        </p>

        <p
          className="ink-rise mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-dim sm:mt-8 sm:text-[19px]"
          style={{ animationDelay: "300ms" }}
        >
          Six volumes distilled from a private compendium of twenty-nine audited project
          owner's manuals — reorganized by <em>message</em>, not by project — plus the
          two-stage toolkit that produced those manuals, so the method ships as an
          instrument, not just an argument.
        </p>

        <div className="ink-rise mt-7 sm:mt-8" style={{ animationDelay: "380ms" }}>
          <DownloadButtons />
        </div>
        <p
          className="ink-rise mt-4 font-mono text-[11px] leading-relaxed text-ink-faint sm:text-[12px]"
          style={{ animationDelay: "440ms" }}
        >
          No email. No account. No third-party trackers, ads, or cookies — only anonymous
          first-party counts. Read the{" "}
          <Link to="/license" className="rule-link">
            license
          </Link>{" "}
          before you redistribute.
        </p>
      </section>

      {/* Shelf */}
      <section className="mx-auto max-w-5xl px-5 pt-12 sm:px-6 sm:pt-14">
        <Shelf />
      </section>

      {/* Install / offline */}
      <Reveal as="section" className="mx-auto max-w-5xl px-5 pt-14 sm:px-6 sm:pt-16">
        <InstallSection />
      </Reveal>

      {/* Message list */}
      <Reveal as="section" className="mx-auto max-w-5xl px-5 pt-14 sm:px-6 sm:pt-16">
        <h2 className="display-title border-b-2 border-foreground pb-2 text-[clamp(1.75rem,7vw,2rem)]">
          The six messages
        </h2>
        <ul className="mt-2 list-none p-0">
          {VOLUMES.map((v) => (
            <li
              key={v.n}
              className="list-row group grid grid-cols-[38px_minmax(0,1fr)] items-baseline gap-3 border-b border-border py-4 sm:grid-cols-[52px_1fr] sm:gap-4"
            >
              <span

                className="font-display text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ color: `var(--vol-${v.n})` }}
              >
                {v.numeral}
              </span>
              <div>
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener"
                  className="rule-link font-semibold"
                >
                  {v.title}
                </a>
                <p className="m-0 text-ink-dim">{v.message}</p>
                <p className="m-0 mt-1 font-mono text-[11px] leading-relaxed text-ink-faint">
                  {v.drawnFrom}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link
            to="/volumes"
            className="rule-link group inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase"
          >
            Full volume index
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </p>
      </Reveal>


      {/* What this is */}
      <Reveal as="section" className="mx-auto grid max-w-5xl gap-10 px-6 pt-20 md:grid-cols-2">
        <div>
          <h2 className="display-title border-b-2 border-foreground pb-2 text-3xl">
            What this is
          </h2>
          <p className="mt-4">
            The source is a private compendium: twenty-nine full owner's manuals for
            twenty-nine shipped and shipping projects, written in one voice by one founder,
            each audited against the live code it describes. That compendium is organized by
            project, because its job is retrieval.
          </p>
          <p>
            This edition is organized by <em>message</em>, because its job is transfer. The
            same corpus, cut along a different axis: not "here is everything about project
            X," but "here is one thing this whole body of work proves, with the receipts."
          </p>
          <p>
            Projects appear inside the volumes as <strong>exhibits</strong> — evidence, not
            chapters. A portfolio is not a list of things; it is a set of lessons that happen
            to have running code attached.
          </p>
        </div>
        <div>
          <h2 className="display-title border-b-2 border-foreground pb-2 text-3xl">
            Who it is for
          </h2>
          <p className="mt-4">
            Solo builders, small teams, and anyone documenting a body of work they intend to
            outlive. Nothing in these volumes requires access to the source projects. Every
            practice section is written to be applied to <em>your</em> work, not to admire
            someone else's.
          </p>
          <h2 className="display-title mt-10 border-b-2 border-foreground pb-2 text-3xl">
            What was left out
          </h2>
          <p className="mt-4">
            This is a public edition distilled from a confidential source. Broker
            relationships, named contacts, valuation figures, patent application numbers,
            inheritance mechanics, security-testing targets, and internal infrastructure
            details were deliberately excluded. What ships here is the method — which is the
            part that transfers.
          </p>
        </div>
      </Reveal>

      {/* Truth legend */}
      <Reveal as="section" className="mx-auto max-w-5xl px-6 pt-20">
        <h2 className="display-title border-b-2 border-foreground pb-2 text-3xl">
          The truth legend
        </h2>
        <p className="mt-4 max-w-2xl">
          Claims carried over from the source manuals keep their original truth tags. They
          mean the same thing everywhere they appear.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {TRUTH_LEGEND.map((t) => (
            <div key={t.tag} className="list-row flex items-start gap-3 border-b border-border pb-3">
              <span
                className={`mt-0.5 shrink-0 rounded-sm border-[1.5px] px-2 py-px font-mono text-[10px] font-semibold tracking-wider ${
                  t.tag === "CONFIRMED"
                    ? "text-vol-5"
                    : t.tag === "OBSERVED"
                      ? "text-vol-2"
                      : t.tag === "INFERRED"
                        ? "text-[#8a6d00]"
                        : t.tag === "PLANNED"
                          ? "text-vol-3"
                          : t.tag === "SPECULATIVE"
                            ? "text-vol-1"
                            : "border-dashed text-ink-faint"
                }`}
              >
                {t.tag}
              </span>
              <span className="text-sm text-ink-dim">{t.def}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-2xl">
          The rule that governs them all: <strong>demote claims, do not promote them.</strong>{" "}
          When in doubt, a claim moves down the ladder, never up.
        </p>
      </Reveal>

      {/* What's in the box */}
      <Reveal as="section" className="mx-auto max-w-5xl px-6 pt-20">
        <h2 className="display-title border-b-2 border-foreground pb-2 text-3xl">
          What's in the download
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              k: "dist/",
              t: "The built shelf",
              d: "Six self-contained HTML volumes plus the shelf index. Print → PDF gives a clean per-volume PDF. No build step required to read.",
            },
            {
              k: "toolkit/",
              t: "The two-stage instrument",
              d: "Stage One generates an eighteen-section, truth-labeled Owner's Manual for your project. Stage Two is the forensic pass that demotes claims and publishes the correction log.",
            },
            {
              k: "build.py",
              t: "The deterministic compiler",
              d: "Python standard library only. No dependencies, no network, no clock. Same inputs, byte-identical outputs, forever.",
            },
            {
              k: "certify.py",
              t: "Numbered ownership certificates",
              d: "Mints a sealed Certificate of Ownership: sha256(library_seal | owner | copy | date), recorded in a register. Provenance, not copy protection.",
            },
            {
              k: "content/",
              t: "House-style markdown source",
              d: "Every volume as source. Copy a file, keep the directive block, add it to manifest.json, rebuild — the shelf grows a spine.",
            },
            {
              k: "SEALS.txt",
              t: "The seal chain",
              d: "Every built file sealed by SHA-256, capped by a single library seal. Verify the copy you hold matches the edition that was published.",
            },
          ].map((c, i) => (
            <Reveal key={c.k} delay={i * 70} className="paper-card p-5">
              <p className="eyebrow m-0">{c.k}</p>
              <h3 className="display-title mt-2 mb-2 text-xl">{c.t}</h3>
              <p className="m-0 text-sm text-ink-dim">{c.d}</p>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* Seal + final CTA */}
      <Reveal as="section" className="mx-auto max-w-5xl px-6 pt-20">
        <div className="paper-card bg-paper-2 p-8">
          <p className="eyebrow m-0">Library seal · SHA-256</p>
          <p className="seal-glow mt-2 mb-6 font-mono text-[11px] break-all text-ink-dim sm:text-[13px]">
            {LIBRARY.librarySeal}
          </p>
          <h2 className="display-title text-[clamp(2rem,6vw,3.5rem)]">
            Take the whole library. Free.
          </h2>
          <p className="mt-3 mb-6 max-w-xl text-ink-dim">
            One zip. Six volumes, the toolkit, the source markdown, the compiler, and the
            seals. Nothing phones home.
          </p>
          <DownloadButtons compact />
        </div>
      </Reveal>
    </>
  );
}
