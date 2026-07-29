/**
 * First-party analytics. No third-party scripts, no cookies, no ad tech.
 * A random session id lives in sessionStorage and dies with the tab.
 */
import { trackEvent } from "./analytics.functions";

export type AnalyticsEvent =
  | "page_view"
  | "download_zip"
  | "read_shelf"
  | "open_volume"
  | "open_toolkit_asset"
  | "cert_mint_started"
  | "cert_minted"
  | "cert_verified"
  | "install_prompt_shown"
  | "install_accepted"
  | "install_dismissed"
  | "app_launched_standalone"
  | "brand_kit_download"
  | "outbound_click"
  | "closing_track_view"
  | "closing_track_play"
  | "closing_track_pause"
  | "closing_track_complete"
  | "closing_track_seek"
  | "closing_track_lyrics_open";

const SESSION_KEY = "shpbl:sid";
const OPT_OUT_KEY = "shpbl:analytics-off";

function sessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID().replace(/-/g, "").slice(0, 24);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "no-storage";
  }
}

function device(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1100) return "tablet";
  return "desktop";
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function analyticsOptedOut(): boolean {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

export function setAnalyticsOptOut(off: boolean) {
  try {
    if (off) localStorage.setItem(OPT_OUT_KEY, "1");
    else localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    /* ignore */
  }
}

let firstOfSession = true;

export function track(
  event: AnalyticsEvent,
  props: Record<string, string | number | boolean> = {},
) {
  if (typeof window === "undefined") return;
  if (analyticsOptedOut()) return;
  if (navigator.webdriver) return;

  const payload = {
    event,
    path: window.location.pathname,
    referrer: firstOfSession && document.referrer ? document.referrer : undefined,
    sessionId: sessionId(),
    device: device(),
    screenW: window.innerWidth,
    standalone: isStandalone(),
    props,
  };
  firstOfSession = false;

  void trackEvent({ data: payload }).catch(() => {
    /* analytics must never break the page */
  });
}
