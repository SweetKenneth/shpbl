import { createFileRoute } from "@tanstack/react-router";

import {
  AUTHOR_URL,
  COLLECTIVE,
  LIBRARY,
  OG_IMAGE,
  ORCID_ID,
  ORCID_URL,
  SHELF_URL,
  SITE_URL,
  VOLUME_BY_SLUG,
  VOLUMES,
} from "@/lib/library";

const SHELF_SLUG = "shelf";

const escapeAttr = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * The sealed HTML carries a bare <title> and nothing else. These volumes are
 * the substance of the site, so the reader route dresses the proxied head with
 * canonical, social, and citation metadata — none of which alters the bytes a
 * reader downloads or the seal they can verify against.
 */
function readerHead(slug: string): string {
  const v = VOLUME_BY_SLUG[slug];
  // The printable shelf duplicates /volumes, so it points its canonical there
  // rather than competing with it for the same query.
  const canonical = v ? `${SITE_URL}/read/${slug}` : `${SITE_URL}/volumes`;


  const title = v
    ? `Volume ${v.numeral} — ${v.title} | SHPBL`
    : "The Shelf — The Strategic Master Library | SHPBL";
  const description = v
    ? `${v.message} Volume ${v.numeral} of The Strategic Master Library, free to read, print, and keep.`
    : "All six volumes of The Strategic Master Library on one shelf. Free to read, print, and keep.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": v ? "Chapter" : "CollectionPage",
    name: v ? `Volume ${v.numeral} — ${v.title}` : "The Shelf",
    headline: v ? `Volume ${v.numeral} — ${v.title}` : "The Shelf",
    url: canonical,
    inLanguage: "en",
    isAccessibleForFree: true,
    license: `${SITE_URL}/license`,
    ...(v
      ? {
          position: v.n,
          abstract: v.message,
          isPartOf: {
            "@type": "Book",
            name: LIBRARY.title,
            bookEdition: LIBRARY.subtitle,
            url: SITE_URL,
            numberOfPages: undefined,
          },
        }
      : {}),
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#author`,
      name: LIBRARY.author,
      url: AUTHOR_URL,
      identifier: {
        "@type": "PropertyValue",
        propertyID: "ORCID",
        value: ORCID_ID,
        url: ORCID_URL,
      },
      sameAs: [AUTHOR_URL, ORCID_URL],
    },
    publisher: { "@type": "Organization", name: COLLECTIVE, url: AUTHOR_URL },
  };

  return `
<meta name="description" content="${escapeAttr(description)}">
<meta name="author" content="${escapeAttr(LIBRARY.author)}">
<meta name="robots" content="${v ? "index, follow, max-image-preview:large, max-snippet:-1" : "noindex, follow"}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="${escapeAttr(LIBRARY.title)}">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${escapeAttr(title)}">
<meta property="og:description" content="${escapeAttr(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${OG_IMAGE}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeAttr(title)}">
<meta name="twitter:description" content="${escapeAttr(description)}">
<meta name="twitter:image" content="${OG_IMAGE}">
<meta name="theme-color" content="#fafaf7">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" sizes="180x180">
<link rel="manifest" href="/manifest.webmanifest">
${v && v.n > 1 ? `<link rel="prev" href="${SITE_URL}/read/${VOLUMES[v.n - 2].slug}">` : ""}
${v && v.n < VOLUMES.length ? `<link rel="next" href="${SITE_URL}/read/${VOLUMES[v.n].slug}">` : ""}
<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
`;
}


