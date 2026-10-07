import { useState } from "react";
import { MARK_PATHS, MARK_VIEWBOX } from "@/lib/tecar-mark";

/*
 * Opening screen: white field, the TecAr monogram filling from bottom to top
 * like a loading bar, and the company name at the bottom (~1.9 s in total).
 *
 * - Rendered in the server HTML and driven by CSS only, so it paints with the
 *   first frame and still leaves if JavaScript fails. The page content is
 *   fully rendered underneath (crawlers and screen readers get the page).
 * - Shown once per browser session: `splashSessionScript` runs in <head>
 *   before the first paint and marks <html> when it was already shown.
 * - Hidden under prefers-reduced-motion (see tecar-corporate.css).
 * - No sound: browsers block audio before the first user interaction.
 */
export const splashSessionScript =
  "try{var s=window.sessionStorage;if(s.getItem('tc-splash')){document.documentElement.classList.add('tc-splash-off')}else{s.setItem('tc-splash','1')}}catch(e){}";

function Mark({ className }: { className: string }) {
  return <svg className={className} viewBox={MARK_VIEWBOX} aria-hidden="true">
    {MARK_PATHS.map((path) => <path key={path.d.slice(0, 24)} className={path.tone === "ink" ? "tc-mark-ink" : "tc-mark-red"} d={path.d} />)}
  </svg>;
}

export function Splash() {
  const [done, setDone] = useState(false);
  if (done) return null;
  return <div
    className="tc-splash"
    aria-hidden="true"
    onAnimationEnd={(event) => { if (event.target === event.currentTarget) setDone(true); }}
  >
    <div className="tc-splash-mark">
      <Mark className="tc-splash-base" />
      <Mark className="tc-splash-fill" />
    </div>
    <p className="tc-splash-name">TecAr Compressores Ltda</p>
  </div>;
}
