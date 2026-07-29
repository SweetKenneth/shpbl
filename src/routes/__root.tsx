import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ScrollProgress } from "@/components/ScrollProgress";
import { InstallPrompt } from "@/components/InstallPrompt";


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
      { title: "The Strategic Master Library — Free Download | SHPBL" },
      { property: "og:title", content: "The Strategic Master Library — Free Download" },
      { name: "twitter:title", content: "The Strategic Master Library — Free Download" },
      { name: "description", content: "Six volumes distilled from twenty-nine audited owner's manuals, plus the toolkit that produced them. Free, sealed, print-ready." },
      { property: "og:description", content: "Six volumes distilled from twenty-nine audited owner's manuals, plus the toolkit that produced them. Free, sealed, print-ready." },
      { name: "twitter:description", content: "Six volumes distilled from twenty-nine audited owner's manuals, plus the toolkit that produced them. Free, sealed, print-ready." },
      { name: "theme-color", content: "#fafaf7" },
      { name: "application-name", content: "SHPBL" },
      { name: "apple-mobile-web-app-title", content: "SHPBL" },
      { name: "msapplication-TileColor", content: "#fafaf7" },
      { name: "msapplication-config", content: "/browserconfig.xml" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png", sizes: "180x180" },
      { rel: "mask-icon", href: "/icons/safari-pinned-tab.svg", color: "#0d0d14" },
      { rel: "manifest", href: "/manifest.webmanifest" },
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

const NAV = [
  { to: "/volumes", label: "Volumes", hide: false },
  { to: "/toolkit", label: "Toolkit", hide: true },
  { to: "/certificate", label: "Certificate", hide: false },
  { to: "/license", label: "License", hide: false },
] as const;

function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`no-print sticky top-0 z-40 border-b-2 border-foreground bg-background/85 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "shadow-[0_14px_30px_-28px_var(--foreground)]" : ""
      }`}
    >
      <div
        className={`mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 transition-all duration-300 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <Link
          to="/"
          className="flex items-center gap-3 no-underline"
          aria-label="SHPBL — The Strategic Master Library"
        >
          <img
            src="/icons/icon.svg"
            alt=""
            aria-hidden="true"
            className={`transition-all duration-300 ${scrolled ? "h-7 w-7" : "h-9 w-9"}`}
          />
          <span
            className={`display-title leading-none transition-all duration-300 ${
              scrolled ? "text-lg" : "text-xl"
            }`}
          >
            The Strategic Master Library
          </span>
        </Link>

        <nav className="flex items-center gap-5 font-mono text-[11px] tracking-widest uppercase">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ "data-active": "true" }}
              className={`rule-link no-underline ${item.hide ? "hidden sm:inline" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <ScrollProgress />
    </header>
  );
}


function SiteFooter() {
  return (
    <footer className="no-print mt-24 border-t-[3px] border-foreground">
      <div className="spectrum-rule h-[3px] w-full opacity-40" />
      <div className="mx-auto max-w-5xl px-6 py-10 font-mono text-[12px] leading-loose text-ink-faint">
        <p className="text-ink-dim">
          The Strategic Master Library · Volume Edition · First Printing · 2026
        </p>
        <p>
          © Kenneth E. Sweet Jr. · SHPBL.com · Abilene, Texas · Built deterministically:
          same inputs, byte-identical outputs, forever
          <span className="caret-blink ml-1 inline-block">▌</span>
        </p>
        <p className="mt-3 flex flex-wrap gap-5">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className="rule-link no-underline">
              {item.label}
            </Link>
          ))}
        </p>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="page-grain flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          {/* Required: nested routes render here. */}
          <Outlet />
        </main>
        <SiteFooter />
        <InstallPrompt />
      </div>
    </QueryClientProvider>
  );
}

