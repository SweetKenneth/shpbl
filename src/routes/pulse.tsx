import { useState, useEffect } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { getAnalyticsReport } from "@/lib/analytics.functions";
import type { AnalyticsReport } from "@/lib/analytics.server";

const searchSchema = z.object({ key: z.string().optional() });


export const Route = createFileRoute("/pulse")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Pulse — Private Analytics | SHPBL" },
      { name: "description", content: "Private, key-gated readership dashboard for SHPBL.com." },
      // robots.txt deliberately allows this URL so the directive below is read.
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
      { name: "googlebot", content: "noindex, nofollow, noarchive, nosnippet" },
      { property: "og:title", content: "Pulse — Private Analytics" },
      { property: "og:description", content: "Key-gated readership dashboard for SHPBL.com." },
    ],
  }),

  component: Pulse,
});


function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="paper-card p-4 sm:p-5">
      <p className="eyebrow m-0">{label}</p>
      <p className="display-title m-0 mt-1 text-[clamp(2rem,7vw,3rem)] leading-none">{value}</p>
      {sub && <p className="m-0 mt-1 font-mono text-[10px] tracking-widest text-ink-faint uppercase">{sub}</p>}
    </div>
  );
}

function Bars({ title, rows }: { title: string; rows: { label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div>
      <h2 className="display-title border-b-2 border-foreground pb-2 text-2xl">{title}</h2>
      {rows.length === 0 && <p className="mt-3 text-sm text-ink-faint">No data yet.</p>}
      <ul className="mt-3 list-none p-0">
        {rows.map((r) => (
          <li key={r.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-1.5">
            <div className="min-w-0">
              <p className="m-0 truncate font-mono text-[11px] sm:text-[12px]">{r.label}</p>
              <div className="mt-1 h-1.5 w-full rounded-full bg-border">
                <div
                  className="h-1.5 rounded-full bg-foreground"
                  style={{ width: `${(r.count / max) * 100}%` }}
                />
              </div>
            </div>
            <span className="font-mono text-[12px] text-ink-dim tabular-nums">{r.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pulse() {
  const search = useSearch({ from: "/pulse" });
  const [key, setKey] = useState("");
  const [days, setDays] = useState(30);
  const [report, setReport] = useState<AnalyticsReport | null>(null);

  useEffect(() => {
    if (search.key && typeof search.key === "string") {
      setKey(search.key);
    }
  }, [search.key]);

  const load = useMutation({
    mutationFn: (input: { key: string; days: number }) => getAnalyticsReport({ data: input }),
    onSuccess: (data) => setReport(data),
  });


  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  return (
    <div className="mx-auto max-w-5xl px-5 pt-12 sm:px-6 sm:pt-14">
      <p className="eyebrow ink-rise">Private · Key required</p>
      <h1 className="display-title ink-rise mt-3 text-[clamp(2.5rem,10vw,4.5rem)] leading-[0.95]">
        Pulse
      </h1>
      <div className="spectrum-rule ink-rise mt-4 h-1.5 rounded-full opacity-80" />
      <p className="mt-4 max-w-xl text-[15px] text-ink-dim sm:text-[17px]">
        First-party readership, stored in your own database. No third-party scripts, no
        cookies, no personal data — anonymous per-tab sessions only.
      </p>

      <form
        className="mt-8 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          load.mutate({ key, days });
        }}
      >
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Dashboard key"
          autoComplete="off"
          className="w-full rounded-sm border-2 border-foreground bg-background px-4 py-3 font-mono text-sm outline-none"
        />
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-sm border-2 border-foreground bg-background px-4 py-3 font-mono text-xs tracking-widest uppercase"
        >
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
          <option value={365}>365 days</option>
        </select>
        <button
          type="submit"
          disabled={load.isPending || !key}
          className="ink-button rounded-sm border-2 border-foreground bg-foreground px-6 py-3 font-mono text-xs tracking-[0.18em] uppercase text-background disabled:opacity-60"
        >
          {load.isPending ? "Reading…" : "Open"}
        </button>
      </form>

      {load.isError && (
        <p className="mt-3 font-mono text-xs text-destructive">
          Wrong key, or the register could not be read.
        </p>
      )}

      {report && (
        <>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            <Stat label="Page views" value={String(report.totals.views)} sub={`${report.days} days`} />
            <Stat label="Sessions" value={String(report.totals.sessions)} sub="unique tabs" />
            <Stat
              label="Downloads"
              value={String(report.totals.downloads)}
              sub={`${pct(report.totals.downloadRate)} of sessions`}
            />
            <Stat label="Certificates" value={String(report.totals.certs)} sub="minted" />
            <Stat label="Installs" value={String(report.totals.installs)} sub={`${pct(report.totals.installRate)} of prompts`} />
            <Stat label="Install prompts" value={String(report.totals.promptShown)} sub="shown" />
            <Stat label="App sessions" value={String(report.totals.standaloneSessions)} sub="launched installed" />
            <Stat
              label="Best day"
              value={String(Math.max(0, ...report.series.map((s) => s.views)))}
              sub="views"
            />
          </div>

          <div className="paper-card mt-8 p-4 sm:p-6">
            <p className="eyebrow m-0">Daily views</p>
            <div className="mt-4 flex h-32 items-end gap-[3px] sm:h-40">
              {report.series.map((s) => {
                const max = Math.max(1, ...report.series.map((x) => x.views));
                return (
                  <div
                    key={s.date}
                    title={`${s.date}: ${s.views} views · ${s.sessions} sessions`}
                    className="min-w-[2px] flex-1 rounded-t-[2px] bg-foreground/85 transition-all duration-300 hover:bg-foreground"
                    style={{ height: `${Math.max(2, (s.views / max) * 100)}%` }}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <Bars title="Pages" rows={report.pages} />
            <Bars title="Events" rows={report.events} />
            <Bars title="Referrers" rows={report.referrers} />
            <Bars title="Countries" rows={report.countries} />
            <Bars title="Devices" rows={report.devices} />
            <Bars title="Volumes opened" rows={report.volumes} />
          </div>

          <div className="mt-12 mb-8">
            <h2 className="display-title border-b-2 border-foreground pb-2 text-2xl">Latest</h2>
            <ul className="mt-3 list-none p-0 font-mono text-[11px] text-ink-dim">
              {report.recent.map((r, i) => (
                <li
                  key={`${r.at}-${i}`}
                  className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-border py-1.5"
                >
                  <span className="truncate">
                    {r.event} · {r.path}
                    {r.country ? ` · ${r.country}` : ""}
                    {r.device ? ` · ${r.device}` : ""}
                  </span>
                  <span className="text-ink-faint tabular-nums">
                    {new Date(r.at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
