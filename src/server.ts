import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/** shpbl.com is the canonical home. The Lovable-managed hostnames 301 there so
 * links, seals, and search results all resolve to one origin. Editor previews and
 * the stable /api/public/* endpoints external callers use are left alone. */
const CANONICAL_ORIGIN = "https://shpbl.com";

function canonicalRedirect(request: Request): Response | undefined {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();

  const isLovableHost = host === "lovable.app" || host.endsWith(".lovable.app");
  if (!isLovableHost) return undefined;

  const isPreviewHost =
    host.startsWith("id-preview--") || host.startsWith("preview--") || host.includes("-dev.");
  if (isPreviewHost) return undefined;

  if (url.pathname.startsWith("/api/")) return undefined;

  return Response.redirect(`${CANONICAL_ORIGIN}${url.pathname}${url.search}`, 301);
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const redirect = canonicalRedirect(request);
    if (redirect) return redirect;

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
