import { createFileRoute } from "@tanstack/react-router";
import { PageFrame, PageHero, ContactBand } from "@/components/site-v2";
import { CalendarRange, FileSignature, PiggyBank, Siren, Timer, Wind } from "lucide-react";
import { EdCards, EdHead, EdSection, EdSteps } from "@/components/editorial";
import { pageMeta } from "@/lib/page-meta";
export const Route=createFileRoute("/locacao")({head:()=>pageMeta("/locacao","Locação de Compressores | TecAr","Locação emergencial e contratos de longo prazo para compressores, secadores e reservatórios de ar comprimido.","/assets/v2/rental.png"),component:Page});
function Page(){return <PageFrame>
<PageHero kicker="LOCAÇÃO" title="Geração de ar com flexibilidade operacional." text="A TecAr oferece locação de compressores, secadores e reservatórios para necessidades emergenciais e contratos de longo prazo, inclusive no modelo de venda de ar." image="/assets/unique/generated/rental-hero.webp"><a href="https://wa.me/5541996441330?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20TecAr." target="_blank" rel="noopener noreferrer" className="v2-primary">Consultar disponibilidade</a></PageHero>
<EdSection>
 <EdHead title="Quando a locação faz sentido"/>
 <EdCards items={[
  {icon:Siren,title:"Emergência",text:"Suporte para situações em que a geração de ar precisa ser restabelecida sem esperar uma aquisição definitiva."},
  {icon:CalendarRange,title:"Longo prazo",text:"Contratos a partir de um ano para transformar parte do investimento em custo operacional previsível."},
  {icon:Wind,title:"Venda de ar",text:"Modelo em que a necessidade de geração é tratada como serviço, com foco na disponibilidade do sistema."},
 ]}/>
</EdSection>
<EdSection tone="paper">
 <EdHead side kicker="PROCESSO" title="Do levantamento à operação" text="A escolha depende de vazão, pressão, qualidade do ar, regime de trabalho, espaço disponível e criticidade do processo."/>
 <EdSteps steps={[{title:"Demanda"},{title:"Dimensionamento"},{title:"Instalação"},{title:"Operação"},{title:"Suporte"}]}/>
</EdSection>
<EdSection>
 <EdHead side title="Equipamentos disponíveis para locação" text="A disponibilidade varia conforme potência, pressão e configuração. Consulte a equipe para dimensionar o conjunto adequado."/>
 <div className="ed-products">
  <figure><img src="/assets/unique/official/rental-a-v2.webp" alt="Compressor industrial disponível no catálogo de locação TecAr" loading="lazy"/></figure>
  <figure><img src="/assets/unique/official/rental-compressor-v2.webp" alt="Compressor de pistão do catálogo de locação TecAr" loading="lazy"/></figure>
  <figure><img src="/assets/unique/official/rental-b-v2.webp" alt="Conjunto industrial de compressão do catálogo TecAr" loading="lazy"/></figure>
 </div>
</EdSection>
<EdSection tone="paper">
 <EdHead title="Capacidade agora. Flexibilidade para decidir depois."/>
 <EdCards items={[
  {icon:PiggyBank,title:"Preserve o capital",text:"Atenda uma demanda de ar sem concentrar o desembolso na compra de um equipamento. Compare prazo, escopo e custo total com a equipe comercial."},
  {icon:Timer,title:"Cubra paradas e picos",text:"Planeje uma fonte temporária durante manutenção, sazonalidade ou expansão. A seleção considera vazão, pressão e disponibilidade da frota."},
  {icon:FileSignature,title:"Contrate conforme sua operação",text:"Defina período de uso, instalação e suporte em uma proposta clara. As responsabilidades de manutenção e atendimento ficam estabelecidas no contrato."},
 ]}/>
</EdSection><ContactBand title="Precisa de ar comprimido sem esperar uma compra?" text="Informe pressão, vazão aproximada, período de uso e local da instalação para agilizar o dimensionamento."/></PageFrame>}
