import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { MARK_PATHS, MARK_VIEWBOX } from "@/lib/tecar-mark";

/*
 * Product "3D" stage for the product pages (compressores, secadores,
 * acessórios). There are no 3D models of these machines, so this is the same
 * technique as the air-line manual: real CSS 3D with flat layers at different
 * depths. The transparent product photo stands on a turntable, with a
 * reflection and a contact shadow, a blueprint wall behind it and the key
 * facts floating in front. Hover tilts, drag (mouse or touch) turns it, arrow
 * keys turn it too. Depth makes the layers move apart, so it reads as an
 * object in space, not a flat picture.
 *
 * Photos still served from the old CDN (white background) get a backdrop
 * in the stage tone and multiply blending, so the white disappears.
 */

const BASE = { rx: 9, ry: -18 };

export function ProductStage3D({ image, name, facts = [] }: { image: string; name: string; facts?: string[] }) {
  const rig = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null);
  const pose = useRef({ ...BASE });
  const remote = /^https?:/.test(image);

  const apply = (rx: number, ry: number, fast = false) => {
    pose.current = { rx: Math.max(-2, Math.min(20, rx)), ry: Math.max(-48, Math.min(48, ry)) };
    const el = rig.current; if (!el) return;
    el.style.setProperty("--ps-rx", `${pose.current.rx}deg`);
    el.style.setProperty("--ps-ry", `${pose.current.ry}deg`);
    el.dataset.fast = fast ? "true" : "false";
  };
  const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current) { apply(drag.current.rx - (e.clientY - drag.current.y) * 0.15, drag.current.ry + (e.clientX - drag.current.x) * 0.3, true); return; }
    if (e.pointerType !== "mouse" || reduced()) return;
    const box = e.currentTarget.getBoundingClientRect();
    apply(BASE.rx - ((e.clientY - box.top) / box.height - 0.5) * 10, BASE.ry + ((e.clientX - box.left) / box.width - 0.5) * 40);
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => { drag.current = { x: e.clientX, y: e.clientY, ...pose.current }; e.currentTarget.setPointerCapture(e.pointerId); };
  const onUp = () => { drag.current = null; };
  const onLeave = () => { if (!drag.current) apply(BASE.rx, BASE.ry); };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const k = ({ ArrowLeft: [0, -8], ArrowRight: [0, 8], ArrowUp: [3, 0], ArrowDown: [-3, 0] } as Record<string, number[]>)[e.key];
    if (k) { e.preventDefault(); apply(pose.current.rx + k[0], pose.current.ry + k[1]); }
  };

  return <div className="ps3d" tabIndex={0} role="img" aria-label={`${name} em 3D. Arraste ou use as setas para girar.`}
    onPointerMove={onMove} onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={onUp} onPointerLeave={onLeave} onKeyDown={onKey}>
    <div className="ps3d-rig" ref={rig}>
      <div className="ps3d-wall" aria-hidden="true"><svg viewBox={MARK_VIEWBOX}>{MARK_PATHS.map((m) => <path key={m.d.slice(0, 24)} d={m.d} />)}</svg></div>
      <div className="ps3d-floor" aria-hidden="true"><i /><i /><i /></div>
      <div className="ps3d-shadow" aria-hidden="true" />
      <div className="ps3d-reflection" aria-hidden="true" data-remote={remote || undefined}><img src={image} alt="" draggable={false} /></div>
      <div className="ps3d-product" data-remote={remote || undefined}><img src={image} alt={name} draggable={false} /></div>
      {facts.slice(0, 3).map((f, i) => <span key={f} className="ps3d-tag" data-slot={i} aria-hidden="true">{f}</span>)}
    </div>
    <p className="ps3d-hint" aria-hidden="true">Arraste para girar</p>
  </div>;
}
