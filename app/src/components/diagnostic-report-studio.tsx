import {
  Activity, AirVent, ArrowDownRight, Bolt, ClipboardCheck, Copy, Droplets,
  Factory, FileText, Gauge, Printer, ShieldCheck, ThermometerSun, Wind,
} from "lucide-react";
import { useMemo, useState, type ComponentType } from "react";
import { CAGI_UP6S, COPEL_A4_TARIFFS, TECH_SOURCES } from "@/lib/diagnostic-data";
import { WhatsAppLink } from "@/components/site-v2";

type ReportId = "flow" | "energy" | "pressure" | "quality";
type IndustryProfile = { label:string; focus:string; risks:string[]; measurements:string[] };

const INDUSTRIES:Record<string,IndustryProfile>={
  food:{label:"Alimentos e bebidas",focus:"Continuidade, condensado e risco de contaminação no ponto de uso.",risks:["Água e óleo no processo","Parada de linha","Pressão instável em picos"],measurements:["Ponto de orvalho","Óleo e partículas","Pressão no ponto crítico"]},
  pharma:{label:"Farmacêutica e cosmética",focus:"Qualidade comprovável do ar, rastreabilidade e estabilidade de processo.",risks:["Classe de pureza inadequada","Ausência de evidência","Falha de redundância"],measurements:["ISO 8573 por contaminante","Ponto de orvalho","Tendência de pressão"]},
  metal:{label:"Metalmecânica",focus:"Vazão disponível, quedas de pressão e consumo durante os turnos.",risks:["Ferramentas sem desempenho","Vazamentos distribuídos","Setpoint elevado"],measurements:["Vazão por turno","Carga e alívio","Pressão na casa e no uso"]},
  plastic:{label:"Plástico e embalagens",focus:"Demanda contínua, picos de sopro e estabilidade da secagem.",risks:["Picos acima da capacidade","Umidade no produto","Operação sem reserva"],measurements:["Perfil de vazão","Ponto de orvalho","Potência e pressão"]},
  wood:{label:"Madeira e móveis",focus:"Distribuição, condensado e perdas em múltiplos pontos de consumo.",risks:["Rede subdimensionada","Água nas linhas","Vazamentos em engates"],measurements:["Queda de pressão","Dreno e condensado","Ultrassom de vazamentos"]},
  agro:{label:"Agroindústria",focus:"Sazonalidade, ambiente severo e confiabilidade nos períodos de pico.",risks:["Contaminação ambiental","Pico sazonal","Manutenção fora da janela"],measurements:["Horas por safra","Temperatura ambiente","Vazão de pico"]},
  port:{label:"Portuária e logística",focus:"Corrosão, disponibilidade e contingência para operação crítica.",risks:["Ambiente agressivo","Parada operacional","Falta de redundância"],measurements:["Pressão e vazão","Temperatura","Condição de filtros e drenos"]},
};

const REPORTS:Array<{id:ReportId;label:string;short:string;icon:ComponentType<{size?:number;strokeWidth?:number}>}>=[
  {id:"flow",label:"Vazão e vazamentos",short:"Demanda, perdas e custo",icon:Wind},
  {id:"energy",label:"Energia",short:"kWh, potência e custo anual",icon:Bolt},
  {id:"pressure",label:"Pressão",short:"Queda de rede e oportunidade",icon:Gauge},
  {id:"quality",label:"Qualidade do ar",short:"PDP, contaminantes e evidências",icon:Droplets},
];

const money=(value:number)=>value.toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0});
const number=(value:number,digits=1)=>value.toLocaleString("pt-BR",{maximumFractionDigits:digits,minimumFractionDigits:digits});
const clamp=(value:number,min:number,max:number)=>Math.min(max,Math.max(min,value));

function Input({label,suffix,value,min,max,step=1,onChange}:{label:string;suffix?:string;value:number;min?:number;max?:number;step?:number;onChange:(value:number)=>void}){
  const handleChange=(raw:string)=>{
    if(raw.length>6 || /[eE+]/.test(raw)) return;
    if(raw===""){ onChange(0); return; }
    const next=Number(raw);
    if(!Number.isFinite(next)) return;
    onChange(clamp(next,min??-999999,max??999999));
  };
  return <label className="v2-dx-field"><span>{label}</span><div><input type="number" value={value} min={min} max={max} step={step} maxLength={6} onChange={e=>handleChange(e.target.value)}/>{suffix&&<b>{suffix}</b>}</div></label>
}

