import { createFileRoute } from "@tanstack/react-router";
import { PageFrame, PageHero, ContactBand } from "@/components/site-v2";
import { ProductExplorer, type ProductGroup } from "@/components/product-explorer";
import { pageMeta } from "@/lib/page-meta";

export const Route=createFileRoute("/acessorios")({head:()=>pageMeta("/acessorios","Acessórios para Ar Comprimido | TecAr","Filtros, drenos, separadores e controles para sistemas de ar comprimido.","https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=696,fit=crop/YZ9EgGEK8zh4Pjl4/irp-en-product-photo-exterior-right-fs-filter-JdFwicofy98WNmpN.webp"),component:Page});

const groups:ProductGroup[]=[
 {id:"filtration",label:"Filtragem",intro:"Remoção de partículas, aerossóis e contaminantes antes do ponto de uso.",items:[
   {name:"Filtro Série F",tag:"Filtragem",image:"https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=696,fit=crop/YZ9EgGEK8zh4Pjl4/irp-en-product-photo-exterior-right-fs-filter-JdFwicofy98WNmpN.webp",summary:"Filtro de linha para proteger processo e equipamentos a jusante.",facts:["Linha de ar","Proteção","Tratamento"]},
   {name:"Módulos coalescentes NL",tag:"Coalescente",image:"https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=786,fit=crop/YZ9EgGEK8zh4Pjl4/irp-product-photo-exterior-energy-efficient-filtration-nl-modules-DMGaB055Q9Oj6KTD.webp",summary:"Filtragem fina para redução de aerossóis e contaminantes no ar comprimido.",facts:["Coalescente","Tratamento fino","Baixa contaminação"]},
 ]},
 {id:"condensate",label:"Condensado",intro:"Drenagem e tratamento do condensado gerado pelo sistema.",items:[
   {name:"Válvula de dreno pneumática",tag:"Drenagem",image:"https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=562,fit=crop/YZ9EgGEK8zh4Pjl4/irp-product-photo-interior-pneumatic-no-loss-9u9ULyTteeCt3sm3.webp",summary:"Remove condensado de pontos do sistema sem depender de drenagem manual.",facts:["Condensado","Automação","Linha de ar"]},
   {name:"Separador água / óleo",tag:"Tratamento de condensado",image:"https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=696,fit=crop/YZ9EgGEK8zh4Pjl4/irp-product-photo-polysep-oil-water-bundle-MBYTaT8tLtUiKbD1.webp",summary:"Separa óleo do condensado antes do descarte e da etapa ambiental aplicável.",facts:["Água / óleo","Condensado","Tratamento"]},
 ]},
 {id:"control",label:"Controle",intro:"Componentes para coordenar pressão, fluxo e múltiplos compressores.",items:[
   {name:"Gerenciador X12i",tag:"Gerenciamento",image:"https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=562,fit=crop/YZ9EgGEK8zh4Pjl4/irp-product-photo-x12i-NVrsqqfTzt5roXSt.jpg",summary:"Coordena equipamentos e ajuda a organizar a geração de ar em sistemas com múltiplos compressores.",facts:["Múltiplos compressores","Sequenciamento","Controle"]},
   {name:"IntelliFlow",tag:"Controle de fluxo",image:"https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=786,fit=crop/YZ9EgGEK8zh4Pjl4/irp-product-photo-intelliflow-lNHLMgXrWIyEzNHR.jpg",summary:"Controle de pressão e fluxo para estabilizar a distribuição conforme a configuração do sistema.",facts:["Pressão","Fluxo","Estabilidade"]},
 ]}
];

function Page(){return <PageFrame>
 <PageHero kicker="ACESSÓRIOS" title="Escolha pela função no sistema." text="Filtragem, condensado e controle organizados em grupos clicáveis." image="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=696,fit=crop/YZ9EgGEK8zh4Pjl4/irp-en-product-photo-exterior-right-fs-filter-JdFwicofy98WNmpN.webp"/>
 <section className="v2-section v2-product-section"><div className="v2-container"><ProductExplorer groups={groups} ctaLabel="Consultar este componente"/></div></section>
 <ContactBand/>
</PageFrame>}
