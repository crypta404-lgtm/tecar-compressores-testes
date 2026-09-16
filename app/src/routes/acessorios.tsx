import { createFileRoute } from "@tanstack/react-router";
import { PageFrame, PageHero, ContactBand } from "@/components/site-v2";
import { ProductExplorer, type ProductGroup } from "@/components/product-explorer";
import { pageMeta } from "@/lib/page-meta";

export const Route=createFileRoute("/acessorios")({head:()=>pageMeta("/acessorios","Acessórios para Ar Comprimido | TecAr","Filtros, drenos, separadores e controles para sistemas de ar comprimido.","/assets/products/accessory-filter.webp"),component:Page});

const groups:ProductGroup[]=[
 {id:"filtration",label:"Filtragem",intro:"Remoção de partículas, aerossóis e contaminantes antes do ponto de uso.",items:[
   {name:"Filtro Série F",tag:"Filtragem",image:"/assets/products/accessory-filter.webp",summary:"Filtro de linha para proteger processo e equipamentos a jusante.",facts:["Linha de ar","Proteção","Tratamento"]},
   {name:"Módulos coalescentes NL",tag:"Coalescente",image:"/assets/products/accessory-nl.webp",summary:"Filtragem fina para redução de aerossóis e contaminantes no ar comprimido.",facts:["Coalescente","Tratamento fino","Baixa contaminação"]},
 ]},
 {id:"condensate",label:"Condensado",intro:"Drenagem e tratamento do condensado gerado pelo sistema.",items:[
   {name:"Válvula de dreno pneumática",tag:"Drenagem",image:"/assets/products/accessory-drain.webp",summary:"Remove condensado de pontos do sistema sem depender de drenagem manual.",facts:["Condensado","Automação","Linha de ar"]},
   {name:"Separador água / óleo",tag:"Tratamento de condensado",image:"/assets/products/accessory-separator.webp",summary:"Separa óleo do condensado antes do descarte e da etapa ambiental aplicável.",facts:["Água / óleo","Condensado","Tratamento"]},
 ]},
 {id:"control",label:"Controle",intro:"Componentes para coordenar pressão, fluxo e múltiplos compressores.",items:[
   {name:"Gerenciador X12i",tag:"Gerenciamento",image:"/assets/products/accessory-manager.jpg",summary:"Coordena equipamentos e ajuda a organizar a geração de ar em sistemas com múltiplos compressores.",facts:["Múltiplos compressores","Sequenciamento","Controle"]},
   {name:"IntelliFlow",tag:"Controle de fluxo",image:"/assets/products/accessory-intelliflow.jpg",summary:"Controle de pressão e fluxo para estabilizar a distribuição conforme a configuração do sistema.",facts:["Pressão","Fluxo","Estabilidade"]},
 ]}
];

function Page(){return <PageFrame>
 <PageHero kicker="ACESSÓRIOS" title="Escolha pela função no sistema." text="Filtragem, condensado e controle organizados em grupos clicáveis." image="/assets/products/accessory-filter.webp"/>
 <section className="v2-section v2-product-section"><div className="v2-container"><ProductExplorer groups={groups} ctaLabel="Consultar este componente"/></div></section>
 <ContactBand/>
</PageFrame>}
