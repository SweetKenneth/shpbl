import { supabaseAdmin } from "@/integrations/supabase/client.server";

type Row = {
  event: string;
  path: string;
  referrer_host: string | null;
  session_id: string;
  device: string | null;
  country: string | null;
  props: Record<string, unknown> | null;
  created_at: string;
};

function tally(rows: Row[], pick: (r: Row) => string | null | undefined, limit = 12) {
  const map = new Map<string, number>();
  for (const r of rows) {
    const k = pick(r);
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

export async function buildReport(days: number) {
  const since = new Date(Date.now() - days * 86_400_000).toISOString();

  const { data, error } = await supabaseAdmin
    .from("analytics_events")
    .select("event, path, referrer_host, session_id, device, country, props, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(50_000);

  if (error) throw error;
  const rows = (data ?? []) as Row[];

  const views = rows.filter((r) => r.event === "page_view");
  const sessions = new Set(rows.map((r) => r.session_id));

  // Daily series of views + unique sessions.
  const byDay = new Map<string, { views: number; sessions: Set<string> }>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    byDay.set(d, { views: 0, sessions: new Set() });
  }
  for (const r of rows) {
    const d = r.created_at.slice(0, 10);
    const bucket = byDay.get(d);
    if (!bucket) continue;
    if (r.event === "page_view") bucket.views += 1;
    bucket.sessions.add(r.session_id);
  }

  const downloads = rows.filter((r) => r.event === "download_zip").length;
  const installs = rows.filter((r) => r.event === "install_accepted").length;
  const promptShown = rows.filter((r) => r.event === "install_prompt_shown").length;
  const standaloneSessions = new Set(
    rows.filter((r) => r.props && (r.props as { standalone?: boolean }).standalone).map((r) => r.session_id),
  );
  const certs = rows.filter((r) => r.event === "cert_minted").length;

  return {
    days,
    totals: {
      views: views.length,
      sessions: sessions.size,
      downloads,
      certs,
      installs,
      promptShown,
      standaloneSessions: standaloneSessions.size,
      downloadRate: sessions.size ? downloads / sessions.size : 0,
      installRate: promptShown ? installs / promptShown : 0,
    },
    series: [...byDay.entries()].map(([date, v]) => ({
      date,
      views: v.views,
      sessions: v.sessions.size,
    })),
    pages: tally(views, (r) => r.path),
    events: tally(rows, (r) => r.event, 20),
    referrers: tally(rows, (r) => r.referrer_host),
    devices: tally(rows, (r) => r.device, 4),
    countries: tally(rows, (r) => r.country, 12),
    volumes: tally(
      rows.filter((r) => r.event === "open_volume"),
      (r) => String((r.props as { volume?: string } | null)?.volume ?? ""),
      6,
    ),
    recent: rows.slice(0, 40).map((r) => ({
      event: r.event,
      path: r.path,
      country: r.country,
      device: r.device,
      at: r.created_at,
    })),
  };
}

export type AnalyticsReport = Awaited<ReturnType<typeof buildReport>>;
