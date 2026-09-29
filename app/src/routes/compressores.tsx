import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, PageHero, ContactBand } from "@/components/site-v2";
import { ProductExplorer, type ProductGroup } from "@/components/product-explorer";
import { pageMeta } from "@/lib/page-meta";

export const Route=createFileRoute("/compressores")({
  head:()=>pageMeta("/compressores","Compressores de Ar | TecAr","Famílias de compressores Ingersoll Rand organizadas por tecnologia e aplicação.","/assets/products/compressor-nirvana.jpg"),
  component:Page
});

const groups:ProductGroup[]=[
  {
    id:"oil-free",label:"Isentos de óleo",intro:"Para processos que não admitem contaminação por óleo no ar comprimido.",
    items:[
      {name:"Nirvana Oil-Free VSD",tag:"Variável · Classe 0",image:"/assets/products/compressor-nirvana.jpg",summary:"Velocidade variável para acompanhar demanda sem abrir mão de ar isento de óleo.",facts:["VSD","Aplicações críticas","Ar isento de óleo"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/oil-free-air-compressors/"},
      {name:"Série E 90–160 kW",tag:"Parafuso isento de óleo",image:"/assets/products/e90-160-official.jpg",summary:"Família de parafuso isento de óleo para operação industrial contínua e alta exigência de pureza.",facts:["90–160 kW","Classe 0","Operação contínua"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/oil-free-air-compressors/e-series-90-160-kw/"},
      {name:"Série E — grande porte",tag:"Isento de óleo",image:"/assets/products/compressor-oil-free.jpg",summary:"Configurações de maior porte para plantas com grande demanda de ar e requisito de pureza.",facts:["Grande vazão","Classe 0","Processos críticos"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/oil-free-air-compressors/e-series-185-355-kw/"},
    ]
  },
  {
    id:"lubricated",label:"Parafuso lubrificado",intro:"Famílias industriais para operação contínua, com versões fixas, variáveis e pacotes integrados.",
    items:[
      {name:"UP6 4–11 kW",tag:"Parafuso lubrificado",image:"/assets/products/up6-official.jpg",summary:"Pacote compacto para demandas industriais menores, com acesso simples para operação e manutenção.",facts:["4–11 kW","Compacto","Opção TAS"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/oil-flooded-rotary-air-compressors/up6-4-11-kw/"},
      {name:"UP6S 11–22 kW",tag:"Parafuso lubrificado",image:"/assets/products/up6s-official.jpg",summary:"Linha industrial com mais controle e opções integradas para geração de ar comprimido.",facts:["11–22 kW","Controle integrado","Opção TAS"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/oil-flooded-rotary-air-compressors/up6s-11-22-kw-14-30-hp/"},
      {name:"Next Generation R-Series 45–75 kW",tag:"Fixo ou VSD",image:"/assets/products/rs45-75-official.jpg",summary:"Família R-Series para operação industrial com opções de velocidade fixa ou variável.",facts:["45–75 kW","VSD opcional","Helix / controle remoto"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/oil-flooded-rotary-air-compressors/ng-r-series-45-75-kw/"},
      {name:"Série R sobre base",tag:"Pacote sobre base",image:"/assets/products/compressor-r-base.png",summary:"Configuração sobre base para integração direta à casa de máquinas e periféricos existentes.",facts:["Instalação industrial","Base dedicada","Manutenção acessível"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/oil-flooded-rotary-air-compressors/"},
      {name:"Série R com reservatório",tag:"Pacote integrado",image:"/assets/products/compressor-r-tank.png",summary:"Compressor integrado ao reservatório para reduzir área de instalação e simplificar o conjunto.",facts:["Reservatório integrado","Pacote compacto","Rede industrial"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/oil-flooded-rotary-air-compressors/"},
      {name:"HPM / VSD",tag:"Velocidade variável",image:"/assets/products/compressor-hpm.png",summary:"Configuração de velocidade variável voltada a plantas com consumo oscilante ao longo do turno.",facts:["VSD","Demanda variável","Eficiência operacional"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/oil-flooded-rotary-air-compressors/"},
    ]
  },
  {
    id:"piston",label:"Pistão",intro:"Compressores alternativos para aplicações industriais, oficinas e necessidades específicas de pressão.",
    items:[
      {name:"T30 — único e duplo estágio",tag:"Pistão",image:"/assets/products/t30-single-double-official.jpg",summary:"Família T30 para aplicações que priorizam simplicidade, robustez e manutenção direta.",facts:["Pistão","1 ou 2 estágios","Aplicações industriais"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/reciprocating-air-compressors/electrical-driven-single-stage-and-2/"},
      {name:"T30 alta pressão — 2 estágios",tag:"Alta pressão",image:"/assets/products/t30-two-stage-official.jpg",summary:"Configurações multiestágio para aplicações que exigem pressão acima da rede convencional.",facts:["2–4 estágios","Alta pressão","Serviço industrial"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/reciprocating-air-compressors/electrical-driven-2-stage-t-30-series/"},
      {name:"T30 alta pressão 7–14 kW",tag:"Até alta pressão",image:"/assets/products/t30-high-official.jpg",summary:"Unidade montada sobre base para aplicações industriais de pressão elevada.",facts:["7–14 kW","Base industrial","Alta pressão"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/reciprocating-air-compressors/high-pressure/"},
    ]
  },
  {
    id:"centrifugal",label:"Centrífugos",intro:"Soluções para grandes vazões e operações contínuas de maior porte.",
    items:[
      {name:"Centac C700",tag:"Centrífugo · isento de óleo",image:"/assets/products/centac-c700-official.jpg",summary:"Compressor centrífugo integrado para grande vazão e ar isento de óleo.",facts:["Grande vazão","Classe 0","Pacote integrado"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/centrifugal-compressors/60-115-m3min-2000-4100-cfm/"},
      {name:"MSG Turbo-Air 2040",tag:"Centrífugo de alta pressão",image:"https://azure-na-images.contentstack.com/v3/assets/blta3c1d56420975795/blt73ff6f49d3b0cbeb/67b716f3dd97b1710cdbdedb/IRP-Product-Photo-turbo-air-2040.webp?auto=webp&format=pjpeg&quality=80&width=1600",summary:"Centrífugo de alta pressão para aplicações de processo e sopro de embalagens PET.",facts:["Alta pressão","PET","Isento de óleo"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/centrifugal-compressors/turbo-air-2040/"},
    ]
  },
  {
    id:"pet",label:"PET / alta pressão",intro:"Famílias para sopro de embalagens, boosters e processos que exigem pressão elevada.",
    items:[
      {name:"Compressor de alta pressão",tag:"Processo especial",image:"/assets/products/compressor-high-pressure.png",summary:"Pacote dedicado a aplicações de pressão elevada, selecionado conforme vazão e pressão final do processo.",facts:["Alta pressão","Processos especiais","Dimensionamento dedicado"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/high-pressure-compressors/"},
      {name:"MSG Turbo-Air 2040",tag:"PET · centrífugo",referenceFamily:"Centrífugos",summary:"Centrífugo de alta pressão desenvolvido para grandes fluxos e aplicações como sopro PET.",facts:["Até alta pressão","PET","Grande fluxo"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/centrifugal-compressors/turbo-air-2040/"},
      {name:"T30 alta pressão",tag:"Pistão multiestágio",referenceFamily:"Pistão",summary:"Alternativo de alta pressão para processos que exigem solução robusta e vazões menores.",facts:["Pistão","Alta pressão","Multiestágio"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/reciprocating-air-compressors/high-pressure/"},
    ]
  },
  {
    id:"gas",label:"Geração de gases",intro:"Produção on-site para reduzir dependência logística e integrar gás de processo à planta.",
    items:[
      {name:"Gerador de nitrogênio on-site",tag:"Nitrogênio",image:"/assets/products/nitrogen-generator.webp",summary:"Geração local de nitrogênio integrada ao sistema de ar comprimido para aplicações de processo.",facts:["On-site","Nitrogênio","Integração com ar comprimido"],source:"https://www.ingersollrand.com/pt-br/products/air-compressors/nitrogen-generators/"},
    ]
  }
];

function Page(){return <PageFrame>
  <PageHero kicker="COMPRESSORES" title="Escolha primeiro a família. Depois o equipamento." text="Clique no tipo de compressor e veja somente as opções daquela tecnologia." image="/assets/unique/generated/compressor-hero.webp"><Link to="/diagnostico" className="v2-primary">Precisa dimensionar?</Link></PageHero>
  <section className="v2-section v2-product-section"><div className="v2-container"><ProductExplorer groups={groups} ctaLabel="Consultar este compressor"/></div></section>
  <ContactBand/>
</PageFrame>}
