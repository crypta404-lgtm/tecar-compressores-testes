import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, SectionHead, ContactBand } from "@/components/site-v2";
import { DiagnosticQuestionnaire } from "@/components/diagnostic-questionnaire";
import { pageMeta } from "@/lib/page-meta";

export const Route=createFileRoute("/")({
  head:()=>pageMeta("/","TecAr Compressores | Soluções em Ar Comprimido","Compressores, manutenção, locação, engenharia e monitoramento para indústrias em Curitiba e Paranaguá."),
  component:Home
});

const capabilities=[
  ["Equipamentos","Compressores, secadores, linhas e acessórios dimensionados para a necessidade real da planta."],
  ["Assistência técnica","Manutenção preventiva e corretiva, atendimento multimarcas e gestão do histórico técnico."],
  ["Engenharia","Auditorias, eficiência energética, projetos de rede e organização da casa de máquinas."],
  ["Continuidade","Locação emergencial, contratos de longo prazo e monitoramento remoto da operação."]
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

    <section className="v2-home-report">
      <div className="v2-container v2-home-report-grid">
        <div>
          <span className="v2-kicker">RELATÓRIO DIRETO</span>
          <h2>Descreva o cenário. A TecAr recebe a triagem pronta.</h2>
          <p>O formulário organiza condição do equipamento, pressão, urgência e impacto na produção. Ao final, o relatório segue pelo WhatsApp para a equipe técnica.</p>
          <div className="v2-home-report-facts"><span><b>01</b> Respostas objetivas</span><span><b>02</b> Resumo automático</span><span><b>03</b> Envio pelo WhatsApp</span></div>
        </div>
        <DiagnosticQuestionnaire variant="compact"/>
      </div>
    </section>

    <section className="v2-section v2-home-capabilities">
      <div className="v2-container">
        <SectionHead kicker="SISTEMA COMPLETO" title="Uma equipe para cuidar do ar comprimido de ponta a ponta." text="A TecAr combina fornecimento, serviço e engenharia em uma visão única da operação."/>
        <div className="v2-home-capability-grid">{capabilities.map(([title,text],index)=><article key={title}><span>0{index+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        <Link to="/servicos" className="v2-home-inline-link">Conhecer todas as soluções</Link>
      </div>
    </section>

    <ContactBand title="Sua operação precisa de uma resposta objetiva?" text="Envie o cenário pelo diagnóstico ou fale diretamente com a equipe TecAr."/>
  </PageFrame>
}