/** Slim, print-hidden chrome so a reader is never stranded inside a volume. */
function readerChrome(slug: string): string {
  const current = VOLUME_BY_SLUG[slug];
  const prev = current ? VOLUMES.find((v) => v.n === current.n - 1) : undefined;
  const next = current ? VOLUMES.find((v) => v.n === current.n + 1) : undefined;
  const label = current ? `Volume ${current.numeral}` : "The Shelf";

  const link = (href: string, text: string) =>
    `<a href="${href}">${text}</a>`;

  return `<style>
.shpbl-bar{position:sticky;top:0;z-index:50;display:flex;align-items:center;
  justify-content:space-between;gap:12px;padding:9px 18px;
  background:color-mix(in oklab, var(--paper) 88%, transparent);
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  border-bottom:2px solid var(--ink);font-family:var(--mono);font-size:11px;
  letter-spacing:.14em;text-transform:uppercase}
.shpbl-bar a{color:var(--ink);text-decoration:none;white-space:nowrap;
  transition:opacity .25s ease}
.shpbl-bar a:hover{opacity:.55}
.shpbl-bar nav{display:flex;gap:14px;align-items:center;overflow:hidden}
.shpbl-bar .shpbl-where{color:var(--ink-faint);letter-spacing:.2em}
.shpbl-progress{position:sticky;top:38px;z-index:49;height:2px;width:0;
  background:var(--accent);transition:width .1s linear}
@media (max-width:520px){.shpbl-bar .shpbl-where{display:none}}
@media print{.shpbl-bar,.shpbl-progress{display:none!important}}
</style>
<div class="shpbl-bar">
  <nav>${link("/", "← SHPBL")}<span class="shpbl-where">${label}</span></nav>
  <nav>
    ${prev ? link(prev.readUrl, "← Prev") : ""}
    ${current ? link("/volumes", "Shelf") : link("/", "Download")}
    ${next ? link(next.readUrl, "Next →") : ""}
  </nav>
</div>
<div class="shpbl-progress" id="shpbl-progress"></div>
<script>
(function(){
  var bar=document.getElementById('shpbl-progress');
  if(!bar||!window.matchMedia)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var tick=function(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(h>0?Math.min(1,window.scrollY/h)*100:0)+'%';
  };
  tick();
  window.addEventListener('scroll',tick,{passive:true});
  window.addEventListener('resize',tick,{passive:true});
})();
</script>`;
}

// The CDN serves volume HTML with Content-Disposition: attachment, which forces
// a download and breaks the reading flow (and the PWA). This route proxies the
// same bytes back inline so a volume opens directly in the browser, printable
// exactly as shipped.
export const Route = createFileRoute("/read/$slug")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const isShelf = params.slug === SHELF_SLUG;
        const sourceUrl = isShelf ? SHELF_URL : VOLUME_BY_SLUG[params.slug]?.url;
        if (!sourceUrl) return new Response("Unknown volume.", { status: 404 });

        const source = new URL(sourceUrl, request.url);
        const upstream = await fetch(source.toString(), {
          headers: { accept: "text/html" },
        });
        if (!upstream.ok) {
          return new Response("Volume temporarily unavailable.", { status: 502 });
        }

        const raw = await upstream.text();
        // The sealed HTML links to sibling files (index.html, volume-NN-….html).
        // Under /read/:slug those relative paths 404, so map them onto app routes.
        let html = raw.replace(
          /href="(?:\.\/)?([A-Za-z0-9._-]+)\.html"/g,
          (match, name: string) => {
            if (name === "index") return 'href="/volumes"';
            if (VOLUME_BY_SLUG[name]) return `href="/read/${name}"`;
            return match;
          },
        );

        // Dress the head for crawlers and share cards; the body gets the chrome.
        html = html.replace(/<\/head>/i, `${readerHead(params.slug)}</head>`);
        html = html.replace(/<body([^>]*)>/i, (m, attrs) => `<body${attrs}>${readerChrome(params.slug)}`);

        // Volume VI closes the library, so it carries the closing track —
        // after PRACTICE, before the colophon/nav.
        const { CLOSING_TRACK_SLUG, closingTrackHtml } = await import("@/lib/closing-track.server");
        if (params.slug === CLOSING_TRACK_SLUG) {
          const { default: audio } = await import("@/assets/built-to-last.mp3.asset.json");
          html = html.replace(
            '<footer class="colophon">',
            `${closingTrackHtml(audio.url)}\n<footer class="colophon">`,
          );
        }

        return new Response(html, {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
            "content-disposition": "inline",
            "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
            // The volumes are the point of the site — let them be found.
            "x-robots-tag": "index, follow, max-snippet:-1, max-image-preview:large",
          },
        });

      },
    },
  },
});
