import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Event ingestion lives in src/routes/api/public/pulse.ts (sendBeacon-friendly). */



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
