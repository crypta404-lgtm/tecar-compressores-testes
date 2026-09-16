import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, PageHero, SectionHead, ContactBand } from "@/components/site-v2";
import { pageMeta } from "@/lib/page-meta";
export const Route=createFileRoute("/secadores")({head:()=>pageMeta("/secadores","Secadores de Ar | TecAr","Secadores refrigerados e por adsorção para controle de umidade no ar comprimido industrial.","/assets/v2/dryers.jpg"),component:Page});
const dryers=[
  {name:"Secador por adsorção",type:"Ar mais seco / aplicações críticas",image:"/assets/products/dryer-adsorption.webp",text:"Usa material dessecante para atingir ponto de orvalho mais baixo. Indicado quando umidade é crítica ao processo.",source:"https://www.ingersollrand.com/pt-br/products/air-compressors/air-compressor-dryers-and-filters/hl-heatless-desiccant-dryers/"},
  {name:"Secador refrigerado",type:"Uso industrial geral",image:"/assets/products/dryer-refrigerated.png",text:"Resfria o ar, separa condensado e mantém a rede seca em aplicações industriais de uso geral.",source:"https://www.ingersollrand.com/pt-br/products/air-compressors/air-compressor-dryers-and-filters/non-cycling-refrigerated-dryers/"},
] as const;
function Page(){return <PageFrame>
  <PageHero kicker="SECADORES" title="Controle de umidade sem complicação." text="Escolha pelo ponto de orvalho exigido, vazão e condição do processo." image="/assets/v2/dryers.jpg"><Link to="/diagnostico" className="v2-primary">Ir ao diagnóstico</Link></PageHero>
  <section className="v2-section"><div className="v2-container"><SectionHead title="Duas famílias principais"/><div className="v2-product-family-grid v2-product-family-grid-two">{dryers.map(item=><article key={item.name}><div className="v2-product-family-image"><img src={item.image} alt={item.name} loading="lazy"/></div><div className="v2-product-family-copy"><span>{item.type}</span><h3>{item.name}</h3><p>{item.text}</p><a href={item.source} target="_blank" rel="noopener noreferrer">Especificações oficiais</a></div></article>)}</div></div></section>
  <section className="v2-section v2-soft"><div className="v2-container"><SectionHead kicker="ANTES DE DIMENSIONAR" title="Cinco dados bastam para começar."/><div className="v2-data-strip"><span>Vazão</span><span>Pressão</span><span>Temperatura</span><span>Ponto de orvalho</span><span>Ambiente</span></div></div></section>
  <ContactBand/>
</PageFrame>}
