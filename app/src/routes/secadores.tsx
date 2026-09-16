import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, PageHero, ContactBand } from "@/components/site-v2";
import { ProductExplorer, type ProductGroup } from "@/components/product-explorer";
import { pageMeta } from "@/lib/page-meta";

export const Route=createFileRoute("/secadores")({head:()=>pageMeta("/secadores","Secadores de Ar | TecAr","Secadores refrigerados e por adsorção com consulta visual e objetiva.","/assets/products/dryer-refrigerated.png"),component:Page});

const groups:ProductGroup[]=[
  {id:"refrigerated",label:"Refrigerados",intro:"Para tratamento de ar em aplicações industriais gerais.",items:[
    {name:"Secador refrigerado",tag:"Uso industrial geral",image:"/assets/products/dryer-refrigerated.png",summary:"Resfria o ar comprimido, separa condensado e reduz a umidade da rede.",facts:["Operação contínua","Tratamento de umidade","Uso industrial"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/air-compressor-dryers-and-filters/non-cycling-refrigerated-dryers/"}
  ]},
  {id:"adsorption",label:"Adsorção",intro:"Para processos que precisam de ar mais seco e ponto de orvalho mais baixo.",items:[
    {name:"Secador por adsorção",tag:"Ponto de orvalho baixo",image:"/assets/products/dryer-adsorption.webp",summary:"Utiliza material dessecante para remover umidade em aplicações mais críticas.",facts:["Dessecante","Ar mais seco","Processos críticos"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/air-compressor-dryers-and-filters/hl-heatless-desiccant-dryers/"}
  ]}
];

function Page(){return <PageFrame>
  <PageHero kicker="SECADORES" title="Escolha o tipo de secagem." text="Clique na tecnologia e veja a opção correspondente, com foto e resumo direto." image="/assets/products/dryer-refrigerated.png"><Link to="/diagnostico" className="v2-primary">Precisa dimensionar?</Link></PageHero>
  <section className="v2-section v2-product-section"><div className="v2-container"><ProductExplorer groups={groups} ctaLabel="Consultar este secador"/></div></section>
  <ContactBand/>
</PageFrame>}
