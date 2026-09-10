import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, SectionHead, ContactBand, VideoEmbed } from "@/components/site-v2";
import { EnergyLossTool, MonitoringDemo, DowntimeTool } from "@/components/client-tools";
import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";
import { pageMeta } from "@/lib/page-meta";

export const Route=createFileRoute("/")({
  head:()=>pageMeta("/","TecAr Compressores | Soluções em Ar Comprimido","Compressores, manutenção, locação, engenharia e monitoramento para indústrias em Curitiba e Paranaguá."),
  component:Home
});

const serviceCards=[
  ["/manutencao","Manutenção","Preventiva, corretiva, assistência multimarcas, diagnóstico e gestão do histórico técnico.","/assets/v2/tecar-service.png"],
  ["/locacao","Locação","Geração de ar por locação emergencial ou contratos de longo prazo, incluindo venda de ar.","/assets/v2/rental.png"],
  ["/engenharia","Engenharia","Auditoria, eficiência energética, redes de ar comprimido, projetos e casa de máquinas.","/assets/v2/tecar-engineering.png"],
  ["/tecar-connect","Monitoramento","Acompanhamento remoto de variáveis críticas, alarmes, consumo e condições operacionais.","/assets/v2/tecar-connect.png"]
] as const;

const productCards=[
  ["/compressores","Compressores","Parafuso, alta pressão, isentos de óleo, geradores de gases e outras configurações.","/assets/v2/compressors.jpg"],
  ["/secadores","Secadores","Tecnologias refrigeradas e por adsorção para controle da qualidade do ar.","/assets/v2/dryers.jpg"],
  ["/linhas-de-ar","Linhas de ar","Projeto e instalação de redes com foco em vazão, velocidade e perda de carga.","/assets/v2/lines.jpg"],
  ["/acessorios","Acessórios","Filtros, drenos, separadores, gerenciadores e controle do sistema.","/assets/v2/accessories.webp"]
] as const;

function Home(){
  return <PageFrame>
    <section className="v2-homehero">
      <div className="v2-container v2-homehero-grid">
        <div className="v2-homehero-copy">
          <span className="v2-kicker">COMPRESSORES & COMPETÊNCIA</span>
          <h1>Soluções completas para o seu sistema de ar comprimido.</h1>
          <p>A TecAr atua desde 1999 com venda de equipamentos, assistência técnica, locação, engenharia e monitoramento para manter a operação industrial confiável e eficiente.</p>
          <div className="v2-hero-actions"><Link to="/contato" className="v2-primary">Solicitar orçamento</Link><Link to="/servicos" className="v2-secondary">Conhecer serviços</Link></div>
        </div>
        <div className="v2-homehero-media"><img src="/assets/v2/compressors.jpg" alt="Sistema industrial de ar comprimido"/></div>
      </div>
    </section>

    <section className="v2-proof">
      <div className="v2-container v2-proof-grid">
        <div><strong>1999</strong><span>presença no mercado</span></div>
        <div><strong>500+</strong><span>clientes atendidos</span></div>
        <div><strong>IR</strong><span>assistência e revenda autorizada Ingersoll Rand</span></div>
        <div><strong>2</strong><span>unidades: Curitiba e Paranaguá</span></div>
      </div>
    </section>

    <section className="v2-section">
      <div className="v2-container"><SectionHead kicker="SERVIÇOS" title="Uma empresa para cuidar do sistema inteiro." text="Do fornecimento do equipamento ao acompanhamento da operação, cada frente possui uma página própria para o cliente pesquisar com calma."/>
        <div className="v2-service-grid">{serviceCards.map(([to,title,text,img])=><Link to={to} className="v2-service-card" key={to}><img src={img} alt=""/><div><h3>{title}</h3><p>{text}</p><span>Ver detalhes</span></div></Link>)}</div>
      </div>
    </section>

    <section className="v2-split-section">
      <div className="v2-container v2-split-grid">
        <div><SectionHead kicker="EFICIÊNCIA" title="O ar que escapa também aparece na conta." text="A TecAr trabalha com diagnóstico e auditoria para localizar desperdícios, gargalos e perdas de carga."/><Link to="/engenharia" className="v2-textlink">Entender engenharia e auditoria</Link></div>
        <EnergyLossTool/>
      </div>
    </section>

    <section className="v2-section v2-soft">
      <div className="v2-container"><SectionHead kicker="MONITORAMENTO" title="Visibilidade antes da emergência." text="O monitoramento remoto ajuda a transformar sinais do equipamento em informação útil para manutenção e tomada de decisão."/>
        <div className="v2-monitor-section"><MonitoringDemo/><div className="v2-monitor-copy"><h3>O que pode ser acompanhado</h3><ul><li>Temperatura e condições operacionais</li><li>Pressão e comportamento de carga</li><li>Ponto de orvalho e qualidade do ar</li><li>Energia e consumo</li><li>Alarmes e histórico</li></ul><Link to="/tecar-connect" className="v2-primary">Conhecer monitoramento</Link></div></div>
      </div>
    </section>

    <section className="v2-section">
      <div className="v2-container"><SectionHead kicker="PRODUTOS" title="Pesquise antes de pedir orçamento." text="As páginas de produto explicam aplicações e critérios de escolha para ajudar o cliente a chegar mais preparado à conversa técnica."/>
        <div className="v2-product-grid">{productCards.map(([to,title,text,img])=><Link to={to} className="v2-product-card" key={to}><div className="v2-product-image"><img src={img} alt=""/></div><h3>{title}</h3><p>{text}</p><span>Explorar categoria</span></Link>)}</div>
      </div>
    </section>

    <section className="v2-risk-section">
      <div className="v2-container v2-risk-grid"><div><SectionHead kicker="RISCO OPERACIONAL" title="Parada de compressor não é só custo de manutenção." text="Quando o ar comprimido participa diretamente da produção, tempo de inatividade pode significar produção não realizada, atraso e horas improdutivas."/><Link to="/manutencao" className="v2-secondary">Ver assistência técnica</Link></div><DowntimeTool/></div>
    </section>

    <section className="v2-section v2-scrub-clean"><div className="v2-container"><SectionHead title="A operação em movimento." text="Uma camada visual discreta mostra a relação entre equipamento, processo e continuidade operacional."/></div><div className="v2-scrub-frame"><ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme}/></div></section>

    <section className="v2-section">
      <div className="v2-container"><SectionHead kicker="TECAR EM VÍDEO" title="Conheça a empresa e as soluções."/>
        <div className="v2-video-grid"><VideoEmbed id="vSjkXQut3jQ" title="Institucional TecAr"/><VideoEmbed id="clxX-mMdwYQ" title="Motores HPM"/></div>
      </div>
    </section>

    <section className="v2-port-preview"><img src="/assets/v2/free-port.jpg" alt="Operação portuária"/><div className="v2-container"><div className="v2-port-card"><span className="v2-kicker">TECAR PORTUÁRIA</span><h2>Presença próxima à operação de Paranaguá.</h2><p>Atendimento para demandas industriais e portuárias com unidade local e suporte técnico.</p><Link to="/empresa" className="v2-primary">Conhecer a TecAr</Link></div></div></section>

    <ContactBand/>
  </PageFrame>
}
