import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, PageHero, ContactBand } from "@/components/site-v2";
import { ProductExplorer, type ProductGroup } from "@/components/product-explorer";
import { pageMeta } from "@/lib/page-meta";

export const Route=createFileRoute("/secadores")({head:()=>pageMeta("/secadores","Secadores de Ar | TecAr","Secadores refrigerados e por adsorção com fotos e consulta objetiva.","/assets/products/dryer-refrigerated.png"),component:Page});

const groups:ProductGroup[]=[{
  id:"dryers",label:"Tipos de secador",intro:"Escolha pela necessidade de secagem. Clique no equipamento para abrir o resumo.",items:[
    {name:"Secador refrigerado",tag:"Uso industrial geral",image:"/assets/corporate/dryer-refrigerated.webp",summary:"Resfria o ar comprimido e remove o condensado. É a escolha mais comum para redes industriais que precisam controlar umidade sem ponto de orvalho extremamente baixo.",facts:["Refrigeração","Baixa queda de pressão","Uso industrial"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/air-compressor-dryers-and-filters/non-cycling-refrigerated-dryers/"},
    {name:"Secador por adsorção",tag:"Ar mais seco",image:"/assets/corporate/dryer-adsorption.webp",summary:"Usa dessecante em torres para remover umidade e atingir ponto de orvalho mais baixo em processos críticos.",facts:["Dessecante","Ponto de orvalho baixo","Processos críticos"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/air-compressor-dryers-and-filters/hl-heatless-desiccant-dryers/"}
  ]
}];

function Page(){return <PageFrame>
  <PageHero kicker="SECADORES" title="Dois caminhos. Uma escolha rápida." text="Refrigerado para uso industrial geral. Adsorção quando o processo exige ar mais seco." image="/assets/corporate/dryer-refrigerated.webp"><Link to="/diagnostico" className="v2-primary">Precisa dimensionar?</Link></PageHero>
  <section className="v2-section v2-product-section"><div className="v2-container"><ProductExplorer groups={groups} ctaLabel="Consultar este secador"/></div></section>
  <ContactBand/>
</PageFrame>}
