import { useEffect, useRef, useState, type CSSProperties } from "react";

/*
 * "Do papel à sua planta" (Engenharia).
 *
 * A project sheet with the plan of a compressor room. The visitor drags a
 * four-stop ruler and watches the same project move through its life:
 *   0 Levantamento  - the sketch draws itself in pencil
 *   1 Projeto       - it becomes blue ink with dimensions, pipe sizes, air flow
 *   2 Montagem      - the sheet tilts into 3D and the equipment rises from it
 *   3 Em operação   - the finished installation appears, same items pinned
 * CSS 3D + inline SVG only. The rise uses a registered custom property
 * (--ptp-k), so browsers without @property just snap instead of animating.
 */

type Item = { id: string; label: string; x: number; y: number; w: number; d: number; h: number; tone: "comp" | "dryer" | "filter" | "tank" | "pipe" };

// plan coordinates in % of the sheet; h in sheet units (1000 = sheet width)
const ITEMS: Item[] = [
  { id: "c1", label: "C1", x: 12, y: 16, w: 10, d: 16, h: 150, tone: "comp" },
  { id: "c2", label: "C2", x: 25, y: 16, w: 10, d: 16, h: 150, tone: "comp" },
  { id: "c3", label: "C3", x: 38, y: 16, w: 10, d: 16, h: 150, tone: "comp" },
  { id: "f", label: "F", x: 54, y: 20, w: 4, d: 8, h: 80, tone: "filter" },
  { id: "s", label: "S", x: 62, y: 16, w: 9, d: 14, h: 115, tone: "dryer" },
  { id: "r", label: "R", x: 78, y: 15, w: 8, d: 14, h: 190, tone: "tank" },
];
// vertical pipe drops from the overhead header down to each item
const DROPS = [17, 30, 43, 56, 66.5, 82];
const PIPE_Y = 11, PIPE_H = 175;

const STAGES = [
  { title: "Levantamento", text: "Medimos a demanda, o espaço e o regime de trabalho. O primeiro traço já nasce da sua planta." },
  { title: "Projeto", text: "Equipamentos, diâmetros e caminhos do ar desenhados e calculados antes de qualquer obra." },
  { title: "Montagem", text: "O desenho vira instalação: cada equipamento e cada trecho de rede no lugar previsto." },
  { title: "Em operação", text: "A casa de máquinas pronta, entregando o ar que o processo precisa, com o desempenho projetado." },
];

const PINS = [
  { label: "Compressores", x: 72, y: 46 },
  { label: "Reservatório", x: 38, y: 34 },
  { label: "Filtros", x: 49, y: 44 },
  { label: "Rede de distribuição", x: 26, y: 12 },
];

function Box({ item }: { item: Item }) {
  const style = { left: `${item.x}%`, top: `${item.y}%`, width: `${item.w}%`, height: `${item.d}%`, "--h": item.h } as CSSProperties;
  return <div className="ptp-box" data-tone={item.tone} style={style}>
    <i className="ptp-face ptp-top" /><i className="ptp-face ptp-s" /><i className="ptp-face ptp-e" /><i className="ptp-face ptp-n" /><i className="ptp-face ptp-w" />
  </div>;
}

