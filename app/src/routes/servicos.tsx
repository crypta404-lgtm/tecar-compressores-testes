import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, PageHero, SectionHead, ContactBand } from "@/components/site-v2";
import { pageMeta } from "@/lib/page-meta";
export const Route=createFileRoute("/servicos")({head:()=>pageMeta("/servicos","Serviços | TecAr Compressores","Manutenção, engenharia, locação e monitoramento remoto para sistemas industriais de ar comprimido."),component:Page});
const items=[
 {to:"/manutencao",title:"Manutenção",short:"Preventiva, corretiva e assistência técnica.",detail:"Para falhas, planos preventivos, revisões e suporte técnico de compressores e periféricos."},
 {to:"/engenharia",title:"Engenharia",short:"Medição, eficiência, redes e dimensionamento.",detail:"Para reduzir perdas, revisar pressão e vazão, projetar redes ou dimensionar a casa de máquinas."},
 {to:"/locacao",title:"Locação",short:"Contingência e geração temporária de ar.",detail:"Para parada inesperada, obra, pico de demanda ou contratos de fornecimento temporário."},
 {to:"/tecar-connect",title:"TecAr Connect",short:"Monitoramento remoto da operação.",detail:"Para acompanhar comportamento do equipamento, tendências e condição operacional com mais visibilidade."},
] as const;
function Page(){return <PageFrame><PageHero kicker="SERVIÇOS" title="Escolha a necessidade. A TecAr cuida do restante." text="Quatro frentes para manter, melhorar ou sustentar sua operação." image="/assets/v2/tecar-service.png"><Link to="/diagnostico" className="v2-primary">Não sabe por onde começar?</Link></PageHero><section className="v2-section"><div className="v2-container"><SectionHead title="Serviços"/><div className="v2-service-accordion">{items.map(item=><details key={item.to}><summary><div><h3>{item.title}</h3><p>{item.short}</p></div><span>+</span></summary><div className="v2-service-accordion-body"><p>{item.detail}</p><Link to={item.to}>Ver página completa →</Link></div></details>)}</div></div></section><ContactBand/></PageFrame>}
