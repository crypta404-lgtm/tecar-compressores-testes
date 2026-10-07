import { createFileRoute } from "@tanstack/react-router";
import { PageFrame, PageHero, ContactBand } from "@/components/site-v2";
import { Activity, CalendarCheck, Wrench } from "lucide-react";
import { EdCards, EdHead, EdSection, EdSplit, EdSteps } from "@/components/editorial";
import { pageMeta } from "@/lib/page-meta";
export const Route=createFileRoute("/manutencao")({head:()=>pageMeta("/manutencao","Manutenção de Compressores | TecAr","Assistência técnica multimarcas, manutenção preventiva, corretiva, diagnóstico e suporte NR13 para sistemas de ar comprimido.","/assets/v2/tecar-service.png"),component:Page});
function Page(){return <PageFrame>
<PageHero kicker="MANUTENÇÃO" title="Menos improviso. Mais previsibilidade." text="Assistência técnica multimarcas, manutenção preventiva, corretiva e ferramentas de diagnóstico para reduzir tempo de parada e aumentar a assertividade do atendimento." image="/assets/unique/generated/maintenance-hero.webp"><a href="https://wa.me/5541996441330?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20TecAr." target="_blank" rel="noopener noreferrer" className="v2-primary">Solicitar atendimento</a></PageHero>
<EdSection>
 <EdHead side title="Assistência técnica multimarcas" text="Planejamento, comunicação com o cliente e diagnóstico formam a base do atendimento. A manutenção deve preservar disponibilidade, não apenas reagir quando o equipamento para."/>
 <EdCards items={[
  {icon:CalendarCheck,title:"Preventiva",text:"Programação de intervenções conforme condição, carga horária e necessidade do equipamento."},
  {icon:Wrench,title:"Corretiva",text:"Diagnóstico técnico e intervenção para restabelecer a operação com clareza sobre a causa da falha."},
  {icon:Activity,title:"Diagnóstico",text:"Uso de ferramentas e medições para aumentar a precisão antes da substituição de componentes."},
 ]}/>
</EdSection>
<EdSection tone="paper">
 <EdHead side kicker="GESTÃO PREVENTIVA" title="O histórico precisa trabalhar a favor da manutenção." text="A TecAr organiza a programação e o acompanhamento das intervenções para antecipar necessidades e reduzir o risco de corretivas provocadas por falta de manutenção."/>
 <EdSteps steps={[{title:"Identificação do equipamento e histórico"},{title:"Planejamento da preventiva"},{title:"Execução e registro técnico"},{title:"Acompanhamento da próxima necessidade"}]}/>
</EdSection>
<EdSection><EdSplit image="/assets/unique/generated/pressure-vessel-inspection.webp" alt="Imagem ilustrativa de medição em vaso de pressão, criada por IA">
 <span className="v2-kicker">NR13</span><h2>Reservatórios e vasos de pressão exigem atenção técnica.</h2>
 <p>A NR13 estabelece requisitos para inspeção e segurança de vasos de pressão. Quando aplicável ao sistema de ar comprimido, a TecAr orienta o cliente sobre a necessidade de inspeção por profissional habilitado.</p>
 <a href="https://wa.me/5541996441330?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20TecAr." target="_blank" rel="noopener noreferrer" className="ed-link">Consultar NR13</a>
</EdSplit></EdSection>
<ContactBand title="Seu compressor precisa de atendimento?" text="Envie o contexto da máquina, sintomas e urgência. A equipe TecAr direciona o atendimento adequado."/></PageFrame>}
