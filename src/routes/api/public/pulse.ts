import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

/**
 * First-party anonymous event sink. Used by the React app (via sendBeacon, so
 * events survive the unload caused by cross-origin download links) and by the
 * sealed volume HTML served from /read/$slug, which is raw HTML and cannot
 * call the createServerFn client. No cookies, no identifiers, no third parties.
 */
const EVENTS = [
  "page_view",
  "download_zip",
  "download_volume",
  "read_shelf",
  "open_volume",
  "open_toolkit_asset",
  "cert_mint_started",
  "cert_minted",
  "cert_dry_run",
  "cert_verified",
  "install_prompt_shown",
  "install_accepted",
  "install_dismissed",
  "app_launched_standalone",
  "brand_kit_download",
  "outbound_click",
  "closing_track_view",
  "closing_track_play",
  "closing_track_pause",
  "closing_track_complete",
  "closing_track_seek",
  "closing_track_lyrics_open",
] as const;

const schema = z.object({
  event: z.enum(EVENTS),
  path: z.string().trim().max(256).default("/"),
  referrer: z.string().trim().max(512).optional(),
  sessionId: z.string().trim().max(64),
  device: z.enum(["mobile", "tablet", "desktop"]).optional(),
  screenW: z.number().int().min(0).max(20000).optional(),
  standalone: z.boolean().optional(),
  props: z
    .record(z.string().max(32), z.union([z.string().max(256), z.number(), z.boolean()]))
    .default({}),
});

export const Route = createFileRoute("/api/public/pulse")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed;
        try {
          parsed = schema.parse(await request.json());
        } catch {
          return new Response("Bad request", { status: 400 });
        }

        const { getRequestHeader } = await import("@tanstack/react-start/server");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        let referrerHost: string | null = null;
        if (parsed.referrer) {
          try {
            referrerHost = new URL(parsed.referrer).hostname.replace(/^www\./, "");
          } catch {
            referrerHost = null;
          }
        }

        const country =
          getRequestHeader("cf-ipcountry") ?? getRequestHeader("x-vercel-ip-country") ?? null;

        const { error } = await supabaseAdmin.from("analytics_events").insert({
          event: parsed.event,
          path: parsed.path || "/",
          referrer_host: referrerHost,
          session_id: parsed.sessionId,
          device: parsed.device ?? null,
          screen_w: parsed.screenW ?? null,
          country: country && country !== "XX" ? country.slice(0, 2).toUpperCase() : null,
          props: { ...parsed.props, ...(parsed.standalone ? { standalone: true } : {}) },
        });

        if (error) {
          console.error("pulse insert failed", error.message);
          return new Response("Insert failed", { status: 500 });
        }

        return new Response(null, { status: 204 });
      },
    },
  },
});
