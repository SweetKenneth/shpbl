import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EVENTS = [
  "page_view",
  "download_zip",
  "read_shelf",
  "open_volume",
  "open_toolkit_asset",
  "cert_mint_started",
  "cert_minted",
  "cert_verified",
  "install_prompt_shown",
  "install_accepted",
  "install_dismissed",
  "app_launched_standalone",
  "brand_kit_download",
  "outbound_click",
] as const;

const clip = (n: number) => z.string().trim().max(n);

const eventSchema = z.object({
  event: z.enum(EVENTS),
  path: clip(256).default("/"),
  referrer: clip(512).optional(),
  sessionId: clip(64),
  device: z.enum(["mobile", "tablet", "desktop"]).optional(),
  screenW: z.number().int().min(0).max(20000).optional(),
  standalone: z.boolean().optional(),
  props: z.record(z.string(), z.union([z.string().max(256), z.number(), z.boolean()])).default({}),
});

export const trackEvent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => eventSchema.parse(input))
  .handler(async ({ data }) => {
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let referrerHost: string | null = null;
    if (data.referrer) {
      try {
        referrerHost = new URL(data.referrer).hostname.replace(/^www\./, "");
      } catch {
        referrerHost = null;
      }
    }

    const country =
      getRequestHeader("cf-ipcountry") ?? getRequestHeader("x-vercel-ip-country") ?? null;

    await supabaseAdmin.from("analytics_events").insert({
      event: data.event,
      path: data.path || "/",
      referrer_host: referrerHost,
      session_id: data.sessionId,
      device: data.device ?? null,
      screen_w: data.screenW ?? null,
      country: country && country !== "XX" ? country.slice(0, 2).toUpperCase() : null,
      props: { ...data.props, ...(data.standalone ? { standalone: true } : {}) },
    });

    return { ok: true };
  });

export const getAnalyticsReport = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ key: z.string().min(1), days: z.number().int().min(1).max(365).default(30) }).parse(input),
  )
  .handler(async ({ data }) => {
    const expected = process.env.ANALYTICS_DASHBOARD_KEY;
    if (!expected || data.key !== expected) {
      throw new Error("Unauthorized");
    }
    const { buildReport } = await import("./analytics.server");
    return buildReport(data.days);
  });
