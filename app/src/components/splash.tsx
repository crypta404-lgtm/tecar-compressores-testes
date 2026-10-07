import { useState } from "react";

/*
 * Opening screen: white field and the TecAr logo with a short, vibrant red
 * glow rising from behind it (~1.7 s in total).
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

export function Splash() {
  const [done, setDone] = useState(false);
  if (done) return null;
  return <div
    className="tc-splash"
    aria-hidden="true"
    onAnimationEnd={(event) => { if (event.target === event.currentTarget) setDone(true); }}
  >
    <div className="tc-splash-glow" />
    <img className="tc-splash-logo" src="/assets/tecar/logo-splash.webp" alt="" width="560" height="301" decoding="async" fetchPriority="high" />
  </div>;
}
