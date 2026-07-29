import { useEffect, useState } from "react";

import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { OFFLINE_ROUTES, registerServiceWorker } from "@/lib/register-sw";
import { track } from "@/lib/analytics";

const DISMISS_KEY = "shpbl:install-dismissed";

export function InstallPrompt() {
  const { canInstall, install, installing, installed } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    void registerServiceWorker();
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
    track("install_dismissed", { surface: "toast" });
  };

  if (installed || dismissed || !canInstall) return null;

  return (
    <div
      role="dialog"
      aria-label="Install the Strategic Master Library"
      className="no-print ink-rise fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[24rem]"
    >
      <div className="paper-card cert-emboss bg-paper-2 p-4 sm:p-5">
        <div className="spectrum-rule mb-4 h-1 w-full rounded-full opacity-80" />
        <div className="flex items-start gap-3">
          <img src="/icons/icon.svg" alt="" aria-hidden="true" className="mt-0.5 h-9 w-9 shrink-0" />
          <div className="min-w-0">
            <p className="eyebrow m-0">Keep it on the shelf</p>
            <h2 className="display-title mt-1 text-2xl leading-none">Install SHPBL</h2>
            <p className="mt-2 mb-0 text-[13px] leading-snug text-ink-dim sm:text-sm">
              Adds the library to your home screen. The landing page, volume index, toolkit,
              and license stay readable{" "}
              <span className="whitespace-nowrap">with no connection</span>.
            </p>
            <p className="mt-2 mb-0 font-mono text-[10px] tracking-widest text-ink-faint uppercase">
              {OFFLINE_ROUTES.length} pages cached · no ad tech
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:flex sm:flex-wrap">
          <button
            onClick={() => void install()}
            disabled={installing}
            className="ink-button inline-flex items-center justify-center rounded-sm border-2 border-foreground bg-foreground px-5 py-2.5 font-mono text-[11px] tracking-[0.18em] uppercase text-background disabled:opacity-60"
          >
            {installing ? "Installing…" : "Install"}
          </button>
          <button
            onClick={dismiss}
            className="ghost-button inline-flex items-center justify-center rounded-sm border-2 border-foreground px-5 py-2.5 font-mono text-[11px] tracking-[0.18em] uppercase"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
