import { useEffect, useRef, useState } from "react";
import { Box, DoorOpen, Footprints, RotateCcw } from "lucide-react";
import { MARK_PATHS, MARK_VIEWBOX } from "@/lib/tecar-mark";
import type { SafetyAirScene } from "./scene";

/*
 * Interactive Safety Air cabin. three.js lives in its own chunk (./scene),
 * requested as soon as this module is evaluated in the browser, so on the
 * Safety Air page it downloads in parallel with the opening screen instead
 * of after it. Other pages never load it.
 *
 * Server HTML / no WebGL: the real photo is shown instead, so the page never
 * has an empty box.
 */

const loadScene = () => import("./scene");
let preload: ReturnType<typeof loadScene> | null = null;
const idle = (fn: () => void) => { if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(fn, { timeout: 2500 }); else setTimeout(fn, 400); };
/** Download (not run) the 3D chunk once the browser is idle, so it never competes with the page itself. */
export function preloadSafetyAir3D() {
  if (typeof window === "undefined") return null;
  if (!preload) idle(() => { preload ??= loadScene(); });
  return preload;
}

function webglAvailable() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

export function SafetyAir3D({ fallback }: { fallback: string }) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<SafetyAirScene | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "fallback">("loading");
  const [roofOff, setRoofOff] = useState(false);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [inside, setInside] = useState(false);

  useEffect(() => {
    if (!host.current) return;
    if (!webglAvailable()) { setState("fallback"); return; }
    let cancelled = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Build the scene only when the viewer is about to be seen, and in an idle slot,
    // so opening the page never freezes on WebGL setup.
    const start = () => {
      (preload ??= loadScene()).then(({ createSafetyAirScene }) => {
        if (cancelled || !host.current) return;
        idle(() => {
          if (cancelled || !host.current) return;
          try { api.current = createSafetyAirScene(host.current, { reducedMotion, onFirstFrame: () => setState("ready") }); }
          catch { setState("fallback"); }
        });
      }).catch(() => setState("fallback"));
    };
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { io.disconnect(); start(); } }, { rootMargin: "300px 0px" });
    io.observe(host.current);
    return () => { cancelled = true; io.disconnect(); api.current?.dispose(); api.current = null; };
  }, []);

  const toggleRoof = () => { const v = !roofOff; setRoofOff(v); api.current?.setRoof(v); };
  const toggleDoors = () => { const v = !doorsOpen; setDoorsOpen(v); api.current?.setDoors(v); };
  const toggleInside = () => { const v = !inside; setInside(v); if (v) setDoorsOpen(true); api.current?.setInside(v); };
  const reset = () => { setRoofOff(false); setDoorsOpen(false); setInside(false); api.current?.reset(); };

  return <figure className="sa3d" data-state={state}>
    <div className="sa3d-canvas" ref={host} role="img" aria-label="Modelo 3D interativo do Safety Air: cabine modular com compressor, secador e reservatório. Arraste para girar, use a roda do mouse ou o gesto de pinça para aproximar." />
    {state !== "ready" && <img className="sa3d-fallback" src={fallback} alt="Safety Air TecAr instalado em uma planta industrial" />}
    {state === "loading" && <div className="sa3d-loader" aria-live="polite">
      <div className="sa3d-loader-mark"><svg viewBox={MARK_VIEWBOX} aria-hidden="true">{MARK_PATHS.map((m) => <path key={m.d.slice(0, 24)} data-tone={m.tone} d={m.d} />)}</svg><svg viewBox={MARK_VIEWBOX} aria-hidden="true" className="sa3d-loader-fill">{MARK_PATHS.map((m) => <path key={m.d.slice(0, 24)} data-tone={m.tone} d={m.d} />)}</svg></div>
      <span>Carregando o modelo 3D</span>
    </div>}
    {state === "ready" && <>
      <div className="sa3d-controls" role="toolbar" aria-label="Controles do modelo 3D">
        <button type="button" aria-pressed={roofOff} onClick={toggleRoof}><Box size={16} aria-hidden="true" /><span className="sa3d-long">{roofOff ? "Colocar o teto" : "Tirar o teto"}</span><span className="sa3d-short">Teto</span></button>
        <button type="button" aria-pressed={doorsOpen} onClick={toggleDoors}><DoorOpen size={16} aria-hidden="true" /><span className="sa3d-long">{doorsOpen ? "Fechar portas" : "Abrir portas"}</span><span className="sa3d-short">Portas</span></button>
        <button type="button" aria-pressed={inside} onClick={toggleInside}><Footprints size={16} aria-hidden="true" /><span className="sa3d-long">{inside ? "Sair da cabine" : "Entrar na cabine"}</span><span className="sa3d-short">{inside ? "Sair" : "Entrar"}</span></button>
        <button type="button" onClick={reset} aria-label="Voltar à vista inicial"><RotateCcw size={16} aria-hidden="true" /></button>
      </div>
      <figcaption className="sa3d-hint">Arraste para girar · role ou use a pinça para aproximar</figcaption>
    </>}
  </figure>;
}
