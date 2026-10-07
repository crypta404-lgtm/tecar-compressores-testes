import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

/*
 * Home hero — product stage.
 *
 * Purpose: present the three lines a buyer arrives for (generation, treatment,
 * rental) above the fold, each linking to its page. The h1 is constant for SEO;
 * the slides are secondary content.
 *
 * Behaviour
 * - Autoplay every 7 s, paused on hover, keyboard focus, hidden tab and
 *   prefers-reduced-motion. Manual selection always works.
 * - Slide list is a tablist (arrow keys move between tabs).
 * - All slides are rendered on the server; only the active one is visible,
 *   so the markup is complete without JavaScript.
 */
const slides = [
  {
    id: "compressores",
    word: "GERAÇÃO",
    label: "Compressores",
    text: "Geração de ar para diferentes vazões, pressões e perfis de consumo.",
    model: "Ingersoll Rand E160i",
    to: "/compressores",
    cta: "Ver compressores",
    image: "/assets/corporate/hero-e160.webp",
    width: 1251,
    height: 1136,
    alt: "Compressor de parafuso Ingersoll Rand E160i",
  },
  {
    id: "secadores",
    word: "TRATAMENTO",
    label: "Secadores",
    text: "Controle de umidade por refrigeração ou adsorção, protegendo a rede e o processo.",
    model: "Secador por adsorção Ingersoll Rand",
    to: "/secadores",
    cta: "Ver secadores",
    image: "/assets/corporate/cat-dryer-v2.webp",
    width: 442,
    height: 629,
    alt: "Secador de ar por adsorção Ingersoll Rand",
  },
  {
    id: "locacao",
    word: "LOCAÇÃO",
    label: "Locação",
    text: "Equipamentos para contingência, expansão e demandas temporárias.",
    model: "Compressor de parafuso Ingersoll Rand série R",
    to: "/locacao",
    cta: "Conhecer a locação",
    image: "/assets/corporate/cat-compressor.webp",
    width: 900,
    height: 752,
    alt: "Compressor de parafuso Ingersoll Rand série R",
  },
] as const;

const AUTOPLAY_MS = 7000;

export function EquipmentHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAutoplay(!motion.matches);
    update();
    motion.addEventListener("change", update);
    const visibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => { motion.removeEventListener("change", update); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    if (!autoplay || paused) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % slides.length), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, autoplay, paused]);

  const select = useCallback((index: number, focus = false) => {
    const next = (index + slides.length) % slides.length;
    setActive(next);
    if (focus) tabsRef.current[next]?.focus();
  }, []);

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") { event.preventDefault(); select(index + 1, true); }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") { event.preventDefault(); select(index - 1, true); }
  };

  return <section
    className="cx-hero"
    aria-labelledby="home-title"
    data-autoplay={autoplay && !paused ? "true" : "false"}
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(document.hidden)}
    onFocusCapture={() => setPaused(true)}
    onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false); }}
  >
    <div className="cx-hero-field" aria-hidden="true" />
    <svg className="cx-hero-air" viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M-40 520 C 260 470, 420 600, 720 540 S 1180 380, 1500 430" />
      <path d="M-40 580 C 300 540, 520 660, 800 600 S 1220 470, 1500 520" />
      <path d="M-40 640 C 340 610, 600 720, 880 660 S 1260 560, 1500 610" />
    </svg>

    <div className="v2-container cx-hero-meta">
      <span>TecAr Compressores</span>
      <span>Assistência e revenda autorizada Ingersoll Rand</span>
      <span>Curitiba · Paranaguá · Desde 1999</span>
    </div>

    <div className="cx-hero-stage">
      {slides.map((slide, index) => <div
        key={slide.id}
        id={"cx-slide-" + slide.id}
        className="cx-slide"
        role="tabpanel"
        aria-labelledby={"cx-tab-" + slide.id}
        data-active={index === active ? "true" : "false"}
        aria-hidden={index !== active}
      >
        <p className="cx-slide-word" aria-hidden="true">{slide.word.split("").map((letter, i) => <span key={i} style={{ "--i": i } as CSSProperties}>{letter}</span>)}</p>
        <img className="cx-slide-machine" src={slide.image} alt={slide.alt} width={slide.width} height={slide.height} fetchPriority={index === 0 ? "high" : "low"} loading={index === 0 ? "eager" : "lazy"} />
        <div className="cx-slide-caption">
          <span>{slide.model}</span>
          <p>{slide.text}</p>
          <Link to={slide.to} className="cx-slide-link" tabIndex={index === active ? 0 : -1}>{slide.cta} <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>)}
    </div>

    <div className="v2-container cx-hero-base">
      <div className="cx-hero-copy">
        <h1 id="home-title">Ar comprimido industrial com engenharia, presença e continuidade.</h1>
        <div className="cx-hero-actions">
          <Link to="/produtos" className="cx-button">Explorar equipamentos <ArrowUpRight size={18} aria-hidden="true" /></Link>
          <a href="#atendimento" className="cx-link">Atendimento técnico <ArrowDown size={17} aria-hidden="true" /></a>
        </div>
      </div>

      <div className="cx-hero-tabs" role="tablist" aria-label="Linhas em destaque" aria-orientation="vertical">
        {slides.map((slide, index) => <button
          key={slide.id}
          ref={(node) => { tabsRef.current[index] = node; }}
          id={"cx-tab-" + slide.id}
          type="button"
          role="tab"
          aria-selected={index === active}
          aria-controls={"cx-slide-" + slide.id}
          tabIndex={index === active ? 0 : -1}
          onClick={() => select(index)}
          onKeyDown={(event) => onTabKey(event, index)}
        >
          <span className="cx-tab-index">0{index + 1}</span>
          <span className="cx-tab-label">{slide.label}</span>
          <span className="cx-tab-progress" aria-hidden="true"><i key={index === active ? "run-" + active : "idle"} /></span>
        </button>)}
      </div>
    </div>
  </section>;
}
