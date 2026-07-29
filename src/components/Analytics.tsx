import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

import { track } from "@/lib/analytics";

/** Fires page_view on first paint and on every client-side navigation. */
export function Analytics() {
  const router = useRouter();

  useEffect(() => {
    track("page_view");
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    ) {
      track("app_launched_standalone");
    }

    let last = window.location.pathname;
    const unsub = router.subscribe("onResolved", () => {
      const next = window.location.pathname;
      if (next === last) return;
      last = next;
      track("page_view");
    });
    return unsub;
  }, [router]);

  return null;
}
