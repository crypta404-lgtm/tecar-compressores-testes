import { createFileRoute } from "@tanstack/react-router";
import { PageFrame, PageHero, ContactBand } from "@/components/site-v2";
import { BellRing, Droplets, Gauge, RefreshCcw, Thermometer, Zap } from "lucide-react";
import { EdCards, EdHead, EdSection, EdSteps } from "@/components/editorial";
import { MonitoringDemo } from "@/components/client-tools";
import { pageMeta } from "@/lib/page-meta";
export const Route=createFileRoute("/tecar-connect")({head:()=>pageMeta("/tecar-connect","TecAr Connect | Monitoramento Remoto","Monitoramento remoto de compressores com acompanhamento de variáveis, alarmes e histórico para apoiar disponibilidade e eficiência.","/assets/v2/tecar-connect.png"),component:Page});
const tracked=[[Thermometer,"Temperatura","Acompanhe tendências e sinais de aquecimento anormal."],[Gauge,"Pressão","Visualize comportamento do sistema e variações operacionais."],[Droplets,"Ponto de orvalho","Apoie o controle da qualidade do ar e da umidade."],[Zap,"Energia","Observe consumo e comportamento energético do conjunto."],[RefreshCcw,"Carga e alívio","Entenda como o compressor trabalha ao longo do tempo."],[BellRing,"Alarmes","Receba contexto mais cedo para agir antes de uma parada maior."]] as const;
function Page(){return <PageFrame>
<PageHero kicker="TECAR CONNECT" title="O compressor na palma da mão." text="Monitoramento remoto para acompanhar condições físicas e operacionais do equipamento, com visualização gráfica, parâmetros e alarmes." image="/assets/v2/tecar-connect.png"><a href="https://wa.me/5541996441330?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20TecAr." target="_blank" rel="noopener noreferrer" className="v2-primary">Quero monitorar</a></PageHero>
<EdSection><div className="ed-with-tool">
 <div><EdHead title="Da reação para a observação contínua." text="Na operação da TecAr, soluções como o TUDO REMOTO ampliam a visibilidade sobre o compressor. O objetivo é perceber tendência, desvio e necessidade de intervenção com mais contexto."/>
 <ul className="ed-mini">{tracked.map(([Icon,t,d])=><li key={t}><span className="ed-icon"><Icon aria-hidden="true" size={18}/></span><b>{t}</b><span>{d}</span></li>)}</ul></div>
 <MonitoringDemo/>
</div></EdSection>
<EdSection tone="paper">
 <EdHead kicker="COMO AJUDA" title="Informação útil para manutenção e operação"/>
 <EdCards cols={4} items={[
  {label:"01",title:"Histórico",text:"Compare o comportamento atual com períodos anteriores e intervenções realizadas."},
  {label:"02",title:"Alertas",text:"Sinais de anomalia ganham visibilidade sem depender apenas da inspeção presencial."},
  {label:"03",title:"Eficiência",text:"Consumo e regime de trabalho podem indicar oportunidades de ajuste e investigação."},
  {label:"04",title:"Planejamento",text:"Dados ajudam a preparar a próxima visita com mais contexto sobre o equipamento."},
 ]}/>
</EdSection>
<EdSection>
 <EdHead side title="Do sensor à decisão" text="O monitoramento não substitui a assistência técnica. Ele cria uma camada de observação que ajuda a priorizar e interpretar o que acontece na máquina."/>
 <EdSteps steps={[{title:"Equipamento"},{title:"Sensores"},{title:"Dados"},{title:"Análise"},{title:"Ação técnica"}]}/>
</EdSection>
<ContactBand title="Quer entender o que pode ser monitorado no seu equipamento?" text="Informe modelo, aplicação e configuração atual. A equipe TecAr verifica a solução compatível."/></PageFrame>}
