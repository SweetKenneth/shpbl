import { useEffect } from "react";

/**
 * One delegated pointer listener for the whole document. Any element carrying
 * `ink-spot` gets `--mx`/`--my` written in element-local percentages while the
 * cursor is over it, which the CSS turns into an accent bloom. Delegation keeps
 * this to a single rAF-throttled handler regardless of how many cards render,
 * and it never runs on touch-only devices (no hover, no bloom).
 */
export function PointerInk() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { el, x, y } = pending;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
      pending = null;
    };

    const onMove = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>(".ink-spot");
      if (!target) return;
      const r = target.getBoundingClientRect();
      pending = {
        el: target,
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      };
      if (!frame) frame = requestAnimationFrame(flush);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
