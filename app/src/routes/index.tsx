import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { PageFrame, ContactBand, VideoEmbed } from "@/components/site-v2";
import { DiagnosticQuestionnaire } from "@/components/diagnostic-questionnaire";
import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { pageMeta } from "@/lib/page-meta";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

export const Route = createFileRoute("/")({
  head: () => pageMeta("/", "TecAr Compressores | Engenharia para a sua operação", "Compressores, manutenção, locação, engenharia e monitoramento para indústrias em Curitiba e Paranaguá."),
  component: Home,
});

const products = [
  { to: "/compressores", name: "Compressores", caption: "Geração de ar", image: "/assets/unique/official/rental-rseries.webp", alt: "Compressor de parafuso Ingersoll Rand série R" },
  { to: "/secadores", name: "Secadores", caption: "Tratamento do ar", image: "/assets/products/dryer-refrigerated.png", alt: "Secador refrigerado Ingersoll Rand" },
  { to: "/linhas-de-ar", name: "Linhas de ar", caption: "Distribuição eficiente", image: "/assets/unique/generated/home-distribution.webp", alt: "Imagem ilustrativa de um ponto de distribuição de ar, criada por IA", photo: true },
] as const;

const services = [
  { to: "/manutencao", number: "01", title: "Manutenção", text: "Assistência preventiva e corretiva. Cuidado contínuo com a disponibilidade do seu sistema." },
  { to: "/engenharia", number: "02", title: "Engenharia", text: "Projetos, medições e estudos orientados à eficiência da sua operação." },
  { to: "/locacao", number: "03", title: "Locação", text: "Equipamentos para contingência, expansão e demandas temporárias." },
  { to: "/tecar-connect", number: "04", title: "TecAr Connect", text: "Monitoramento remoto de parâmetros e alarmes. Informação para agir." },
] as const;

function Home() {
  return <PageFrame>
    <section className="tc-hero" aria-labelledby="home-title">
      <img className="tc-hero-image" src="/assets/v2/compressors.jpg" alt="Compressores Ingersoll Rand e rede de ar em instalação industrial" fetchPriority="high" width="1179" height="885" />
      <div className="tc-hero-overlay" />
      <div className="tc-hero-content">
        <div className="tc-hero-top">
          <p>Precisão para<br />mover a indústria.</p>
          <Link to="/produtos" className="tc-hero-explore">Explore nossas soluções <ArrowUpRight aria-hidden="true" /></Link>
        </div>
        <div className="tc-hero-bottom">
          <h1 id="home-title">TecAr<span>.</span><span className="tc-sr-only"> Compressores</span></h1>
          <div><span>Ar comprimido industrial</span><span>Engenharia. Presença. Continuidade.</span></div>
          <a href="#atendimento" className="tc-round-link" aria-label="Ir para atendimento técnico"><ArrowDown aria-hidden="true" /></a>
        </div>
      </div>
    </section>

    <section className="tc-section tc-diagnostic" id="atendimento" aria-labelledby="diagnostic-title">
      <div className="v2-container tc-diagnostic-grid">
        <div className="tc-diagnostic-copy"><span className="tc-eyebrow">Atendimento técnico</span><h2 id="diagnostic-title">Toda resposta<br />começa com<br />uma boa análise.</h2><p>Compartilhe o cenário da sua operação. Nossa equipe recebe as informações essenciais para orientar o próximo passo.</p><Link to="/diagnostico" className="tc-text-link">Diagnósticos e calculadoras <ArrowUpRight aria-hidden="true" /></Link><img src="/assets/unique/generated/home-analysis.webp" alt="Imagem ilustrativa de instrumentos de análise técnica, criada por IA" loading="lazy" width="1200" height="1200" /></div>
        <DiagnosticQuestionnaire variant="compact" />
      </div>
    </section>

    <section className="tc-proof" aria-label="A TecAr em números">
      <div className="v2-container tc-proof-grid">
        <div><strong>Desde 1999</strong><span>Ao lado da indústria</span></div>
        <div><strong>500+</strong><span>Clientes atendidos</span></div>
        <div><strong>02 unidades</strong><span>Curitiba e Paranaguá</span></div>
        <div className="tc-proof-partner"><strong>Ingersoll Rand</strong><span>Assistência e revenda autorizada</span></div>
      </div>
    </section>

    <section className="tc-section tc-intro" id="a-tecar">
      <div className="v2-container tc-intro-grid">
        <div className="tc-intro-aside">

          <div className="tc-intro-images">
            <img src="/assets/editorial/engineering.webp" alt="Planejamento de engenharia para sistemas de ar comprimido" loading="lazy" width="1200" height="1200" />
            <img src="/assets/editorial/rental.webp" alt="Atendimento técnico em equipamento industrial" loading="lazy" width="1200" height="1200" />
          </div>

        </div>
        <div className="tc-intro-copy">
          <h2>Engenharia que<br />acompanha a sua<br /><span>operação.</span></h2>
          <p>O ar comprimido faz parte do que move a sua empresa. A TecAr reúne equipamentos, assistência e engenharia para cuidar desse sistema por inteiro.</p>
          <p>Desde 1999, com presença em Curitiba e Paranaguá e uma relação próxima com quem está à frente da operação.</p>
          <Link to="/empresa" className="tc-text-link">Conheça a TecAr <ArrowUpRight aria-hidden="true" /></Link>
        </div>
      </div>
    </section>

    <section className="tc-section tc-catalog" aria-labelledby="catalog-title">
      <div className="v2-container">

        <div className="tc-section-heading"><h2 id="catalog-title">Precisão em cada escolha.</h2><Link to="/produtos" className="tc-text-link">Catálogo completo <ArrowUpRight aria-hidden="true" /></Link></div>
        <div className="tc-product-grid">{products.map((product) => <Link key={product.to} to={product.to} className="tc-product">
          <div className={"tc-product-image" + ("photo" in product ? " tc-product-image-photo" : "")}><img src={product.image} alt={product.alt} loading="lazy" width="800" height="800" /></div>
          <div className="tc-product-meta"><div><span>{product.caption}</span><h3>{product.name}</h3></div><ArrowUpRight aria-hidden="true" /></div>
        </Link>)}</div>
        <div className="tc-catalog-more"><Link to="/acessorios">Acessórios <ArrowUpRight aria-hidden="true" /></Link><Link to="/safety-air">Safety Air <ArrowUpRight aria-hidden="true" /></Link></div>
      </div>
    </section>

    <section className="tc-section tc-services" aria-labelledby="services-title">
      <div className="v2-container">
        <div className="tc-section-top"><span className="tc-eyebrow">Serviços para sua operação</span><Link to="/servicos" className="tc-text-link">Todas as soluções <ArrowUpRight aria-hidden="true" /></Link></div>
        <div className="tc-services-layout">
          <figure className="tc-service-photo"><img src="/assets/editorial/service.webp" alt="Profissional de manutenção de compressores industriais" loading="lazy" width="1200" height="1200" /><figcaption>Presença técnica. Do projeto à manutenção.</figcaption></figure>
          <div className="tc-services-copy"><h2 id="services-title">A sua operação.<br />Nossa atenção<br />a cada detalhe.</h2>
            <div className="tc-service-list">{services.map((service) => <Link key={service.to} to={service.to}><span className="tc-service-number">{service.number}</span><div><h3>{service.title}</h3><p>{service.text}</p></div><ArrowUpRight aria-hidden="true" /></Link>)}</div>
          </div>
        </div>
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
