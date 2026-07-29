import { useEffect, useState } from "react";

/** A thin spectrum bar that tracks read progress across the page. */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setPct(max > 0 ? Math.min(1, doc.scrollTop / max) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="no-print pointer-events-none absolute inset-x-0 bottom-[-2px] h-[2px]">
      <div
        className="spectrum-rule h-full origin-left"
        style={{ transform: `scaleX(${pct})`, transition: "transform 90ms linear" }}
      />
    </div>
  );
}
