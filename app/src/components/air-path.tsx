import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/*
 * "O caminho do ar" — scroll-guided explanation of a complete compressed air
 * system, from generation to monitoring. Purpose: show that TecAr takes care
 * of the whole system, and route each stage to the page that sells it.
 *
 * The schematic is an original line drawing (inline SVG, no external asset).
 * Each pipe segment uses pathLength="1" so CSS can draw it with
 * stroke-dashoffset; the active stage is chosen by an IntersectionObserver
 * watching the step texts (no per-frame scroll handlers).
 */
const steps = [
  {
    id: "geracao",
    index: "01",
    title: "Geração",
    text: "O compressor certo para a demanda real: parafuso, pistão ou centrífugo, dimensionado pela vazão, pressão e perfil de consumo da planta.",
    to: "/compressores",
    link: "Compressores",
  },
  {
    id: "tratamento",
    index: "02",
    title: "Tratamento",
    text: "Secadores e filtros removem umidade, óleo e partículas antes que cheguem à rede, ao equipamento e ao produto final.",
    to: "/secadores",
    link: "Secadores e acessórios",
  },
  {
    id: "distribuicao",
    index: "03",
    title: "Armazenamento e distribuição",
    text: "Reservatório e rede de distribuição projetados para entregar a pressão certa em cada ponto de uso, com menos perda de carga.",
    to: "/linhas-de-ar",
    link: "Linhas de ar",
  },
  {
    id: "monitoramento",
    index: "04",
    title: "Monitoramento",
    text: "Sensores e TecAr Connect acompanham pressão, temperatura, horas e alarmes, para agir antes da parada.",
    to: "/tecar-connect",
    link: "TecAr Connect",
  },
  {
    id: "continuidade",
    index: "05",
    title: "Continuidade",
    text: "Manutenção, engenharia e locação mantêm o sistema inteiro disponível, do projeto à rotina da operação.",
    to: "/servicos",
    link: "Serviços TecAr",
  },
] as const;

const on = (active: number, step: number) => (active >= step ? "true" : "false");

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
      <h2 id="ap-title">Do compressor ao ponto de uso, um sistema inteiro sob a mesma responsabilidade.</h2>
    </div>

    <div className="v2-container ap-grid">
      <div className="ap-visual">
        <svg className="ap-drawing" viewBox="0 0 640 560" role="img" aria-labelledby="ap-drawing-title">
          <title id="ap-drawing-title">Esquema de um sistema de ar comprimido: compressor, secador, reservatório, rede de distribuição com pontos de uso e sensor de monitoramento.</title>
          <defs>
            <pattern id="ap-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" className="ap-gridline" /></pattern>
          </defs>
          <rect width="640" height="560" fill="url(#ap-grid)" className="ap-gridbg" />

          {/* 01 compressor */}
          <g className="ap-node" data-on={on(active, 0)} data-current={active === 0 ? "true" : "false"}>
            <rect x="40" y="96" width="132" height="112" />
            <rect x="52" y="110" width="32" height="22" />
            <path d="M100 116h56M100 128h56M100 140h56M100 152h56M100 164h56M100 176h56M100 188h56" className="ap-detail" />
            <path d="M40 208v10h132v-10" />
            <circle cx="68" cy="160" r="8" className="ap-accent" />
            <text x="40" y="244">COMPRESSOR</text>
          </g>

          {/* 02 dryer + filters */}
          <g className="ap-node" data-on={on(active, 1)} data-current={active === 1 ? "true" : "false"}>
            <rect x="236" y="92" width="26" height="116" rx="13" />
            <rect x="282" y="92" width="26" height="116" rx="13" />
            <rect x="254" y="122" width="36" height="30" className="ap-fill" />
            <path d="M249 208v12M295 208v12" />
            <rect x="330" y="132" width="14" height="40" rx="3" />
            <rect x="354" y="132" width="14" height="40" rx="3" />
            <text x="236" y="244">SECADOR · FILTROS</text>
          </g>

          {/* 03 receiver */}
          <g className="ap-node" data-on={on(active, 2)} data-current={active === 2 ? "true" : "false"}>
            <path d="M452 92c0-22 64-22 64 0v122c0 22-64 22-64 0z" />
            <circle cx="484" cy="132" r="10" />
            <path d="M484 132l6-6" className="ap-accent-line" />
            <path d="M462 236v10M506 236v10" />
            <text x="528" y="196">RESERVATÓRIO</text>
          </g>

          {/* 03 distribution header + points of use */}
          <g className="ap-node" data-on={on(active, 2)} data-current={active === 2 ? "true" : "false"}>
            <path d="M96 470v26M216 470v26M336 470v26M456 470v26" />
            <path d="M88 496h16M208 496h16M328 496h16M448 496h16" />
            <text x="40" y="530">PONTOS DE USO</text>
          </g>

          {/* 04 sensor */}
          <g className="ap-node ap-sensor" data-on={on(active, 3)} data-current={active === 3 ? "true" : "false"}>
            <rect x="548" y="394" width="28" height="22" rx="4" />
            <path d="M562 394v-10" />
            <path d="M548 372a20 20 0 0 1 28 0M541 362a30 30 0 0 1 42 0M534 352a40 40 0 0 1 56 0" className="ap-waves" />
            <text x="478" y="410">CONNECT</text>
          </g>

          {/* pipes: base + flow overlay, grouped by the stage that reaches them */}
          {([
            ["M172 150H236", 0],
            ["M308 150H330M344 150H354M368 150H452", 1],
            ["M484 236V300H600V470H40", 2],
            ["M562 416V470", 3],
          ] as const).map(([d, step]) => <g key={d} className="ap-run" data-on={on(active, step)}>
            <path d={d} pathLength={1} className="ap-pipe" />
            <path d={d} className="ap-flow" />
          </g>)}

          {/* 05 continuity ring */}
          <g className="ap-ring" data-on={on(active, 4)}>
            <rect x="20" y="64" width="600" height="480" pathLength={1} />
          </g>
        </svg>
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
