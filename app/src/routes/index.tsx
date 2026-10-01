import { EquipmentHero } from "@/components/equipment-hero";
import { AirPath } from "@/components/air-path";
import { CountUp } from "@/components/motion";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageFrame, ContactBand, VideoEmbed } from "@/components/site-v2";
import { DiagnosticQuestionnaire } from "@/components/diagnostic-questionnaire";
import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { pageMeta } from "@/lib/page-meta";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

export const Route = createFileRoute("/")({
  head: () => pageMeta("/", "TecAr Compressores | Engenharia para a sua operação", "Compressores, manutenção, locação, engenharia e monitoramento para indústrias em Curitiba e Paranaguá.", "/assets/corporate/og-tecar.jpg"),
  component: Home,
});

const services = [
  { to: "/manutencao", number: "01", title: "Manutenção", text: "Assistência preventiva e corretiva. Cuidado contínuo com a disponibilidade do seu sistema.", image: "/assets/editorial/service.webp" },
  { to: "/engenharia", number: "02", title: "Engenharia", text: "Projetos, medições e estudos orientados à eficiência da sua operação.", image: "/assets/editorial/engineering.webp" },
  { to: "/locacao", number: "03", title: "Locação", text: "Equipamentos para contingência, expansão e demandas temporárias.", image: "/assets/editorial/rental.webp" },
  { to: "/tecar-connect", number: "04", title: "TecAr Connect", text: "Monitoramento remoto de parâmetros e alarmes. Informação para agir.", image: "/assets/unique/generated/service-monitoring.webp" },
] as const;

const yearsActive = new Date().getFullYear() - 1999;

function ServiceShowcase() {
  const [active, setActive] = useState(0);
  return <div className="cx-services">
    <div className="cx-services-media" aria-hidden="true">
      {services.map((service, index) => <img key={service.to} src={service.image} alt="" loading="lazy" width="1200" height="1200" data-active={index === active ? "true" : "false"} />)}
      <span className="cx-services-count">{services[active].number} / 0{services.length}</span>
    </div>
    <ul className="cx-services-list">
      {services.map((service, index) => <li key={service.to}>
        <Link to={service.to} data-active={index === active ? "true" : "false"} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)}>
          <span className="cx-services-number">{service.number}</span>
          <span className="cx-services-body"><h3>{service.title}</h3><p>{service.text}</p></span>
          <img className="cx-services-thumb" src={service.image} alt="" loading="lazy" width="1200" height="1200" />
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </li>)}
    </ul>
  </div>;
}

function Home() {
  return <PageFrame>
    <EquipmentHero />

    <section className="cx-facts" aria-label="A TecAr em números">
      <div className="v2-container cx-facts-grid">
        <div><strong><CountUp value={yearsActive} /> anos</strong><span>Ao lado da indústria, desde 1999</span></div>
        <div><strong><CountUp value={500} suffix="+" /></strong><span>Clientes atendidos</span></div>
        <div><strong><CountUp value={2} /> unidades</strong><span>Curitiba e Paranaguá</span></div>
        <div><strong>Ingersoll Rand</strong><span>Assistência e revenda autorizada</span></div>
      </div>
    </section>

    <AirPath />

    <section className="tc-section tc-diagnostic" id="atendimento" aria-labelledby="diagnostic-title">
      <div className="v2-container tc-diagnostic-grid">
        <div className="tc-diagnostic-copy">
          <span className="tc-eyebrow">Atendimento técnico</span>
          <h2 id="diagnostic-title">Toda resposta começa com uma boa análise.</h2>
          <p>Compartilhe o cenário da sua operação. Nossa equipe recebe as informações essenciais para orientar o próximo passo.</p>
          <ol className="cx-diagnostic-steps">
            <li><b>1</b><span>Você descreve a necessidade em poucos passos.</span></li>
            <li><b>2</b><span>O resumo chega à equipe técnica pelo WhatsApp.</span></li>
            <li><b>3</b><span>A TecAr orienta o atendimento adequado.</span></li>
          </ol>
          <Link to="/diagnostico" className="tc-text-link">Diagnósticos e calculadoras <ArrowUpRight aria-hidden="true" /></Link>
        </div>
        <DiagnosticQuestionnaire variant="compact" />
      </div>
    </section>

    <section className="cx-company" id="a-tecar" aria-labelledby="company-title">
      <figure className="cx-company-photo">
        <img src="/assets/v2/compressors.jpg" alt="Sala de compressores Ingersoll Rand com rede de distribuição de ar" loading="lazy" width="1179" height="885" />
      </figure>
      <div className="v2-container cx-company-inner">
        <div className="cx-company-card">
          <span className="tc-eyebrow">A TecAr</span>
          <h2 id="company-title">Engenharia que acompanha a sua operação.</h2>
          <p>O ar comprimido faz parte do que move a sua empresa. A TecAr reúne equipamentos, assistência e engenharia para cuidar desse sistema por inteiro.</p>
          <p>Desde 1999, com presença em Curitiba e Paranaguá e uma relação próxima com quem está à frente da operação.</p>
          <Link to="/empresa" className="tc-text-link">Conheça a TecAr <ArrowUpRight aria-hidden="true" /></Link>
        </div>
      </div>
    </section>

    <section className="tc-section cx-services-section" aria-labelledby="services-title">
      <div className="v2-container">
        <div className="tc-section-heading"><div><span className="tc-eyebrow">Serviços para sua operação</span><h2 id="services-title">A sua operação. Nossa atenção a cada detalhe.</h2></div><Link to="/servicos" className="tc-text-link">Todas as soluções <ArrowUpRight aria-hidden="true" /></Link></div>
        <ServiceShowcase />
      </div>
    </section>

    <section className="tc-field" aria-label="Soluções para indústria e operações portuárias">
      <img src="/assets/v2/free-port.jpg" alt="Infraestrutura e atividade portuária" loading="lazy" width="1800" height="1200" />
      <div className="tc-field-copy"><span className="tc-eyebrow">Indústria & operações portuárias</span><h2>Onde a operação<br />não pode parar.</h2><Link to="/locacao" className="tc-text-link">Conheça nossas soluções em locação <ArrowUpRight aria-hidden="true" /></Link></div>
    </section>

    <section className="tc-motion" aria-labelledby="motion-title">
      <div className="v2-container tc-motion-heading"><span className="tc-eyebrow">Tecnologia integrada</span><h2 id="motion-title">Do equipamento ao dado.</h2><p>Tecnologia, assistência e monitoramento conectados à sua indústria.</p><Link to="/tecar-connect" className="tc-text-link">TecAr Connect <ArrowUpRight aria-hidden="true" /></Link></div>
      <div className="v2-scrub-frame"><ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme} /></div>
    </section>

    <section className="tc-section tc-films" aria-labelledby="films-title">
      <div className="v2-container"><div className="tc-section-heading"><h2 id="films-title">Mais perto da TecAr.</h2><span className="tc-caption">Pessoas, tecnologia e indústria.</span></div><div className="tc-films-grid"><VideoEmbed id="3sWKrRIMI7M" title="Conheça a TecAr" /><VideoEmbed id="vqm1xLn1p-k" title="Ingersoll Rand: tecnologia em operação" /></div></div>
    </section>
    <ContactBand title="Vamos cuidar da sua operação." text="Uma conversa com quem entende de ar comprimido." />
  </PageFrame>;
}
