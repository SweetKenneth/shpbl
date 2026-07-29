import { createFileRoute } from "@tanstack/react-router";
import { OG_IMAGE, SITE_URL, VOLUMES, ZIP_URL } from "@/lib/library";
import { Reveal } from "@/components/Reveal";

const TITLE = "The Six Volumes — Strategic Master Library | SHPBL";
const DESC =
  "Volume index: Demote Claims, Substrates Not Features, Ship the Crystal, Software with a Soul, Built to Be Inherited, The Drift Watch. Read online or download free.";

export const Route = createFileRoute("/volumes")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      {
        property: "og:description",
        content:
          "One argument per volume, with exhibits drawn from twenty-nine audited owner's manuals. Read online or download free.",
      },
      { property: "og:url", content: `${SITE_URL}/volumes` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/volumes` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "The Strategic Master Library — Volume Edition",
          itemListElement: VOLUMES.map((v) => ({
            "@type": "ListItem",
            position: v.n,
            name: `Volume ${v.numeral} — ${v.title}`,
            description: v.message,
            url: `${SITE_URL}/volumes`,
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "The Six Volumes", item: `${SITE_URL}/volumes` },
          ],
        }),
      },
    ],
  }),
  component: Volumes,
});


function Volumes() {
  return (
    <div className="mx-auto max-w-4xl px-5 pt-12 sm:px-6 sm:pt-14">
      <p className="eyebrow ink-rise">Volume Index</p>
      <h1 className="display-title ink-rise mt-3 text-[clamp(2.5rem,8vw,4.5rem)]">The Six Volumes</h1>
      <p className="mt-4 max-w-2xl text-ink-dim">
        Each volume makes a single argument. Projects appear inside as exhibits — evidence,
        not chapters. Every volume is one self-contained HTML file; print it to PDF and you
        have the boxed set.
      </p>

      <div className="mt-12 space-y-8">
        {VOLUMES.map((v) => (
          <Reveal
            as="article"
            key={v.n}
            delay={v.n * 40}
            className="vol-panel pl-6"
            style={{ borderLeft: `4px solid var(--vol-${v.n})` }}
          >
            <p className="eyebrow m-0" style={{ color: `var(--vol-${v.n})` }}>
              Volume {v.numeral}
            </p>
            <h2 className="display-title mt-1 text-[clamp(1.75rem,5vw,2.75rem)]">{v.title}</h2>
            <p className="mt-2 mb-3 text-lg font-semibold">{v.message}</p>
            <p
              className="my-3 py-1 pl-4 text-ink-dim italic"
              style={{ borderLeft: `3px solid var(--vol-${v.n})` }}
            >
              {v.epigraph}
            </p>
            <p className="m-0 font-mono text-[11px] leading-relaxed text-ink-faint">
              <span className="tracking-widest">DRAWN FROM · </span>
              {v.drawnFrom}
            </p>
            <p className="m-0 mt-1 font-mono text-[11px] break-all text-ink-faint">
              <span className="tracking-widest">SEAL · </span>
              <span className="seal-glow">{v.seal}</span>
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={v.readUrl}
                className="ghost-button inline-flex items-center rounded-sm border-2 border-foreground px-5 py-2 font-mono text-[11px] tracking-widest uppercase no-underline"
              >
                Read Volume {v.numeral}
              </a>
              <a
                href={v.url}
                download
                className="rule-link font-mono text-[11px] tracking-widest uppercase no-underline text-ink-faint"
              >
                Download HTML
              </a>
            </div>

          </Reveal>
        ))}
      </div>

      <div className="paper-card mt-16 bg-paper-2 p-7">
        <h2 className="display-title text-2xl">Want all six offline?</h2>
        <p className="mt-2 mb-5 text-ink-dim">
          The full package includes the volumes, the toolkit, the markdown source, the
          deterministic compiler, and the seal chain.
        </p>
        <a
          href={ZIP_URL}
          download
          className="ink-button inline-flex items-center rounded-sm border-2 border-foreground bg-foreground px-5 py-3.5 font-mono text-[11px] sm:px-6 sm:py-3 sm:text-xs tracking-[0.18em] uppercase text-background no-underline"
        >
          Download the library — free
        </a>
      </div>
    </div>
  );
}
