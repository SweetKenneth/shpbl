import { useEffect, useState } from "react";
import { OFFLINE_ROUTES, registerServiceWorker } from "@/lib/register-sw";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "shpbl:install-dismissed";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    void registerServiceWorker();
  }, []);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    setInstalling(true);
    try {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "dismissed") localStorage.setItem(DISMISS_KEY, "1");
      setVisible(false);
      setDeferred(null);
    } finally {
      setInstalling(false);
    }
  };

  if (!visible || !deferred) return null;

  return (
    <div
      role="dialog"
      aria-label="Install the Strategic Master Library"
      className="no-print ink-rise fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[24rem]"
    >
      <div className="paper-card cert-emboss bg-paper-2 p-5">
        <div className="spectrum-rule mb-4 h-1 w-full rounded-full opacity-80" />
        <div className="flex items-start gap-3">
          <img src="/icons/icon.svg" alt="" aria-hidden="true" className="mt-0.5 h-9 w-9 shrink-0" />
          <div className="min-w-0">
            <p className="eyebrow m-0">Keep it on the shelf</p>
            <h2 className="display-title mt-1 text-2xl leading-none">Install SHPBL</h2>
            <p className="mt-2 mb-0 text-sm text-ink-dim">
              Adds the library to your home screen. The landing page, volume index, toolkit,
              and license stay readable{" "}
              <span className="whitespace-nowrap">with no connection</span>.
            </p>
            <p className="mt-2 mb-0 font-mono text-[10px] tracking-widest text-ink-faint uppercase">
              {OFFLINE_ROUTES.length} pages cached · no tracking
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <button
            onClick={install}
            disabled={installing}
            className="ink-button inline-flex items-center rounded-sm border-2 border-foreground bg-foreground px-5 py-2 font-mono text-[11px] tracking-[0.18em] uppercase text-background disabled:opacity-60"
          >
            {installing ? "Installing…" : "Install"}
          </button>
          <button
            onClick={dismiss}
            className="ghost-button inline-flex items-center rounded-sm border-2 border-foreground px-5 py-2 font-mono text-[11px] tracking-[0.18em] uppercase"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
