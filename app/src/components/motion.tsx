import { useEffect, useRef, useState } from "react";

/*
 * Motion helpers for the public site.
 *
 * Rules
 * - Content is fully visible in the server HTML; motion is an enhancement that
 *   only starts after hydration ("cx-motion" on <html>), so nothing stays
 *   hidden if JavaScript fails.
 * - prefers-reduced-motion disables every effect.
 * - IntersectionObserver only; no scroll listeners.
 */

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Reveals sections of #main-content as they enter the viewport. Re-runs per route. */
export function useSectionReveal(routeKey: string) {
  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion() || typeof IntersectionObserver === "undefined") { root.classList.remove("cx-motion"); return; }
    const sections = Array.from(document.querySelectorAll<HTMLElement>("#main-content > section"));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.inview = "true";
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });
    for (const section of sections) {
      // Sections already on screen are shown immediately (no flash on load).
      const top = section.getBoundingClientRect().top;
      section.dataset.reveal = "true";
      if (top < window.innerHeight * 0.9) section.dataset.inview = "true";
      else observer.observe(section);
    }
    root.classList.add("cx-motion");
    return () => observer.disconnect();
  }, [routeKey]);
}

/** Counts up to `value` when it scrolls into view. Server HTML shows the final value. */
export function CountUp({ value, prefix = "", suffix = "", duration = 1400 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || reducedMotion() || typeof IntersectionObserver === "undefined") return;
    let frame = 0;
    setShown(0);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setShown(Math.round(value * eased));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value, duration]);

  return <span ref={ref} className="cx-count"><span aria-hidden="true">{prefix}{shown}{suffix}</span><span className="tc-sr-only">{prefix}{value}{suffix}</span></span>;
}
