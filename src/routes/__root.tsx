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
import { Analytics } from "@/components/Analytics";
import { PointerInk } from "@/components/PointerInk";

import { AUTHOR_URL, COLLECTIVE, SITE_URL } from "@/lib/library";


function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
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
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
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
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "referrer", content: "strict-origin-when-cross-origin" },
      { name: "color-scheme", content: "light" },
      { name: "format-detection", content: "telephone=no" },
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
      { rel: "author", href: AUTHOR_URL },
      { rel: "me", href: AUTHOR_URL },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "SHPBL",
              alternateName: "The Strategic Master Library",
              url: SITE_URL,
              logo: `${SITE_URL}/icons/icon.svg`,
              slogan: "Knowledge is Power · Legacy is Wealth · Built to Last",
              parentOrganization: { "@type": "Organization", name: COLLECTIVE, url: AUTHOR_URL },
              founder: { "@id": `${SITE_URL}/#author` },
              sameAs: [AUTHOR_URL],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Abilene",
                addressRegion: "TX",
                addressCountry: "US",
              },
            },
            {
              "@type": "Person",
              "@id": `${SITE_URL}/#author`,
              name: "Kenneth E. Sweet Jr.",
              url: AUTHOR_URL,
              jobTitle: "Founder",
              identifier: {
                "@type": "PropertyValue",
                propertyID: "ORCID",
                value: ORCID_ID,
                url: ORCID_URL,
              },
              affiliation: { "@type": "Organization", name: COLLECTIVE, url: AUTHOR_URL },
              sameAs: [AUTHOR_URL, ORCID_URL],
            },

            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: SITE_URL,
              name: "The Strategic Master Library",
              inLanguage: "en-US",
              publisher: { "@id": `${SITE_URL}/#organization` },
              copyrightHolder: { "@id": `${SITE_URL}/#author` },
              copyrightYear: 2026,
              license: `${SITE_URL}/license`,
              isAccessibleForFree: true,
            },
          ],
        }),
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
  { to: "/letter", label: "Letter", hide: true },
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
      className={`no-print sticky top-0 z-40 border-b-2 border-foreground bg-background/92 backdrop-blur-xl supports-[not(backdrop-filter:blur(0))]:bg-background transition-shadow duration-300 ${
        scrolled ? "shadow-[0_14px_30px_-28px_var(--foreground)]" : ""
      }`}
    >
      <div
        className={`mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 transition-all duration-300 sm:gap-4 sm:px-6 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5 no-underline sm:gap-3"
          aria-label="SHPBL — The Strategic Master Library"
        >
          <img
            src="/icons/icon.svg"
            alt=""
            aria-hidden="true"
            className={`shrink-0 transition-all duration-300 ${scrolled ? "h-7 w-7" : "h-8 w-8 sm:h-9 sm:w-9"}`}
          />
          <span
            className={`display-title hidden leading-none transition-all duration-300 md:inline ${
              scrolled ? "text-lg" : "text-xl"
            }`}
          >
            The Strategic Master Library
          </span>
          <span
            className={`display-title leading-none tracking-[0.08em] transition-all duration-300 md:hidden ${
              scrolled ? "text-lg" : "text-xl"
            }`}
          >
            SHPBL
          </span>
        </Link>

        <nav className="flex shrink-0 items-center gap-3.5 font-mono text-[10px] tracking-[0.14em] uppercase sm:gap-5 sm:text-[11px] sm:tracking-widest">
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
      <div className="mx-auto max-w-5xl px-5 py-9 sm:px-6 sm:py-10 font-mono text-[12px] leading-loose text-ink-faint">
        <p className="text-ink-dim">
          The Strategic Master Library · Volume Edition · First Printing · 2026
        </p>
        <p>
          © Kenneth E. Sweet Jr. · SHPBL.com · Abilene, Texas · Built deterministically:
          same inputs, byte-identical outputs, forever
          <span className="caret-blink ml-1 inline-block">▌</span>
        </p>
        <p className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4 text-[11px] tracking-[0.14em] uppercase">
          <span className="spectrum-rule inline-block h-2 w-2 shrink-0 rounded-full" />
          <span className="text-ink-dim">A KESJr Collective Project</span>
          <span aria-hidden="true">·</span>
          <a
            href="https://KESJr.com"
            target="_blank"
            rel="noopener"
            className="rule-link no-underline"
          >
            KESJr.com
          </a>
        </p>
        <p className="mt-3 flex flex-wrap gap-5">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className="rule-link no-underline">
              {item.label}
            </Link>
          ))}
          <a href="/read/volume-06-the-drift-watch#built-to-last" className="rule-link no-underline">
            Closing Track
          </a>
        </p>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="page-grain flex min-h-dvh flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-sm focus:border-2 focus:border-foreground focus:bg-background focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:tracking-widest focus:uppercase"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="content" className="flex-1">
          {/* Required: nested routes render here. */}
          <Outlet />
        </main>
        <SiteFooter />
        <InstallPrompt />
        <Analytics />
        <PointerInk />

      </div>
    </QueryClientProvider>

  );
}

