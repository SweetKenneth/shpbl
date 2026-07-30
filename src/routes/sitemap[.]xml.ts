import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { VOLUMES } from "@/lib/library";

const BASE_URL = "https://shpbl.com";


interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/volumes", changefreq: "monthly", priority: "0.9" },
          // The volumes themselves are the substance of the site — each one is
          // a full, indexable document at its reader URL.
          ...VOLUMES.map((v) => ({
            path: v.readUrl,
            changefreq: "yearly" as const,
            priority: "0.9",
          })),
          { path: "/toolkit", changefreq: "monthly", priority: "0.8" },
          { path: "/certificate", changefreq: "weekly", priority: "0.7" },
          { path: "/letter", changefreq: "yearly", priority: "0.6" },

          { path: "/license", changefreq: "yearly", priority: "0.5" },
        ];


        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
