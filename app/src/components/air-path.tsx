import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/*
 * "O caminho do ar" — scroll-guided explanation of a complete compressed air
 * system, from the atmosphere to monitoring. Purpose: show that TecAr takes
 * care of the whole system, and route each stage to the page that sells it.
 *
 * The schematic is an original line drawing (inline SVG, no external asset).
 * Colour carries meaning: red flow is untreated air, blue flow is treated air
 * (only after the dryer and filters — the compressor does not clean the air);
 * other red marks (ring, sensor waves, gauge, dryer core) are not air.
 * Each pipe segment uses pathLength="1" so CSS can draw it with
 * stroke-dashoffset; the active stage is chosen by an IntersectionObserver
 * watching the step texts (no per-frame scroll handlers).
 */
const steps = [
  {
    id: "admissao",
    index: "01",
    title: "Admissão",
    text: "O ar atmosférico entra no sistema carregado de umidade, poeira e partículas. O filtro de admissão do compressor retém a sujeira mais grossa.",
    to: "/compressores",
    link: "Compressores",
  },
  {
    id: "compressao",
    index: "02",
    title: "Compressão",
    text: "Dentro do compressor, os rotores comprimem o ar, o separador retira o óleo arrastado e o resfriador posterior baixa a temperatura, condensando parte da água.",
    to: "/compressores",
    link: "Compressores",
  },
  {
    id: "tratamento",
    index: "03",
    title: "Tratamento",
    text: "Secadores e filtros removem a umidade, o óleo e as partículas restantes. Daqui em diante, o ar segue limpo e seco para a rede, o equipamento e o produto final.",
    to: "/secadores",
    link: "Secadores e acessórios",
  },
  {
    id: "distribuicao",
    index: "04",
    title: "Armazenamento e distribuição",
    text: "Reservatório e rede de distribuição projetados para entregar a pressão certa em cada ponto de uso, com menos perda de carga.",
    to: "/linhas-de-ar",
    link: "Linhas de ar",
  },
  {
    id: "monitoramento",
    index: "05",
    title: "Monitoramento",
    text: "Sensores e TecAr Connect acompanham pressão, temperatura, horas e alarmes, para agir antes da parada.",
    to: "/tecar-connect",
    link: "TecAr Connect",
  },
  {
    id: "continuidade",
    index: "06",
    title: "Continuidade",
    text: "Manutenção, engenharia e locação mantêm o sistema inteiro disponível, do projeto à rotina da operação.",
    to: "/servicos",
    link: "Serviços TecAr",
  },
] as const;

/* Drawing stages, in the same order as the steps above. */
const STAGE = { intake: 0, compression: 1, treatment: 2, distribution: 3, monitoring: 4, continuity: 5 } as const;

type Air = "raw" | "clean";

/*
 * Pipe runs: [path, stage, air, inner]. "raw" = untreated air (red),
 * "clean" = treated air (blue). The intake starts far outside the viewBox so
 * it enters from beyond the screen edge; the section clips it horizontally.
 * "inner" runs are the thinner flow through the compressor cutaway.
 */
const runs: ReadonlyArray<readonly [string, number, Air, boolean]> = [
  ["M-1000 110H48", STAGE.intake, "raw", false],
  ["M48 110H56", STAGE.intake, "raw", true],
  ["M76 110H87M139 110H150M160 160V170H92V196l8-12 8 12 8-12 8 12 8-12 8 12 8-12 8 12 8-12 8 12H200", STAGE.compression, "raw", true],
  ["M200 196H218V150H236", STAGE.compression, "raw", false],
  ["M308 150H330M344 150H354", STAGE.treatment, "raw", false],
  ["M368 150H452", STAGE.treatment, "clean", false],
  ["M484 236V300H600V470H40", STAGE.distribution, "clean", false],
  ["M562 416V470", STAGE.monitoring, "clean", false],
];

/* Cutaway markers: [number, x, y, stage, legend label]. */
const markers = [
  ["1", 66, 88, STAGE.intake, "Filtro de admissão"],
  ["2", 113, 134, STAGE.compression, "Rotores · compressão"],
  ["3", 186, 100, STAGE.compression, "Separador de óleo"],
  ["4", 80, 196, STAGE.compression, "Resfriador posterior"],
] as const;

const on = (active: number, step: number) => (active >= step ? "true" : "false");
const current = (active: number, step: number) => (active === step ? "true" : "false");

