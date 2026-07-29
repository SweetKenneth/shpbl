import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

/**
 * First-party anonymous event sink for the sealed volume HTML served by
 * /read/$slug. Those documents are raw HTML (not the React app), so they
 * cannot call the createServerFn client. Only the closing-track events are
 * accepted here; everything else stays on the server-function path.
 * No cookies, no identifiers, no third parties.
 */
const EVENTS = [
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
  sessionId: z.string().trim().max(64),
  device: z.enum(["mobile", "tablet", "desktop"]).optional(),
  standalone: z.boolean().optional(),
  props: z
    .record(z.string().max(32), z.union([z.string().max(120), z.number(), z.boolean()]))
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

        const country = getRequestHeader("cf-ipcountry") ?? null;

        await supabaseAdmin.from("analytics_events").insert({
          event: parsed.event,
          path: parsed.path || "/",
          referrer_host: null,
          session_id: parsed.sessionId,
          device: parsed.device ?? null,
          country: country && country !== "XX" ? country.slice(0, 2).toUpperCase() : null,
          props: { ...parsed.props, ...(parsed.standalone ? { standalone: true } : {}) },
        });

        return new Response(null, { status: 204 });
      },
    },
  },
});
