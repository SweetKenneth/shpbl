import { useCallback, useEffect, useState } from "react";

import { track } from "@/lib/analytics";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/** Captured once, module-level, so late-mounting UI still sees the event. */
let captured: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(e: BeforeInstallPromptEvent | null) => void>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    captured = event as BeforeInstallPromptEvent;
    listeners.forEach((l) => l(captured));
    track("install_prompt_shown");
  });
  window.addEventListener("appinstalled", () => {
    captured = null;
    listeners.forEach((l) => l(null));
  });
}

export function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export type Platform = "ios" | "android" | "desktop";

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && "ontouchend" in document)) {
    return "ios";
  }
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(captured);
  const [installed, setInstalled] = useState(false);
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [installing, setInstalling] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setInstalled(isStandalone());
    setPlatform(detectPlatform());

    const onChange = (e: BeforeInstallPromptEvent | null) => setDeferred(e);
    listeners.add(onChange);

    const onInstalled = () => setInstalled(true);
    window.addEventListener("appinstalled", onInstalled);

    const mq = window.matchMedia("(display-mode: standalone)");
    const onDisplay = () => setInstalled(isStandalone());
    mq.addEventListener("change", onDisplay);

    return () => {
      listeners.delete(onChange);
      window.removeEventListener("appinstalled", onInstalled);
      mq.removeEventListener("change", onDisplay);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return "unavailable" as const;
    setInstalling(true);
    try {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      track(outcome === "accepted" ? "install_accepted" : "install_dismissed");
      if (outcome === "accepted") setInstalled(true);
      captured = null;
      setDeferred(null);
      return outcome;
    } finally {
      setInstalling(false);
    }
  }, [deferred]);

  return { canInstall: !!deferred, install, installing, installed, platform, hydrated };
}
