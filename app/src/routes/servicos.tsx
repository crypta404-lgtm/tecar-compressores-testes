import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, ContactBand } from "@/components/site-v2";
import { pageMeta } from "@/lib/page-meta";

export const Route=createFileRoute("/servicos")({
  head:()=>pageMeta("/servicos","Serviços | TecAr Compressores","Manutenção, engenharia, locação e monitoramento remoto para sistemas industriais de ar comprimido.","/assets/v2/tecar-service.png"),
  component:Page
});

const items=[
 {to:"/manutencao",title:"Manutenção",image:"/assets/v2/tecar-service.png",short:"Manter o equipamento disponível.",detail:"Preventivas, corretivas, diagnóstico técnico e assistência para compressores e periféricos. Ideal quando existe falha, alarme, queda de desempenho ou necessidade de plano preventivo."},
 {to:"/engenharia",title:"Engenharia",image:"/assets/v2/tecar-engineering.png",short:"Melhorar o sistema como um todo.",detail:"Medições, eficiência energética, redes, pressão, vazão, perdas e dimensionamento. Para quem quer corrigir gargalos ou planejar expansão com dados."},
 {to:"/locacao",title:"Locação",image:"/assets/v2/rental.png",short:"Ar comprimido quando a operação não pode esperar.",detail:"Soluções temporárias para contingência, obra, pico de demanda ou contrato. A configuração é definida conforme vazão, pressão e criticidade da planta."},
 {to:"/tecar-connect",title:"TecAr Connect",image:"/assets/v2/tecar-connect.png",short:"Mais visibilidade sobre a operação.",detail:"Monitoramento remoto para acompanhar condição e comportamento do equipamento e facilitar a identificação de tendências antes que virem parada."},
] as const;

function Page(){return <PageFrame>
  <section className="v2-services-hero"><div className="v2-container"><span>SERVIÇOS</span><h1>Serviços</h1><p>Escolha a frente que mais se aproxima da sua necessidade. Clique para abrir um resumo; a página completa continua disponível quando você quiser aprofundar.</p></div></section>
  <section className="v2-section"><div className="v2-container"><div className="v2-service-visual-grid">{items.map(item=><details key={item.to} className="v2-service-visual-card"><summary><div className="v2-service-visual-photo"><img src={item.image} alt={item.title} loading="lazy"/></div><div className="v2-service-visual-title"><span>SERVIÇO</span><h2>{item.title}</h2><p>{item.short}</p><b>Ver resumo +</b></div></summary><div className="v2-service-visual-detail"><p>{item.detail}</p><Link to={item.to}>Abrir página de {item.title} →</Link></div></details>)}</div></div></section>
  <ContactBand title="Ainda não sabe qual serviço precisa?" text="Use o Diagnóstico para organizar o cenário antes de falar com a equipe."/>
</PageFrame>}
