import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowUpRight, Gauge, RadioTower, Truck, Wind, Wrench } from "lucide-react";
import { PageFrame, ContactBand } from "@/components/site-v2";
import { DiagnosticQuestionnaire } from "@/components/diagnostic-questionnaire";
import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { pageMeta } from "@/lib/page-meta";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

export const Route=createFileRoute("/")({
  head:()=>pageMeta("/","TecAr Compressores | Soluções em Ar Comprimido","Compressores, manutenção, locação, engenharia e monitoramento para indústrias em Curitiba e Paranaguá."),
  component:Home
});

const services = [
  {icon:Wrench,title:"Manutenção",text:"Preventiva, corretiva e suporte técnico para manter o ar comprimido disponível.",to:"/manutencao"},
  {icon:Gauge,title:"Engenharia",text:"Projetos de rede, medições e estudos para operar com mais eficiência.",to:"/engenharia"},
  {icon:Truck,title:"Locação",text:"Compressores e equipamentos para demandas temporárias ou contínuas.",to:"/locacao"},
  {icon:RadioTower,title:"TecAr Connect",text:"Monitoramento remoto para acompanhar parâmetros e alarmes.",to:"/tecar-connect"},
] as const;

const solutionPaths = [
  {icon:Activity,title:"Equipamento parado",text:"Organize sintomas e urgência para acelerar o atendimento.",to:"/diagnostico",action:"Iniciar diagnóstico"},
  {icon:Gauge,title:"Reduzir custos",text:"Compare pressão, consumo, vazamentos e regime de operação.",to:"/diagnostico",action:"Abrir calculadoras"},
  {icon:Wind,title:"Escolher equipamento",text:"Explore compressores, secadores, redes e acessórios.",to:"/produtos",action:"Ver produtos"},
  {icon:Truck,title:"Garantir contingência",text:"Avalie locação para paradas, picos de demanda ou obras.",to:"/locacao",action:"Conhecer locação"},
] as const;

function Home(){
  return <PageFrame>
    <section className="v2-clean-hero">
      <img src="/assets/v2/compressors.jpg" alt="Compressores industriais instalados em ambiente técnico"/>
      <div className="v2-clean-hero-shade"/>
      <div className="v2-container v2-clean-hero-content">
        <span className="v2-kicker">TECAR COMPRESSORES · DESDE 1999</span>
        <h1>Ar comprimido com engenharia, resposta e continuidade.</h1>
        <p>Equipamentos, assistência, locação e diagnóstico para decisões industriais mais seguras em Curitiba, Paranaguá e região.</p>
        <div className="v2-clean-hero-actions"><Link to="/diagnostico">Iniciar diagnóstico</Link><a href="https://wa.me/5541996441330?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20TecAr." target="_blank" rel="noopener noreferrer">Falar com a TecAr</a></div>
      </div>
    </section>

    <section className="v2-proof v2-proof-clean">
      <div className="v2-container v2-proof-grid">
        <div><strong>1999</strong><span>presença no mercado</span></div>
        <div><strong>500+</strong><span>clientes atendidos</span></div>
        <div><strong>Ingersoll Rand</strong><span>assistência e revenda autorizada</span></div>
        <div><strong>2</strong><span>unidades no Paraná</span></div>
      </div>
    </section>

    <section className="v3-routefinder" aria-labelledby="routefinder-title">
      <div className="v2-container">
        <div className="v3-routefinder-head"><h2 id="routefinder-title">Comece pela necessidade da operação.</h2><p>Quatro caminhos diretos para chegar à informação certa sem navegar pelo catálogo inteiro.</p></div>
        <div className="v3-routefinder-grid">{solutionPaths.map((item)=><Link key={item.title} to={item.to} className="v3-routefinder-item"><item.icon aria-hidden="true"/><div><h3>{item.title}</h3><p>{item.text}</p><span>{item.action}<ArrowUpRight aria-hidden="true"/></span></div></Link>)}</div>
      </div>
    </section>

    <section className="v2-home-report">
      <div className="v2-container v2-home-report-grid">
        <div>
          <span className="v2-kicker">RELATÓRIO DIRETO</span>
          <h2>Descreva o cenário. A TecAr recebe a triagem pronta.</h2>
          <p>Dez perguntas rápidas sobre equipamento, sintoma, pressão, manutenção e urgência. Quase tudo se responde com um toque. Ao final, a mensagem fica pronta para enviar à equipe pelo WhatsApp.</p>
          <div className="v2-home-report-facts"><span><b>01</b> Respostas objetivas</span><span><b>02</b> Resumo automático</span><span><b>03</b> Envio pelo WhatsApp</span></div>
        </div>
        <DiagnosticQuestionnaire variant="compact"/>
      </div>
    </section>

    <section className="v2-home-story">
      <div className="v2-container v2-home-story-grid">
        <div className="v2-home-story-copy"><span className="v2-kicker">A TECAR</span><h2>Desde 1999, perto de quem precisa de ar comprimido.</h2><p>Com unidades em Curitiba e Paranaguá, a TecAr reúne equipamentos, assistência e engenharia para apoiar a operação industrial.</p><Link to="/empresa" className="v2-home-arrow">Conhecer a empresa <span aria-hidden="true">↗</span></Link></div>
        <div className="v2-home-film"><div className="v2-home-film-frame"><iframe src="https://www.youtube-nocookie.com/embed/3sWKrRIMI7M" title="TecAr Compressores - vídeo institucional" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div><span>01 / CONHEÇA A TECAR</span></div>
      </div>
    </section>

    <section className="v2-home-products">
      <div className="v2-container v2-home-story-grid">
        <div className="v2-home-film"><div className="v2-home-film-frame"><iframe src="https://www.youtube-nocookie.com/embed/vqm1xLn1p-k" title="Ingersoll Rand Série R - Motor HPM, controle variável" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div><span>02 / EQUIPAMENTOS EM AÇÃO</span></div>
        <div className="v2-home-story-copy"><span className="v2-kicker">PRODUTOS</span><h2>O equipamento certo para cada operação.</h2><p>Compressores, secadores, redes de ar e acessórios com orientação técnica para escolher e manter o sistema.</p><Link to="/produtos" className="v2-home-arrow">Explorar produtos <span aria-hidden="true">↗</span></Link></div>
      </div>
    </section>

    <section className="v2-home-services">
      <div className="v2-container">
        <div className="v2-home-services-heading"><span className="v2-kicker">SERVIÇOS</span><h2>Da instalação ao próximo turno.</h2></div>
        <div className="v2-home-services-grid">{services.map((service)=><article key={service.to}><service.icon aria-hidden="true"/><h3>{service.title}</h3><p>{service.text}</p><Link to={service.to}>Ver serviço <ArrowUpRight aria-hidden="true"/></Link></article>)}</div>
      </div>
    </section>

    <section className="v3-scrub-section" aria-labelledby="scrub-title">
      <div className="v2-container v3-scrub-heading"><h2 id="scrub-title">Uma operação conectada do equipamento ao dado.</h2><p>Role para percorrer a jornada visual da TecAr. Com movimento reduzido, a mesma história permanece disponível em formato estático.</p></div>
      <div className="v2-scrub-frame"><ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme}/></div>
    </section>

    <ContactBand title="Sua operação precisa de uma resposta objetiva?" text="Envie o cenário pelo diagnóstico ou fale diretamente com a equipe TecAr."/>
  </PageFrame>
}
