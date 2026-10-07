import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, ContactBand } from "@/components/site-v2";
import { EdSection } from "@/components/editorial";
import { pageMeta } from "@/lib/page-meta";

export const Route=createFileRoute("/servicos")({
  head:()=>pageMeta("/servicos","Serviços | TecAr Compressores","Manutenção, engenharia, locação e monitoramento remoto para sistemas industriais de ar comprimido.","/assets/v2/tecar-service.png"),
  component:Page
});

const items=[
 {to:"/manutencao",title:"Manutenção",image:"/assets/unique/generated/service-maintenance.webp",short:"Manter o equipamento disponível.",detail:"Preventivas, corretivas, diagnóstico técnico e assistência para compressores e periféricos. Ideal quando existe falha, alarme, queda de desempenho ou necessidade de plano preventivo."},
 {to:"/engenharia",title:"Engenharia",image:"/assets/unique/generated/service-engineering.webp",short:"Melhorar o sistema como um todo.",detail:"Medições, eficiência energética, redes, pressão, vazão, perdas e dimensionamento. Para quem quer corrigir gargalos ou planejar expansão com dados."},
 {to:"/locacao",title:"Locação",image:"/assets/unique/generated/service-rental.webp",short:"Ar comprimido quando a operação não pode esperar.",detail:"Soluções temporárias para contingência, obra, pico de demanda ou contrato. A configuração é definida conforme vazão, pressão e criticidade da planta."},
 {to:"/tecar-connect",title:"TecAr Connect",image:"/assets/unique/generated/service-monitoring.webp",short:"Mais visibilidade sobre a operação.",detail:"Monitoramento remoto para acompanhar condição e comportamento do equipamento e facilitar a identificação de tendências antes que virem parada."},
] as const;

function Page(){return <PageFrame>
  <section className="ed-services-hero"><div className="v2-container"><span className="v2-kicker">SERVIÇOS</span><h1>Serviços</h1><p>Escolha a frente que mais se aproxima da sua necessidade. Cada uma tem um resumo aqui e uma página completa para aprofundar.</p></div></section>
  <EdSection tone="paper"><div className="ed-services">{items.map(item=><Link key={item.to} to={item.to}><figure><img src={item.image} alt={"Imagem ilustrativa de "+item.title+", criada por IA"} loading="lazy"/></figure><div><h2>{item.title}</h2><strong>{item.short}</strong><p>{item.detail}</p><span className="ed-link">Conhecer {item.title}</span></div></Link>)}</div></EdSection>
  <ContactBand title="Ainda não sabe qual serviço precisa?" text="Use o Diagnóstico para organizar o cenário antes de falar com a equipe."/>
</PageFrame>}