function Meter({label,value,max,display,tone="default"}:{label:string;value:number;max:number;display:string;tone?:"default"|"risk"|"good"}){
  const width=clamp(value/Math.max(max,.001)*100,2,100);
  return <div className={"v2-dx-meter "+tone}><div><span>{label}</span><b>{display}</b></div><i><em style={{width:width+"%"}}/></i></div>
}

function SourceLinks({links}:{links:Array<{label:string;url:string}>}){
  return <div className="v2-dx-sources"><span>Fontes desta leitura</span>{links.map(source=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>)}</div>
}

export function DiagnosticHero(){
  return <section className="v2-dx-hero"><div className="v2-container v2-dx-hero-grid">
    <div className="v2-dx-hero-copy">
      <span className="v2-kicker">DIAGNÓSTICO TECAR 360</span>
      <h1>Transforme sinais da operação em uma decisão técnica.</h1>
      <p>Simule vazão, energia, vazamentos, pressão e qualidade do ar. Ao final, gere um pré-laudo com memória de cálculo e fontes técnicas visíveis.</p>
      <div className="v2-dx-proof"><span><b>4 relatórios</b> no pré-laudo 360</span><span><b>CAGI</b> desempenho verificado</span><span><b>DOE</b> métodos de referência</span></div>
    </div>
    <div className="v2-dx-hero-media">
      <video autoPlay muted loop playsInline poster="/assets/world/scene-01-poster.png" aria-label="Sistema industrial de ar comprimido"><source src="/assets/world/scene-01.mp4" type="video/mp4"/></video>
      <div className="v2-dx-sensor v2-dx-sensor-a"><Activity size={17}/><span>Pressão</span><b>7,0 bar</b></div>
      <div className="v2-dx-sensor v2-dx-sensor-b"><Wind size={17}/><span>Vazão</span><b>116 cfm</b></div>
      <div className="v2-dx-sensor v2-dx-sensor-c"><Bolt size={17}/><span>Potência</span><b>26,16 kW</b></div>
    </div>
  </div></section>
}

