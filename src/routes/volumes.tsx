import { createFileRoute } from "@tanstack/react-router";
import { VOLUMES, ZIP_URL } from "@/lib/library";

export const Route = createFileRoute("/volumes")({
  head: () => ({
    meta: [
      { title: "The Six Volumes — Strategic Master Library" },
      {
        name: "description",
        content:
          "Volume index: Demote Claims, Substrates Not Features, Ship the Crystal, Software with a Soul, Built to Be Inherited, The Drift Watch. Read online or download free.",
      },
      { property: "og:title", content: "The Six Volumes — Strategic Master Library" },
      {
        property: "og:description",
        content:
          "One argument per volume, with exhibits drawn from twenty-nine audited owner's manuals. Read online or download free.",
      },
    ],
  }),
  component: Volumes,
});

function Volumes() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-14">
      <p className="eyebrow">Volume Index</p>
      <h1 className="display-title mt-3 text-[clamp(2.5rem,8vw,4.5rem)]">The Six Volumes</h1>
      <p className="mt-4 max-w-2xl text-ink-dim">
        Each volume makes a single argument. Projects appear inside as exhibits — evidence,
        not chapters. Every volume is one self-contained HTML file; print it to PDF and you
        have the boxed set.
      </p>

      <div className="mt-12 space-y-8">
        {VOLUMES.map((v) => (
          <article
            key={v.n}
            className="pl-6"
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
              {v.seal}
            </p>
            <a
              href={v.url}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex items-center rounded-sm border-2 border-foreground px-5 py-2 font-mono text-[11px] tracking-widest uppercase no-underline transition-colors hover:bg-foreground hover:text-background"
            >
              Read Volume {v.numeral}
            </a>
          </article>
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
          className="inline-flex items-center rounded-sm border-2 border-foreground bg-foreground px-6 py-3 font-mono text-xs tracking-[0.18em] uppercase text-background no-underline"
        >
          Download the library — free
        </a>
      </div>
    </div>
  );
}
