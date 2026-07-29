import { createFileRoute } from "@tanstack/react-router";

import { SHELF_URL, VOLUME_BY_SLUG, VOLUMES } from "@/lib/library";

const SHELF_SLUG = "shelf";

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
.spine .spine-title,.spine .title{font-size:clamp(11px,1.5vw,19px);overflow-wrap:anywhere}
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
            "x-robots-tag": "noindex",
          },
        });
      },
    },
  },
});
