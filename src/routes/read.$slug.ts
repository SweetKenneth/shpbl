import { createFileRoute } from "@tanstack/react-router";

import { VOLUME_BY_SLUG } from "@/lib/library";

// The CDN serves volume HTML with Content-Disposition: attachment, which forces
// a download and breaks the reading flow (and the PWA). This route proxies the
// same bytes back inline so a volume opens directly in the browser, printable
// exactly as shipped.
export const Route = createFileRoute("/read/$slug")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const volume = VOLUME_BY_SLUG[params.slug];
        if (!volume) return new Response("Unknown volume.", { status: 404 });

        const source = new URL(volume.url, request.url);
        const upstream = await fetch(source.toString(), {
          headers: { accept: "text/html" },
        });
        if (!upstream.ok) {
          return new Response("Volume temporarily unavailable.", { status: 502 });
        }

        const raw = await upstream.text();
        // The sealed HTML links to sibling files (index.html, volume-NN-….html).
        // Under /read/:slug those relative paths 404, so map them onto app routes.
        const html = raw.replace(
          /href="(?:\.\/)?([A-Za-z0-9._-]+)\.html"/g,
          (match, name: string) => {
            if (name === "index") return 'href="/volumes"';
            if (VOLUME_BY_SLUG[name]) return `href="/read/${name}"`;
            return match;
          },
        );
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
