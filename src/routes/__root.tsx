import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md">
        <p className="eyebrow">Error · 404</p>
        <h1 className="display-title mt-3 text-6xl">Not on the shelf</h1>
        <p className="mt-3 text-sm text-ink-faint">
          That spine doesn't exist in this edition.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center rounded-sm border-2 border-foreground bg-foreground px-5 py-2 font-mono text-xs tracking-widest uppercase text-background"
        >
          Back to the shelf
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md">
        <p className="eyebrow">Error</p>
        <h1 className="display-title mt-3 text-5xl">This page didn't load</h1>
        <p className="mt-3 text-sm text-ink-faint">Try again, or head back to the shelf.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center rounded-sm border-2 border-foreground bg-foreground px-5 py-2 font-mono text-xs tracking-widest uppercase text-background"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center rounded-sm border-2 border-foreground px-5 py-2 font-mono text-xs tracking-widest uppercase"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Kenneth E. Sweet Jr." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "The Strategic Master Library" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Lovable App" },
      { property: "og:title", content: "Lovable App" },
      { name: "twitter:title", content: "Lovable App" },
      { name: "description", content: "Master Library Hub provides free access to a strategic master library with licensing information." },
      { property: "og:description", content: "Master Library Hub provides free access to a strategic master library with licensing information." },
      { name: "twitter:description", content: "Master Library Hub provides free access to a strategic master library with licensing information." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/SIf8bhOAKvNKfnkPGoGqFQGz3TD2/social-images/social-1785331370687-D5D752EE-CADF-487B-84BF-9EBA7B206170.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/SIf8bhOAKvNKfnkPGoGqFQGz3TD2/social-images/social-1785331370687-D5D752EE-CADF-487B-84BF-9EBA7B206170.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-foreground bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link to="/" className="display-title text-xl leading-none no-underline">
          The Strategic Master Library
        </Link>
        <nav className="flex items-center gap-5 font-mono text-[11px] tracking-widest uppercase">
          <Link to="/volumes" className="no-underline hover:underline">
            Volumes
          </Link>
          <Link to="/toolkit" className="hidden no-underline hover:underline sm:inline">
            Toolkit
          </Link>
          <Link to="/certificate" className="no-underline hover:underline">
            Certificate
          </Link>
          <Link to="/license" className="no-underline hover:underline">
            License
          </Link>
        </nav>

      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-24 border-t-[3px] border-foreground">
      <div className="mx-auto max-w-5xl px-6 py-10 font-mono text-[12px] leading-loose text-ink-faint">
        <p className="text-ink-dim">
          The Strategic Master Library · Volume Edition · First Printing · 2026
        </p>
        <p>
          © Kenneth E. Sweet Jr. · SHPBL.com · Abilene, Texas · Built deterministically:
          same inputs, byte-identical outputs, forever.
        </p>
        <p className="mt-3 flex flex-wrap gap-4">
          <Link to="/volumes" className="no-underline hover:underline">
            Volumes
          </Link>
          <Link to="/toolkit" className="no-underline hover:underline">
            Toolkit
          </Link>
          <Link to="/certificate" className="no-underline hover:underline">
            Certificate
          </Link>
          <Link to="/license" className="no-underline hover:underline">
            License
          </Link>
        </p>

      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          {/* Required: nested routes render here. */}
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
