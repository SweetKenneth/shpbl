import { useEffect, useState } from "react";

import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { OFFLINE_ROUTES } from "@/lib/register-sw";
import { track } from "@/lib/analytics";

const STEPS: Record<"ios" | "android" | "desktop", string[]> = {
  ios: [
    "Tap the Share button in Safari",
    "Choose “Add to Home Screen”",
    "Name it SHPBL and tap Add",
  ],
  android: [
    "Open the browser menu (⋮)",
    "Choose “Install app” or “Add to Home screen”",
    "Confirm — the Crystal lands on your home screen",
  ],
  desktop: [
    "Click the install icon in the address bar",
    "Or open the browser menu → “Install SHPBL”",
    "It opens in its own window, no tabs, no chrome",
  ],
};

export function InstallSection() {
  const { canInstall, install, installing, installed, platform, hydrated } = useInstallPrompt();
  const [cachedPages, setCachedPages] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!("caches" in window)) return;
      try {
        const cache = await caches.open("shpbl-pages");
        const keys = await cache.keys();
        if (!cancelled) setCachedPages(keys.length);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const status = !hydrated
    ? "Checking this device…"
    : installed
      ? "Installed — you are reading the app build"
      : canInstall
        ? "Ready to install on this device"
        : platform === "ios"
          ? "Installable from Safari's Share menu"
          : "Installable from your browser menu";

  return (
    <div className="paper-card cert-emboss bg-paper-2 p-6 sm:p-8">
      <div className="spectrum-rule mb-5 h-1 w-full rounded-full opacity-80" />

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src="/icons/icon.svg"
              alt=""
              aria-hidden="true"
              className="h-10 w-10 shrink-0 sm:h-12 sm:w-12"
            />
            <div className="min-w-0">
              <p className="eyebrow m-0">Install · Offline edition</p>
              <h2 className="display-title mt-1 text-[clamp(1.75rem,7vw,2.75rem)] leading-none">
                Keep it on your shelf
              </h2>
            </div>
          </div>

          <p className="mt-4 mb-0 max-w-xl text-[15px] leading-relaxed text-ink-dim sm:text-[17px]">
            SHPBL installs as a standalone app. No store, no account, no download queue —
            the landing page, volume index, toolkit, and license stay readable with the
            plane in airplane mode.
          </p>

          <div
            className={`mt-5 inline-flex max-w-full items-center gap-2.5 text-left rounded-sm border-2 px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] uppercase ${
              installed ? "border-vol-5 text-vol-5" : "border-border-strong text-ink-faint"
            }`}
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${installed ? "bg-vol-5" : "bg-border-strong"}`}
              style={installed ? { boxShadow: "0 0 12px 2px var(--vol-5)" } : undefined}
            />
            <span className="leading-snug">{status}</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {canInstall && !installed && (
              <button
                onClick={() => void install()}
                disabled={installing}
                className="ink-button inline-flex items-center rounded-sm border-2 border-foreground bg-foreground px-5 py-3 font-mono text-[11px] tracking-[0.18em] uppercase text-background disabled:opacity-60 sm:px-6"
              >
                {installing ? "Installing…" : "Install SHPBL"}
              </button>
            )}
            <a
              href="/license"
              onClick={() => track("outbound_click", { to: "license" })}
              className="ghost-button inline-flex items-center rounded-sm border-2 border-foreground px-5 py-3 font-mono text-[11px] tracking-[0.18em] uppercase no-underline sm:px-6"
            >
              Read the license
            </a>
          </div>
        </div>

        <ol className="m-0 grid list-none gap-3 p-0 md:w-[19rem]">
          <li className="eyebrow m-0">
            {platform === "ios"
              ? "On iPhone & iPad"
              : platform === "android"
                ? "On Android"
                : "On desktop"}
          </li>
          {STEPS[platform].map((step, i) => (
            <li
              key={step}
              className="list-row grid grid-cols-[26px_minmax(0,1fr)] items-start gap-3 border-b border-border pb-3 text-[14px] leading-snug text-ink-dim sm:text-[15px]"
            >
              <span
                className="font-display text-xl leading-none"
                style={{ color: `var(--vol-${i + 1})` }}
              >
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
          <li className="m-0 font-mono text-[11px] leading-relaxed tracking-[0.14em] text-ink-faint uppercase">
            {OFFLINE_ROUTES.length} pages cached
            {cachedPages !== null ? ` · ${cachedPages} stored on this device` : ""}
          </li>
        </ol>
      </div>
    </div>
  );
}
