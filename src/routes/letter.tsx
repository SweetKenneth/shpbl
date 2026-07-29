import { createFileRoute, Link } from "@tanstack/react-router";

import { AUTHOR_URL, COLLECTIVE, LIBRARY, OG_IMAGE, SITE_URL, ZIP_URL } from "@/lib/library";
import { track } from "@/lib/analytics";

const TITLE = "Letter from the Author | SHPBL";
const DESC =
  "Why Kenneth E. Sweet Jr. wrote The Strategic Master Library, who it is for, and what he hopes you take from it — plus the projects the volumes were drawn from.";

/** Alphabetical, case-insensitive. */
const PROJECTS = [
  { host: "Bestowable.com", note: "Handing a finished thing to the next owner, intact." },
  { host: "BLDBL.com", note: "The build floor. Where the substrates get poured." },
  { host: "CMPSBL.com", note: "Composition — assembling parts into something that holds." },
  { host: "CRCKBL.com", note: "Pressure testing. What breaks, and how honestly you say so." },
  { host: "PromptFluid.com", note: "Language as an instrument, aimed at machines." },
  { host: "XCTBL.com", note: "Execution — the distance between intent and shipped." },
  { host: "yapFM.com", note: "Voice, taste, and the part of software that has a soul." },
] as const;

export const Route = createFileRoute("/letter")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: `${SITE_URL}/letter` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/letter` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Letter", item: `${SITE_URL}/letter` },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Letter from the Author",
          about: LIBRARY.title,
          url: `${SITE_URL}/letter`,
          image: OG_IMAGE,
          author: { "@type": "Person", name: LIBRARY.author, url: AUTHOR_URL },
          publisher: { "@type": "Organization", name: COLLECTIVE, url: AUTHOR_URL },
          isAccessibleForFree: true,
          inLanguage: "en",
        }),
      },
    ],
  }),
  component: Letter,
});

function Letter() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-12 pb-4 sm:px-6 sm:pt-14">
      <p className="eyebrow ink-rise">From the desk of the author</p>
      <h1 className="display-title ink-rise mt-3 text-[clamp(2.5rem,9vw,4.5rem)] leading-[0.95]">
        A letter, before you read
      </h1>
      <div className="spectrum-rule ink-rise mt-4 h-1.5 rounded-full opacity-80" />

      <div className="mt-9 space-y-5 text-[16px] leading-relaxed text-ink-dim sm:text-[18px]">
        <p className="text-foreground">
          <span className="display-title float-left mr-3 text-[3.4rem] leading-[0.8]">I</span>
          built this because I kept losing the same lessons twice. Every project taught me
          something expensive, and every project buried it in a commit message nobody would
          ever read again — including me. So I started writing the lessons down in the only
          format I trust: a manual a stranger could pick up cold and still resume the work.
        </p>
        <p>
          Six volumes came out of that. Not theory. Each one is drawn from something I
          actually shipped, argued with, broke, or walked away from. The claims are demoted on
          purpose: where something is confirmed, it says confirmed; where it is a guess, it
          says speculative. That honesty is the whole method. It is also the only part I would
          defend in a room full of people who disagree with me.
        </p>

        <h2 className="display-title mt-12 border-b-2 border-foreground pb-2 text-[clamp(1.6rem,6vw,2rem)] text-foreground">
          Who it's for
        </h2>
        <p>
          The solo founder holding six half-finished substrates and no one to hand them to.
          The engineer who inherited a system with no owner's manual and had to reverse
          engineer intent from behavior. The person building alone at midnight who suspects
          the work is good but can't prove it to anyone yet — including themselves.
        </p>
        <p>
          It is not for people looking for growth tactics. There are none here. If your
          question is how to get more attention, this is the wrong shelf.
        </p>

        <h2 className="display-title mt-12 border-b-2 border-foreground pb-2 text-[clamp(1.6rem,6vw,2rem)] text-foreground">
          What I hope you get out of it
        </h2>
        <p>
          One clean decision. That's the bar. If a single chapter makes you delete a feature,
          rename a thing correctly, write the manual before the marketing, or refuse a deal
          that would have cost you the substrate — the library paid for itself, and it was
          free.
        </p>
        <p>
          And if you take the method and never mention my name, that's fine too. Fork the
          method, not the identity. The volumes are sealed so you can prove they didn't drift;
          they are free so nothing stands between you and the part you needed.
        </p>

        <p className="mt-10 text-foreground">
          Thank you for digging this far. Most people don't.
        </p>
      </div>

      <div className="mt-8">
        <p className="display-title text-3xl">{LIBRARY.author}</p>
        <p className="mt-1 font-mono text-[11px] tracking-[0.18em] text-ink-faint uppercase">
          {LIBRARY.publisher} · {COLLECTIVE}
        </p>
      </div>

      <section className="mt-16">
        <p className="eyebrow">Elsewhere</p>
        <h2 className="display-title mt-2 border-b-2 border-foreground pb-2 text-[clamp(1.6rem,6vw,2rem)]">
          A few of my projects
        </h2>
        <p className="mt-4 text-ink-dim">
          Explore if you choose. The work is there for those who choose to dig deeper.
        </p>

        <ul className="mt-6 list-none p-0">
          {PROJECTS.map((p, i) => (
            <li key={p.host}>
              <a
                href={`https://${p.host}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("outbound_click", { href: p.host })}
                className="list-row grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border py-4 no-underline sm:gap-4"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: `var(--vol-${(i % 6) + 1})` }}
                />
                <span className="min-w-0">
                  <span className="display-title block text-[clamp(1.15rem,5vw,1.5rem)] leading-tight">
                    {p.host}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-ink-faint sm:text-sm">
                    {p.note}
                  </span>
                </span>
                <span className="font-mono text-[11px] tracking-[0.18em] text-ink-faint uppercase">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-ink-faint">
          More of the same hand at{" "}
          <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer" className="rule-link">
            KESJr.com
          </a>
          .
        </p>

        <p className="mt-4 text-sm">
          <a href="/read/volume-06-the-drift-watch#built-to-last" className="rule-link">
            Listen to “Built to Last” →
          </a>
        </p>
      </section>

      <div className="paper-card mt-14 mb-6 p-7">
        <h2 className="display-title text-2xl">Start with the shelf</h2>
        <p className="mt-2 mb-5 text-ink-dim">
          Six volumes, the toolkit, and the source — one zip, no cost, no email.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={ZIP_URL}
            download
            onClick={() => track("download_zip", { from: "letter" })}
            className="ink-button inline-flex items-center rounded-sm border-2 border-foreground bg-foreground px-5 py-3.5 font-mono text-[11px] tracking-[0.18em] text-background uppercase no-underline sm:px-6 sm:py-3 sm:text-xs"
          >
            Download the library
          </a>
          <Link
            to="/volumes"
            className="ghost-button inline-flex items-center rounded-sm border-2 border-foreground px-5 py-3.5 font-mono text-[11px] tracking-[0.18em] uppercase no-underline sm:px-6 sm:py-3 sm:text-xs"
          >
            Read the volumes
          </Link>
        </div>
      </div>
    </div>
  );
}