export function DiagnosticReportStudio(){
  const [active,setActive]=useState<ReportId>("flow");
  const [industryId,setIndustryId]=useState("metal");
  const [modelId,setModelId]=useState("up6s-30-125");
  const [tariffId,setTariffId]=useState("a4-offpeak");
  const [hours,setHours]=useState(4000);
  const [loadPercent,setLoadPercent]=useState(72);
  const [demandCfm,setDemandCfm]=useState(92);
  const [leakInputPercent,setLeakInputPercent]=useState(10);
  const [supplyBar,setSupplyBar]=useState(7.5);
  const [pointBar,setPointBar]=useState(6.9);
  const [targetBar,setTargetBar]=useState(7);
  const [pdpMeasured,setPdpMeasured]=useState(8);
  const [pdpRequired,setPdpRequired]=useState(3);
  const [copied,setCopied]=useState(false);
  const model=CAGI_UP6S.find(item=>item.id===modelId)??CAGI_UP6S[4];
  const tariff=COPEL_A4_TARIFFS.find(item=>item.id===tariffId)??COPEL_A4_TARIFFS[0];
  const industry=INDUSTRIES[industryId];

  const result=useMemo(()=>{
    const loadRatio=clamp(loadPercent/100,0,1),packageKw=model.packageKw??0,noLoadKw=model.noLoadKw??0;
    const averageKw=packageKw*loadRatio+noLoadKw*(1-loadRatio),annualKwh=averageKw*hours,annualCost=annualKwh*tariff.value;
    const reserveCfm=model.flowCfm-demandCfm,reservePercent=model.flowCfm>0?reserveCfm/model.flowCfm*100:0;
    const leakCfm=demandCfm*clamp(leakInputPercent,0,100)/100;
    const specificPower=model.specificKw100Cfm??packageKw/Math.max(model.flowCfm,1)*100;
    const leakPower=Math.max(0,leakCfm)*specificPower/100,leakCost=leakPower*hours*tariff.value,leakPercent=clamp(leakInputPercent,0,100);
    const pressureDrop=Math.max(0,supplyBar-pointBar),pressureDropPercent=supplyBar>0?pressureDrop/supplyBar*100:0;
    const pressureSavingPercent=Math.max(0,supplyBar-targetBar)/0.1378952,pressureSaving=packageKw*pressureSavingPercent/100*hours*tariff.value;
    const pdpGap=pdpMeasured-pdpRequired;
    return {averageKw,annualKwh,annualCost,reserveCfm,reservePercent,specificPower,leakCfm,leakPower,leakCost,leakPercent,pressureDrop,pressureDropPercent,pressureSavingPercent,pressureSaving,pdpGap};
  },[demandCfm,hours,leakInputPercent,loadPercent,model,pdpMeasured,pdpRequired,pointBar,supplyBar,targetBar,tariff.value]);
  const reportText=useMemo(()=>[
    "PRÉ-LAUDO TECAR 360","Indústria: "+industry.label,"Modelo: "+model.model,
    "Vazão publicada / demanda: "+number(model.flowCfm,0)+" / "+number(demandCfm,0)+" cfm",
    "Reserva calculada: "+number(result.reserveCfm,0)+" cfm","Potência média: "+number(result.averageKw,2)+" kW",
    "Energia anual: "+number(result.annualKwh,0)+" kWh","Custo anual: "+money(result.annualCost),
    "Vazamento: "+number(leakInputPercent,0)+"% da demanda ("+number(result.leakCfm,1)+" cfm) | "+money(result.leakCost)+"/ano",
    "Queda de pressão: "+number(result.pressureDrop,2)+" bar","Oportunidade por setpoint: "+money(result.pressureSaving)+"/ano",
    "PDP medido / requerido: "+number(pdpMeasured,0)+" °C / "+number(pdpRequired,0)+" °C",
    "Resultado preliminar baseado em dados informados e referências públicas. Requer validação em campo."
  ].join("\n"),[demandCfm,industry.label,leakInputPercent,model,result,pdpMeasured,pdpRequired]);

  const whatsapp="https://wa.me/5541996441330?text="+encodeURIComponent("Olá, gerei um pré-laudo no Diagnóstico TecAr 360.\n\n"+reportText);
  const copyReport=async()=>{if(typeof navigator==="undefined"||!navigator.clipboard)return;await navigator.clipboard.writeText(reportText);setCopied(true);window.setTimeout(()=>setCopied(false),1800)};

  return <div className="v2-dx-studio">
    <div className="v2-dx-studio-head"><div><span className="v2-kicker">PAINEL INTERATIVO</span><h2>Pré-laudo técnico em poucos minutos.</h2><p>Ajuste os dados disponíveis. Todos os resultados mudam em tempo real e permanecem identificados como estimativas até a validação técnica.</p></div></div>
    <div className="v2-dx-benchmarks"><article><b>&lt;10%</b><span>vazamentos em sistema bem mantido</span></article><article><b>20–30%</b><span>perdas possíveis em sistema mal mantido</span></article><article><b>0,14 bar</b><span>redução associada a cerca de 1% de energia</span></article><article><b>&lt;10%</b><span>referência máxima de queda na distribuição</span></article></div>
    <div className="v2-dx-context">
      <label><span>Tipo de indústria</span><select value={industryId} onChange={e=>setIndustryId(e.target.value)}>{Object.entries(INDUSTRIES).map(([id,item])=><option key={id} value={id}>{item.label}</option>)}</select></label>
      <label><span>Compressor de referência CAGI</span><select value={modelId} onChange={e=>setModelId(e.target.value)}>{CAGI_UP6S.map(item=><option key={item.id} value={item.id}>{item.model}</option>)}</select></label>
      <label><span>Tarifa de referência</span><select value={tariffId} onChange={e=>setTariffId(e.target.value)}>{COPEL_A4_TARIFFS.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
    </div>
    <div className="v2-dx-industry"><Factory size={24}/><div><b>{industry.label}</b><span>{industry.focus}</span></div><div className="v2-dx-industry-tags">{industry.risks.map(risk=><span key={risk}>{risk}</span>)}</div></div>

    <div className="v2-dx-layout">
      <nav className="v2-dx-tabs" aria-label="Relatórios do diagnóstico">{REPORTS.map(report=>{const Icon=report.icon;return <button key={report.id} type="button" className={active===report.id?"is-active":""} onClick={()=>setActive(report.id)}><Icon size={20} strokeWidth={1.8}/><span><b>{report.label}</b><small>{report.short}</small></span><ArrowDownRight size={16}/></button>})}</nav>
      <div className="v2-dx-report" aria-live="polite">
        {active==="flow"&&<div className="v2-dx-report-panel">
          <div className="v2-dx-report-title"><Wind/><div><span>RELATÓRIO 01</span><h3>Vazão, demanda e vazamentos</h3></div></div>
          <p className="v2-dx-explain">Informe a demanda total estimada da planta e qual parte dela pode estar escapando. A porcentagem é uma hipótese inicial: confirme em campo antes de usar estes valores para decisão ou orçamento.</p>
          <div className="v2-dx-inputs v2-dx-inputs-three"><Input label="Demanda total da planta" suffix="cfm" value={demandCfm} min={0} onChange={setDemandCfm}/><Input label="Vazamento estimado" suffix="%" value={leakInputPercent} min={0} max={100} onChange={setLeakInputPercent}/><Input label="Horas pressurizadas no ano" suffix="h" value={hours} min={0} max={8760} onChange={v=>setHours(clamp(v,0,8760))}/></div>
          <div className="v2-dx-kpis v2-dx-kpis-four"><div><span>Capacidade CAGI</span><b>{number(model.flowCfm,0)} cfm</b></div><div><span>Demanda útil estimada</span><b>{number(Math.max(0,demandCfm-result.leakCfm),1)} cfm</b></div><div className={result.reserveCfm<0?"is-risk":""}><span>Reserva nominal</span><b>{number(result.reserveCfm,0)} cfm</b></div><div className={result.leakPercent>=10?"is-risk":""}><span>Perda informada</span><b>{number(result.leakPercent,0)}%</b></div></div>
          <div className="v2-dx-chart"><Meter label="Capacidade publicada" value={model.flowCfm} max={Math.max(model.flowCfm,demandCfm)} display={number(model.flowCfm,0)+" cfm"} tone="good"/><Meter label="Demanda total informada" value={demandCfm} max={Math.max(model.flowCfm,demandCfm)} display={number(demandCfm,0)+" cfm"} tone={demandCfm>model.flowCfm?"risk":"default"}/><Meter label="Parte atribuída a vazamentos" value={result.leakCfm} max={Math.max(model.flowCfm,demandCfm)} display={number(result.leakCfm,1)+" cfm"} tone="risk"/></div>
          <div className="v2-dx-leak-summary"><div className="v2-dx-leak-ring"><span>{number(result.leakPercent,0)}%</span><small>da demanda informada</small></div><div><span>Vazão desperdiçada (estimativa)</span><strong>{number(result.leakCfm,1)} cfm</strong><span>Potência proporcional</span><strong>{number(result.leakPower,2)} kW</strong></div><div><span>Energia em {number(hours,0)} horas</span><strong>{number(result.leakPower*hours,0)} kWh</strong><span>Custo anual indicativo</span><strong>{money(result.leakCost)}</strong></div></div>
          <div className="v2-dx-breakdown"><b>Como este cenário é calculado</b><span>Vazamento em cfm = demanda total × porcentagem informada / 100.</span><span>Reserva nominal = capacidade CAGI − demanda total, já incluindo a parte estimada como vazamento.</span><span>Potência proporcional = vazamento em cfm × potência específica CAGI / 100; custo = potência × horas pressurizadas × tarifa de referência.</span></div>
          <p className="v2-dx-disclaimer">A estimativa de custo supõe consumo proporcional à vazão perdida. Controle de carga, alívio, inversor e demanda real podem mudar bastante o resultado; a reserva é nominal, não uma garantia operacional. A referência de &lt;10% para sistemas bem mantidos considera a capacidade produzida, enquanto o percentual informado acima se refere à demanda da planta: compare somente após medir ambos na mesma base.</p>
          <div className={"v2-dx-finding "+(result.reserveCfm<0?"risk":"ok")}><ClipboardCheck size={20}/><p><b>{result.reserveCfm<0?"Demanda acima da capacidade publicada.":"Existe reserva nominal no cenário informado."}</b> Confirme vazão, perfil de carga e vazamentos com medição durante um turno representativo.</p></div>
          <SourceLinks links={[{label:model.sourceLabel,url:model.sourceUrl},TECH_SOURCES.cagiVerify,TECH_SOURCES.doe,TECH_SOURCES.copel]}/>
        </div>}
        {active==="energy"&&<div className="v2-dx-report-panel">
          <div className="v2-dx-report-title"><Bolt/><div><span>RELATÓRIO 02</span><h3>Uso e custo de energia</h3></div></div>
          <div className="v2-dx-inputs v2-dx-inputs-three"><Input label="Horas de operação no ano" suffix="h" value={hours} min={0} max={8760} onChange={v=>setHours(clamp(v,0,8760))}/><Input label="Tempo estimado em carga" suffix="%" value={loadPercent} min={0} max={100} onChange={v=>setLoadPercent(clamp(v,0,100))}/><div className="v2-dx-readonly"><span>Tarifa aplicada</span><b>R$ {number(tariff.value,5)}/kWh</b></div></div>
          <div className="v2-dx-energy-visual v2-dx-energy-visual-four"><div><Activity/><span>Potência média estimada</span><strong>{number(result.averageKw,2)} kW</strong></div><div><Bolt/><span>Energia anual</span><strong>{number(result.annualKwh,0)} kWh</strong></div><div><FileText/><span>Custo anual de referência</span><strong>{money(result.annualCost)}</strong></div><div><Gauge/><span>Perfil informado</span><strong>{number(loadPercent,0)}% carga</strong></div></div>
          <div className="v2-dx-visual-block"><b>Distribuição do tempo informado</b><div className="v2-dx-load-track" role="img" aria-label={"Em carga "+number(loadPercent,0)+"%, em alívio "+number(100-loadPercent,0)+"%"}><i style={{width:loadPercent+"%"}}/><em style={{width:(100-loadPercent)+"%"}}/></div><div className="v2-dx-legend"><span><i/> Em carga {number(loadPercent,0)}%</span><span><i/> Em alívio {number(100-loadPercent,0)}%</span></div><Meter label="Potência média em relação à potência em carga" value={result.averageKw} max={Math.max(model.packageKw??0,1)} display={number(result.averageKw,2)+" kW"} tone="good"/></div>
          <div className="v2-dx-formula"><b>Memória de cálculo</b><code>kW médio = kW em carga × % carga + kW em alívio × % alívio</code><code>custo anual = kW médio × horas/ano × tarifa de referência</code></div>
          <p className="v2-dx-disclaimer">A tarifa considera TE + TUSD de energia do subgrupo A4. Demanda, tributos, bandeiras e outros itens da fatura não estão incluídos.</p>
          <SourceLinks links={[{label:model.sourceLabel,url:model.sourceUrl},TECH_SOURCES.copel,TECH_SOURCES.aneel]}/>
        </div>}
        {active==="pressure"&&<div className="v2-dx-report-panel">
          <div className="v2-dx-report-title"><Gauge/><div><span>RELATÓRIO 03</span><h3>Pressão, queda e oportunidade</h3></div></div>
          <div className="v2-dx-inputs v2-dx-inputs-three"><Input label="Saída do reservatório" suffix="bar" value={supplyBar} min={0} max={1000} step={.1} onChange={setSupplyBar}/><Input label="Ponto crítico de uso" suffix="bar" value={pointBar} min={0} max={1000} step={.1} onChange={setPointBar}/><Input label="Setpoint alvo" suffix="bar" value={targetBar} min={0} max={1000} step={.1} onChange={setTargetBar}/></div>
          <div className="v2-dx-pressure-line"><div><Gauge/><span>Origem</span><b>{number(supplyBar,1)} bar</b></div><i><em style={{width:clamp(100-result.pressureDropPercent,5,100)+"%"}}/></i><div><ArrowDownRight/><span>Ponto de uso</span><b>{number(pointBar,1)} bar</b></div></div>
          <div className="v2-dx-kpis"><div className={result.pressureDropPercent>=10?"is-risk":""}><span>Queda na rede</span><b>{number(result.pressureDropPercent,1)}%</b></div><div><span>Redução avaliada</span><b>{number(result.pressureSavingPercent,1)}%</b></div><div><span>Referência anual</span><b>{money(result.pressureSaving)}</b></div></div>
          <div className="v2-dx-visual-block"><b>Comparação das pressões informadas</b><Meter label="Saída do reservatório" value={supplyBar} max={Math.max(supplyBar,pointBar,1)} display={number(supplyBar,1)+" bar"} tone="good"/><Meter label="Ponto crítico de uso" value={pointBar} max={Math.max(supplyBar,pointBar,1)} display={number(pointBar,1)+" bar"} tone={result.pressureDropPercent>=10?"risk":"default"}/><p>A diferença de {number(result.pressureDrop,2)} bar corresponde a {number(result.pressureDropPercent,1)}% da pressão na origem. O custo estimado do ajuste de setpoint é uma hipótese separada, não deve ser somado automaticamente ao custo dos vazamentos.</p></div>
          <div className="v2-dx-finding"><Gauge size={20}/><p><b>Regra de triagem próxima de 6,9 bar.</b>O Sourcebook relaciona cada redução de aproximadamente 0,14 bar a cerca de 1% de economia em plena vazão. A curva e o controle real do compressor prevalecem.</p></div>
          <SourceLinks links={[TECH_SOURCES.doe,TECH_SOURCES.irOptimization]}/>
        </div>}
        {active==="quality"&&<div className="v2-dx-report-panel">
          <div className="v2-dx-report-title"><Droplets/><div><span>RELATÓRIO 04</span><h3>Qualidade do ar e ponto de orvalho</h3></div></div>
          <div className="v2-dx-inputs"><Input label="PDP medido" suffix="°C" value={pdpMeasured} min={-200} max={200} onChange={setPdpMeasured}/><Input label="PDP requerido pelo processo" suffix="°C" value={pdpRequired} min={-200} max={200} onChange={setPdpRequired}/></div>
          <div className="v2-dx-visual-block"><b>Ponto de orvalho sob pressão (PDP)</b><div className="v2-dx-pdp-track"><span>−40 °C</span><div className="v2-dx-pdp-axis"><i style={{left:clamp((pdpMeasured+40)/80*100,0,100)+"%"}} title={"Medido: "+number(pdpMeasured,0)+" °C"}/><em style={{left:clamp((pdpRequired+40)/80*100,0,100)+"%"}} title={"Requerido: "+number(pdpRequired,0)+" °C"}/></div><span>+40 °C</span></div><div className="v2-dx-legend"><span><i/> Medido {number(pdpMeasured,0)} °C</span><span><i/> Requerido {number(pdpRequired,0)} °C</span></div><p>{result.pdpGap>0?"Medido "+number(result.pdpGap,1)+" °C acima do requisito informado.":"Medido "+number(Math.abs(result.pdpGap),1)+" °C abaixo ou igual ao requisito informado."} Marcadores fora da escala visual ficam na extremidade; os números preservam os valores informados.</p></div>
          <div className="v2-dx-quality-grid"><article><Droplets/><span>Água</span><b>{result.pdpGap>0?"Investigar":"Dentro do informado"}</b><p>PDP, água líquida, drenagem e condição do secador.</p></article><article><ShieldCheck/><span>Óleo</span><b>Exige medição</b><p>A classe não pode ser presumida apenas pelo tipo de compressor.</p></article><article><Activity/><span>Partículas</span><b>Exige medição</b><p>Filtros, rede e ponto de coleta influenciam o resultado.</p></article></div>
          <div className={"v2-dx-finding "+(result.pdpGap>0?"risk":"ok")}><ThermometerSun size={20}/><p><b>{result.pdpGap>0?"PDP acima do requisito informado.":"PDP atende ao requisito informado."}</b>A ISO 8573-1 classifica pureza por partículas, água e óleo. Um pré-laudo não certifica classe sem medição e método aplicável.</p></div>
          <div className="v2-dx-measure-list"><span>Medições recomendadas para este setor</span>{industry.measurements.map(item=><b key={item}><ClipboardCheck size={15}/>{item}</b>)}</div>
          <SourceLinks links={[TECH_SOURCES.iso8573,TECH_SOURCES.irOptimization]}/>
        </div>}
      </div>
    </div>

    <section className="v2-dx-prelaudo">
      <div className="v2-dx-prelaudo-head"><div><span>PRÉ-LAUDO GERADO</span><h3>Resumo executivo do cenário</h3></div><div className="v2-dx-prelaudo-actions"><button type="button" onClick={copyReport}><Copy size={17}/>{copied?"Copiado":"Copiar"}</button><button type="button" onClick={()=>window.print()}><Printer size={17}/>Salvar em PDF</button><WhatsAppLink href={whatsapp}><FileText size={17}/>Enviar à TecAr</WhatsAppLink></div></div>
      <img className="v2-dx-print-watermark" src="/assets/tecar/logo-cropped.png" alt="" aria-hidden="true"/>
      <div className="v2-dx-prelaudo-grid"><div><span>Indústria</span><b>{industry.label}</b></div><div><span>Equipamento</span><b>{model.model}</b></div><div><span>Reserva de vazão</span><b>{number(result.reservePercent,1)}%</b></div><div><span>Custo de energia</span><b>{money(result.annualCost)}/ano</b></div><div><span>Vazamento estimado</span><b>{number(result.leakPercent,0)}% · {money(result.leakCost)}/ano</b></div><div><span>Queda de pressão</span><b>{number(result.pressureDropPercent,1)}%</b></div><div><span>Perfil em carga</span><b>{number(loadPercent,0)}%</b></div></div>
      <div className="v2-dx-priority-list"><b>Próximas verificações sugeridas</b><span>1. Contatar a equipe TecAr e revisar os dados com um técnico antes de tomar decisões.</span><span>2. Medir pressão, vazão e potência durante um ciclo produtivo representativo.</span><span>3. Confirmar vazamentos com teste de ciclo, queda de pressão ou ultrassom.</span><span>4. Validar qualidade do ar no ponto de uso conforme a exigência do processo.</span></div>
      <div className="v2-dx-report-evidence"><b>Base e limites deste pré-laudo</b><span>Modelo e potência específica: <a href={model.sourceUrl} target="_blank" rel="noopener noreferrer">{model.sourceLabel}</a> (CAGI). Tarifa: <a href={TECH_SOURCES.copel.url} target="_blank" rel="noopener noreferrer">Copel</a>. Métodos e referências de vazamento/pressão: <a href={TECH_SOURCES.doe.url} target="_blank" rel="noopener noreferrer">DOE Sourcebook</a>.</span><span>Demanda, percentual de vazamento, horas, pressão e ponto de orvalho foram informados pelo usuário; o custo de vazamentos é indicativo e requer validação em campo.</span></div>
      <p>Documento preliminar, sem valor de certificação. Entradas do usuário, fórmulas públicas e dados CAGI devem ser confirmados por avaliação técnica.</p>
    </section>
  </div>
}

export function DiagnosticSourceLibrary(){
  const sources=[
    {icon:ShieldCheck,name:"CAGI",text:"Dados verificados de vazão, potência e desempenho de compressores.",source:TECH_SOURCES.cagiVerify},
    {icon:FileText,name:"Sourcebook",text:"Métodos para vazamentos, pressão, eficiência e avaliação do sistema.",source:TECH_SOURCES.doe},
    {icon:Gauge,name:"Ingersoll Rand",text:"Avaliação de sistema, pressão, amperagem e linha de base operacional.",source:TECH_SOURCES.irOptimization},
    {icon:Droplets,name:"ISO 8573-1",text:"Estrutura de classes de pureza para partículas, água e óleo.",source:TECH_SOURCES.iso8573},
    {icon:Bolt,name:"Copel e ANEEL",text:"Tarifa homologada usada como referência comparativa de energia.",source:TECH_SOURCES.copel},
  ];
  return <div className="v2-dx-source-library">{sources.map(({icon:Icon,name,text,source})=><a key={name} href={source.url} target="_blank" rel="noopener noreferrer"><Icon size={23} strokeWidth={1.7}/><div><b>{name}</b><span>{text}</span></div><ArrowDownRight size={17}/></a>)}</div>
}