export function ProjectToPlant() {
  const [stage, setStage] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // the pencil sketch draws itself the first time the sheet is seen
  useEffect(() => {
    const el = root.current; if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setDrawn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setDrawn(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el); return () => io.disconnect();
  }, []);

  const current = STAGES[stage];
  return <div className="ptp" ref={root} data-stage={stage} data-drawn={drawn ? "true" : undefined}>
    <div className="ptp-stage">
      <div className="ptp-scene" aria-hidden="true">
        <div className="ptp-sheet">
          <svg className="ptp-plan" viewBox="0 0 1000 600" preserveAspectRatio="none">
            {/* room */}
            <path className="ptp-line ptp-wall" pathLength={1} d="M60 48 H940 V528 H60 Z" />
            <path className="ptp-line ptp-wall" pathLength={1} d="M60 300 V380" />
            {/* equipment footprints */}
            {ITEMS.map((it) => <rect key={it.id} className="ptp-line ptp-foot" pathLength={1} x={it.x * 10} y={it.y * 6} width={it.w * 10} height={it.d * 6} rx={it.tone === "tank" ? 40 : 4} />)}
            {/* header and drops */}
            <path className="ptp-line ptp-pipe" pathLength={1} d={`M170 ${PIPE_Y * 6} H820 V${PIPE_Y * 6} H990`} />
            {DROPS.map((x) => <path key={x} className="ptp-line ptp-pipe" pathLength={1} d={`M${x * 10} ${PIPE_Y * 6} V${(x > 75 ? 15 : x > 60 ? 16 : x > 50 ? 20 : 16) * 6}`} />)}
            {/* design layer (stage 1+) */}
            <g className="ptp-ink">
              <path className="ptp-dim" d="M60 26 H940 M60 20 V32 M940 20 V32" />
              <text x="500" y="16" textAnchor="middle">12,00 m · 6,50 m</text>
              {ITEMS.map((it) => <text key={it.id} className="ptp-tag" x={(it.x + it.w / 2) * 10} y={(it.y + it.d / 2) * 6 + 7} textAnchor="middle">{it.label}</text>)}
              <path className="ptp-flow" d={`M240 ${PIPE_Y * 6} H800`} />
              <g className="ptp-legend"><text x="90" y="420">C · compressores  S · secador</text><text x="90" y="446">F · filtros  R · reservatório</text><text x="90" y="472">Rede principal DN 50 em alumínio → fábrica</text></g>
            </g>
            {/* title block */}
            <g className="ptp-titleblock"><rect x="640" y="440" width="300" height="88" /><path d="M640 470 H940 M790 470 V528" /><text x="652" y="461">TecAr Engenharia</text><text x="652" y="496">Casa de máquinas</text><text x="652" y="516">Folha 01/01</text><text x="802" y="496">Escala 1:50</text><text x="802" y="516">Rev. A</text></g>
          </svg>
          <div className="ptp-solid">
            {ITEMS.map((it) => <Box key={it.id} item={it} />)}
            {DROPS.map((x) => <div key={x} className="ptp-box" data-tone="pipe" style={{ left: `${x - 0.4}%`, top: `${PIPE_Y - 0.7}%`, width: "0.8%", height: "1.4%", "--h": PIPE_H } as CSSProperties}><i className="ptp-face ptp-s" /><i className="ptp-face ptp-e" /></div>)}
            <div className="ptp-overhead" style={{ top: `${PIPE_Y - 0.7}%`, left: "16.6%", width: "82.4%", "--h": PIPE_H } as CSSProperties} />
          </div>
        </div>
      </div>
      <figure className="ptp-photo">
        <img src="/assets/unique/generated/compressor-hero.webp" alt="Casa de máquinas com compressores, reservatório, filtros e rede em alumínio azul" loading="lazy" />
        {PINS.map((p) => <span key={p.label} style={{ left: `${p.x}%`, top: `${p.y}%` }}>{p.label}</span>)}
        <figcaption>Imagem ilustrativa</figcaption>
      </figure>
    </div>

    <div className="ptp-controls">
      <div className="ptp-copy" aria-live="polite"><span>{String(stage + 1).padStart(2, "0")} · {current.title}</span><p>{current.text}</p></div>
      <div className="ptp-ruler">
        <input type="range" min={0} max={3} step={1} value={stage} onChange={(e) => setStage(Number(e.target.value))} aria-label="Etapa do projeto" aria-valuetext={current.title} />
        <ol>{STAGES.map((s, i) => <li key={s.title}><button type="button" aria-pressed={stage === i} onClick={() => setStage(i)}><i>{i + 1}</i>{s.title}</button></li>)}</ol>
      </div>
    </div>
  </div>;
}
