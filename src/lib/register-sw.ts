/**
 * The ONLY place a service worker may be registered.
 * Refuses in dev, iframes, Lovable preview hosts, and when ?sw=off is present.
 */

const SW_URL = "/sw.js";

function isRefusedContext(): boolean {
  if (!import.meta.env.PROD) return true;
  if (typeof window === "undefined") return true;
  try {
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }

  const { hostname, search } = window.location;
  if (new URLSearchParams(search).has("sw") && new URLSearchParams(search).get("sw") === "off") {
    return true;
  }
  if (hostname.startsWith("id-preview--") || hostname.startsWith("preview--")) return true;
  const blocked = [
    "lovableproject.com",
    "lovableproject-dev.com",
    "beta.lovable.dev",
  ];
  if (blocked.some((h) => hostname === h || hostname.endsWith(`.${h}`))) return true;

  return false;
}

async function unregisterAppWorkers() {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    registrations
      .filter((r) => {
        const url = r.active?.scriptURL ?? r.installing?.scriptURL ?? r.waiting?.scriptURL ?? "";
        return url.endsWith(SW_URL);
      })
      .map((r) => r.unregister()),
  );
}

/** Pages guaranteed to work offline. */
export const OFFLINE_ROUTES = ["/", "/volumes", "/toolkit", "/license"];

async function warmPageCache() {
  if (!("caches" in window)) return;
  try {
    const cache = await caches.open("shpbl-pages");
    await Promise.allSettled(
      OFFLINE_ROUTES.map(async (path) => {
        const response = await fetch(path, { credentials: "same-origin" });
        if (response.ok) await cache.put(path, response.clone());
      }),
    );
  } catch {
    // non-fatal
  }
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  if (isRefusedContext()) {
    await unregisterAppWorkers();
    return;
  }

  try {
    await navigator.serviceWorker.register(SW_URL, { scope: "/" });
    await navigator.serviceWorker.ready;
    await warmPageCache();
  } catch {
    // Offline support is a progressive enhancement; failure is non-fatal.
  }
}