export function AirPath() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") { setActive(steps.length - 1); return; }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const index = Number((entry.target as HTMLElement).dataset.index);
        if (!Number.isNaN(index)) setActive(index);
      }
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    stepRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return <section className="ap" aria-labelledby="ap-title" data-step={active}>
    <div className="v2-container ap-head">
      <span className="tc-eyebrow">O caminho do ar</span>
      <h2 id="ap-title">Do ar atmosférico ao ponto de uso, um sistema inteiro sob a mesma responsabilidade.</h2>
    </div>

    <div className="v2-container ap-grid">
      <div className="ap-visual">
        <svg className="ap-drawing" viewBox="0 0 640 560" role="img" aria-labelledby="ap-drawing-title">
          <title id="ap-drawing-title">Esquema de um sistema de ar comprimido. O ar atmosférico, ainda sem tratamento, entra pelo filtro de admissão do compressor, é comprimido pelos rotores, passa pelo separador de óleo e pelo resfriador posterior e segue ao secador e aos filtros. Só depois deles passa a ser ar tratado, limpo e seco, e vai ao reservatório, à rede de distribuição, aos pontos de uso e ao sensor de monitoramento.</title>
          <defs>
            <pattern id="ap-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" className="ap-gridline" /></pattern>
          </defs>
          <rect width="640" height="560" fill="url(#ap-grid)" className="ap-gridbg" />

          {/* 01 intake: atmospheric air, compressor shell and hatched intake filter */}
          <g className="ap-node" data-on={on(active, STAGE.intake)} data-current={current(active, STAGE.intake)}>
            <text x="48" y="58" className="ap-raw-label">AR ATMOSFÉRICO · SEM TRATAMENTO</text>
            <rect x="48" y="76" width="152" height="140" />
            <rect x="56" y="98" width="20" height="24" />
            <path d="M56 106l8-8M56 114l16-16M56 122l20-20M64 122l12-12M72 122l4-4" className="ap-detail" />
            <path d="M48 216v8h152v-8" />
            <text x="48" y="244">COMPRESSOR</text>
          </g>

          {/* 02 compression: cutaway with counter-rotating rotors, oil separator and aftercooler (the zigzag run) */}
          <g className="ap-node" data-on={on(active, STAGE.compression)} data-current={current(active, STAGE.compression)}>
            <g className="ap-rotor">
              <circle cx="100" cy="110" r="13" />
              <path d="M100 97v26M88.7 103.5l22.6 13M88.7 116.5l22.6-13" className="ap-detail" />
            </g>
            <g className="ap-rotor ap-rotor--reverse">
              <circle cx="126" cy="110" r="13" />
              <path d="M126 97v26M114.7 103.5l22.6 13M114.7 116.5l22.6-13" className="ap-detail" />
            </g>
            <rect x="150" y="92" width="20" height="68" rx="10" />
          </g>

          {markers.map(([n, x, y, step]) => <g key={n} className="ap-node ap-marker" data-on={on(active, step)}>
            <circle cx={x} cy={y} r="6.5" />
            <text x={x} y={y + 3}>{n}</text>
          </g>)}
          <g className="ap-node ap-key" data-on={on(active, STAGE.intake)}>
            {markers.map(([n, , , , label], index) => <text key={n} x="48" y={264 + index * 13}>{n} {label.toUpperCase()}</text>)}
          </g>

          {/* 03 treatment: dryer + filters, condensate leaving the drains */}
          <g className="ap-node" data-on={on(active, STAGE.treatment)} data-current={current(active, STAGE.treatment)}>
            <rect x="236" y="92" width="26" height="116" rx="13" />
            <rect x="282" y="92" width="26" height="116" rx="13" />
            <rect x="254" y="122" width="36" height="30" className="ap-fill" />
            <path d="M249 208v12M295 208v12" />
            <circle cx="249" cy="226" r="2.2" className="ap-drop" />
            <circle cx="295" cy="226" r="2.2" className="ap-drop ap-drop--late" />
            <rect x="330" y="132" width="14" height="40" rx="3" />
            <rect x="354" y="132" width="14" height="40" rx="3" />
            <text x="236" y="252">SECADOR · FILTROS</text>
          </g>

          {/* 04 receiver */}
          <g className="ap-node" data-on={on(active, STAGE.distribution)} data-current={current(active, STAGE.distribution)}>
            <path d="M452 92c0-22 64-22 64 0v122c0 22-64 22-64 0z" />
            <circle cx="484" cy="132" r="10" />
            <path d="M484 132l6-6" className="ap-accent-line" />
            <path d="M462 236v10M506 236v10" />
            <text x="528" y="196">RESERVATÓRIO</text>
          </g>

          {/* 04 distribution header + points of use */}
          <g className="ap-node" data-on={on(active, STAGE.distribution)} data-current={current(active, STAGE.distribution)}>
            <path d="M96 470v26M216 470v26M336 470v26M456 470v26" />
            <path d="M88 496h16M208 496h16M328 496h16M448 496h16" />
            <text x="40" y="530">PONTOS DE USO</text>
          </g>

          {/* 05 sensor */}
          <g className="ap-node ap-sensor" data-on={on(active, STAGE.monitoring)} data-current={current(active, STAGE.monitoring)}>
            <rect x="548" y="394" width="28" height="22" rx="4" />
            <path d="M562 394v-10" />
            <path d="M548 372a20 20 0 0 1 28 0M541 362a30 30 0 0 1 42 0M534 352a40 40 0 0 1 56 0" className="ap-waves" />
            <text x="478" y="410">CONNECT</text>
          </g>

          {/* pipes: base + flow overlay, grouped by the stage that reaches them */}
          {runs.map(([d, step, air, inner]) => <g key={d} className={inner ? "ap-run ap-run--inner" : "ap-run"} data-on={on(active, step)} data-air={air}>
            <path d={d} pathLength={1} className="ap-pipe" />
            <path d={d} className="ap-flow" />
          </g>)}

          {/* 06 continuity ring */}
          <g className="ap-ring" data-on={on(active, STAGE.continuity)}>
            <rect x="20" y="64" width="600" height="480" pathLength={1} />
          </g>
        </svg>
        <ul className="ap-legend">
          <li data-air="raw">Ar sem tratamento: umidade, poeira e óleo</li>
          <li data-air="clean">Ar tratado: limpo e seco</li>
        </ul>
      </div>

      <ol className="ap-steps">
        {steps.map((step, index) => <li
          key={step.id}
          ref={(node) => { stepRefs.current[index] = node; }}
          data-index={index}
          data-current={active === index ? "true" : "false"}
        >
          <span className="ap-step-index">{step.index}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
          <Link to={step.to} className="tc-text-link">{step.link} <ArrowUpRight aria-hidden="true" /></Link>
        </li>)}
      </ol>
    </div>
  </section>;
}
