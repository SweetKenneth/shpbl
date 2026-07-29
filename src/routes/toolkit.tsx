import { createFileRoute } from "@tanstack/react-router";
import { OG_IMAGE, SITE_URL, ZIP_URL } from "@/lib/library";

const TITLE = "The Two-Stage Toolkit — Owner's Manual & Truth Audit | SHPBL";
const DESC =
  "Stage One generates an eighteen-section, truth-labeled Owner's Manual for your project. Stage Two is the forensic pass that demotes claims and publishes the correction log.";

export const Route = createFileRoute("/toolkit")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      {
        property: "og:description",
        content:
          "The same instrument that produced twenty-nine audited owner's manuals, generalized for your projects. Free.",
      },
      { property: "og:url", content: `${SITE_URL}/toolkit` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/toolkit` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Write an audited Owner's Manual for your project",
          description: DESC,
          step: [
            {
              "@type": "HowToStep",
              name: "Stage One — the Owner's Manual Patch",
              text: "Generate the eighteen-section, truth-labeled manual for your project.",
            },
            {
              "@type": "HowToStep",
              name: "Stage Two — the Truth Audit Patch",
              text: "Run the forensic pass: demote claims, publish the diff, score the result.",
            },
          ],
        }),
      },
    ],
  }),
  component: Toolkit,
});


const STAGES = [
  {
    n: "Stage One",
    accent: "var(--vol-2)",
    title: "The Owner's Manual Patch",
    body: "Generates the eighteen-section manual for your project: truth labels inline, phased from source intake to a print-ready render. This is Volume V in executable form.",
    file: "toolkit/01-owners-manual-patch.md",
  },
  {
    n: "Stage Two",
    accent: "var(--vol-1)",
    title: "The Truth Audit Patch",
    body: "The forensic pass: demote claims, publish the diff, score the result. Wherever the manual and the live code disagree, the code wins. This is Volume I in executable form.",
    file: "toolkit/02-truth-audit-patch.md",
  },
];

function Toolkit() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-14">
      <p className="eyebrow">The Method, Shipped</p>
      <h1 className="display-title mt-3 text-[clamp(2.5rem,8vw,4.5rem)]">The Toolkit</h1>
      <p className="mt-4 text-ink-dim">
        The volumes describe the method. The toolkit ships it — the same two-stage instrument
        that produced all twenty-nine source manuals, generalized for your projects.
      </p>

      <div className="mt-12 space-y-6">
        {STAGES.map((s) => (
          <div key={s.n} className="paper-card p-7" style={{ borderLeftWidth: 8, borderLeftColor: s.accent }}>
            <p className="eyebrow m-0" style={{ color: s.accent }}>
              {s.n}
            </p>
            <h2 className="display-title mt-1 text-3xl">{s.title}</h2>
            <p className="mt-3 mb-4 text-ink-dim">{s.body}</p>
            <p className="m-0 font-mono text-[12px] text-ink-faint">{s.file}</p>
          </div>
        ))}
      </div>

      <h2 className="display-title mt-16 border-b-2 border-foreground pb-2 text-3xl">
        How to run it
      </h2>
      <ol className="mt-4 space-y-2 pl-5 text-ink-dim">
        <li>Download the library and open the two files in the toolkit folder.</li>
        <li>Paste Stage One into your AI session of choice, against your own project.</li>
        <li>Fill in your identity block. The manual you produce is yours.</li>
        <li>Run Stage Two on the result. Publish the corrections rather than burying them.</li>
      </ol>
      <p className="mt-4 text-ink-dim">
        The method carries its credit line. The output is your asset.
      </p>

      <div className="paper-card mt-14 bg-paper-2 p-7">
        <h2 className="display-title text-2xl">Get the toolkit</h2>
        <p className="mt-2 mb-5 text-ink-dim">
          It ships inside the library package, alongside all six volumes.
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
