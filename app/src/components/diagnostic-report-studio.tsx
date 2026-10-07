import {
  Activity, AirVent, ArrowDownRight, Bolt, ClipboardCheck, Copy, Droplets,
  Calculator, Factory, FileText, Gauge, LayoutDashboard, PiggyBank, Printer, ShieldCheck, ThermometerSun, Wind,
} from "lucide-react";
import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import { COPEL_A4_TARIFFS, TECH_SOURCES } from "@/lib/diagnostic-data";
import { PRINT_WATERMARK } from "@/lib/print-watermark";
import { BeforeAfter, CostBreakdown, DataTable, OpportunityBars, SimpleBars, SpecificPowerMeter, StatTiles } from "@/components/prelaudo-charts";
import { explainPrelaudo, type ExplainedTopic } from "@/lib/prelaudo-explanations";
import { LEAK_TARGET_PERCENT, NETWORK_DROP_LIMIT_PERCENT, computePrelaudo, money, number, type Opportunity, type ReportId } from "@/lib/prelaudo-opportunities";
import { CONTROLS, POWER_CLASSES, PRESSURE_CLASSES, customProfile, estimatedProfile, type Control, type FlowUnit, type PressureClass } from "@/lib/compressor-profiles";
import { WhatsAppLink } from "@/components/site-v2";

type TabId = ReportId | "overview" | "savings" | "calc";
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

const REPORTS:Array<{id:TabId;label:string;short:string;icon:ComponentType<{size?:number;strokeWidth?:number}>}>=[
  {id:"flow",label:"Vazão e vazamentos",short:"Demanda, perdas e custo",icon:Wind},
  {id:"energy",label:"Energia",short:"kWh, potência e custo anual",icon:Bolt},
  {id:"pressure",label:"Pressão",short:"Queda de rede e oportunidade",icon:Gauge},
  {id:"quality",label:"Qualidade do ar",short:"PDP, contaminantes e evidências",icon:Droplets},
  {id:"overview",label:"Visão geral",short:"Custo, eficiência e economia",icon:LayoutDashboard},
  {id:"savings",label:"Oportunidades de economia",short:"Alertas e potencial somado",icon:PiggyBank},
  {id:"calc",label:"Memória de cálculo",short:"Todas as contas e fontes",icon:Calculator},
];

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
      <img src="/assets/unique/generated/diagnostic-hero.webp" alt="Imagem ilustrativa de instrumentos de diagnóstico industrial, criada por IA"/><span className="tc-image-credit">Imagem ilustrativa · IA</span>
      <div className="v2-dx-sensor v2-dx-sensor-a"><Activity size={17}/><span>Pressão</span><b>7,0 bar</b></div>
      <div className="v2-dx-sensor v2-dx-sensor-b"><Wind size={17}/><span>Vazão</span><b>116 cfm</b></div>
      <div className="v2-dx-sensor v2-dx-sensor-c"><Bolt size={17}/><span>Potência</span><b>26,16 kW</b></div>
    </div>
  </div></section>
}

function WarningTriangle(){
  return <svg className="v2-dx-warn-icon" viewBox="0 0 24 24" aria-hidden="true"><path className="v2-dx-warn-shape" d="M12 2.5 22.5 21h-21z"/><path className="v2-dx-warn-mark" d="M12 9v5.2M12 17.2v.3"/></svg>
}

function OpportunityAlert({item}:{item:Opportunity}){
  return <div className="v2-dx-opportunity">
    <WarningTriangle/>
    <div>
      <span>{item.saving!==null?"Possibilidade de economia identificada":"Possibilidade de melhoria identificada"}</span>
      <b>{item.title}</b>
      <p>{item.solution}</p>
    </div>
    {item.saving!==null&&<strong>{money(item.saving)}<small>/ano</small></strong>}
  </div>
}

function CalcMemory({lines}:{lines:string[]}){
  if(!lines.length) return null;
  return <div className="v2-dx-formula"><b>Memória de cálculo</b>{lines.map(line=><code key={line}>{line}</code>)}</div>
}

function Opportunities({items,report}:{items:Opportunity[];report:ReportId}){
  const list=items.filter(item=>item.report===report);
  if(!list.length) return null;
  return <div className="v2-dx-opportunities">{list.map(item=><OpportunityAlert key={item.id} item={item}/>)}</div>
}

function ExplainedTopics({topics,compact}:{topics:ExplainedTopic[];compact?:boolean}){
  return <div className={"pl-explain"+(compact?" is-compact":"")}>{topics.map(topic=><article key={topic.id}>
    <h4>{topic.title}</h4>
    <div className="pl-why"><b>Por que isso importa</b>{topic.why.map(text=><p key={text}>{text}</p>)}</div>
    {topic.alerts.map(alert=><div key={alert.id} className="pl-why pl-why-alert"><b><WarningTriangle/>{alert.title}{alert.saving!==null?" · "+money(alert.saving)+"/ano":""}</b>{alert.why.map(text=><p key={text}>{text}</p>)}{!compact&&<CalcMemory lines={alert.memory.filter(line=>!topic.memory.includes(line))}/>}</div>)}
    <CalcMemory lines={topic.memory}/>
  </article>)}</div>
}

export function DiagnosticReportStudio({aside}:{aside?:ReactNode}={}){
  const [active,setActive]=useState<TabId>("flow");
  const [industryId,setIndustryId]=useState("metal");
  const [powerKw,setPowerKw]=useState(22);
  const [pressureClass,setPressureClass]=useState<PressureClass>("8");
  const [control,setControl]=useState<Control>("loadUnload");
  const [useNameplate,setUseNameplate]=useState(false);
  const [nameplateFlow,setNameplateFlow]=useState(116);
  const [flowUnit,setFlowUnit]=useState<FlowUnit>("cfm");
  const [nameplateKw,setNameplateKw]=useState(26);
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
  const model=useMemo(()=>useNameplate?customProfile(nameplateFlow,flowUnit,nameplateKw,control):estimatedProfile(powerKw,pressureClass,control),[control,flowUnit,nameplateFlow,nameplateKw,powerKw,pressureClass,useNameplate]);
  const tariff=COPEL_A4_TARIFFS.find(item=>item.id===tariffId)??COPEL_A4_TARIFFS[0];
  const industry=INDUSTRIES[industryId];

  const result=useMemo(()=>computePrelaudo({model,control,tariff:tariff.value,hours,loadPercent,demandCfm,leakPercent:leakInputPercent,supplyBar,pointBar,targetBar,pdpMeasured,pdpRequired}),[control,demandCfm,hours,leakInputPercent,loadPercent,model,pdpMeasured,pdpRequired,pointBar,supplyBar,targetBar,tariff.value]);
  const opportunities=result.opportunities;
  const countFor=(report:ReportId)=>opportunities.filter(item=>item.report===report).length;

  const reportText=useMemo(()=>[
    "PRÉ-LAUDO TECAR 360","Indústria: "+industry.label,"Compressor: "+model.label+(model.estimated?" (estimativa por faixa de potência)":""),
    "Vazão de referência / demanda: "+number(model.flowCfm,0)+" / "+number(demandCfm,0)+" cfm",
    "Reserva calculada: "+number(result.reserveCfm,0)+" cfm","Potência média: "+number(result.averageKw,2)+" kW",
    "Energia anual: "+number(result.annualKwh,0)+" kWh","Custo anual: "+money(result.annualCost),
    "Vazamento: "+number(result.leakPercent,0)+"% da demanda ("+number(result.leakCfm,1)+" cfm) | "+money(result.leakCost)+"/ano",
    "Queda de pressão: "+number(result.pressureDrop,2)+" bar ("+number(result.pressureDropPercent,1)+"%)",
    "PDP medido / requerido: "+number(pdpMeasured,0)+" °C / "+number(pdpRequired,0)+" °C",
    "",
    "OPORTUNIDADES IDENTIFICADAS",
    ...(opportunities.length?opportunities.map(item=>"• "+item.title+(item.saving!==null?" — "+money(item.saving)+"/ano":"")):["Nenhuma com os dados informados."]),
    ...(result.totalSaving>0?["Potencial de economia: "+money(result.totalSaving)+"/ano"]:[]),
    "",
    "Resultado preliminar baseado em dados informados e referências públicas. Requer validação em campo."
  ].join("\n"),[demandCfm,industry.label,model,opportunities,result,pdpMeasured,pdpRequired]);

  const whatsapp="https://wa.me/5541996441330?text="+encodeURIComponent("Olá, gerei um pré-laudo no Diagnóstico TecAr 360.\n\n"+reportText);
  const copyReport=async()=>{if(typeof navigator==="undefined"||!navigator.clipboard)return;await navigator.clipboard.writeText(reportText);setCopied(true);window.setTimeout(()=>setCopied(false),1800)};

  const topics=useMemo(()=>explainPrelaudo(result,{model,control,hours,loadPercent,demandCfm,supplyBar,pointBar,targetBar,pdpMeasured,pdpRequired}),[control,demandCfm,hours,loadPercent,model,pdpMeasured,pdpRequired,pointBar,result,supplyBar,targetBar]);
  const loadCost=Math.max(0,result.annualCost-result.unloadCost);
  const energyBars=<SimpleBars title="Custo anual de energia por estado" subtitle="em carga produz ar; em alívio gira sem produzir" rows={[{label:"Em carga",value:loadCost,display:money(loadCost)},{label:"Em alívio",value:result.unloadCost,display:money(result.unloadCost),accent:result.unloadCost>0}]}/>;

  const overviewTiles=[
    {label:"Custo anual de energia",value:money(result.annualCost),note:number(result.annualKwh,0)+" kWh/ano"},
    {label:"Economia identificada",value:result.totalSaving>0?money(result.totalSaving):"—",note:result.annualCost>0&&result.totalSaving>0?number(result.totalSaving/result.annualCost*100,0)+"% do custo atual":"sem alertas financeiros",tone:result.totalSaving>0?"good" as const:undefined},
    {label:"Custo do ar comprimido",value:"R$ "+number(result.costPerM3,3)+"/m³",note:number(result.producedM3/1000,0)+" mil m³ por ano"},
    {label:"Emissões de CO₂",value:number(result.co2Kg/1000,1)+" t/ano",note:"rede elétrica brasileira"},
  ];

  const overviewCharts=<>
    <StatTiles tiles={overviewTiles}/>
    <div className="pl-grid">
      <CostBreakdown useful={result.usefulCost} waste={result.breakdown} total={result.annualCost}/>
      <div className="pl-stack-col">
        <SpecificPowerMeter value={model.specificKw100Cfm} band={result.specificBand}/>
        <BeforeAfter today={result.annualCost} after={result.costAfter}/>
      </div>
    </div>
    <OpportunityBars items={opportunities}/>
  </>;

  const savingsTotal=result.totalSaving>0&&<div className="v2-dx-total">
    <WarningTriangle/>
    <div><span>Potencial de economia identificado</span><strong>{money(result.totalSaving)}<small>/ano</small></strong><p>Trabalhando com a TecAr, sua operação pode recuperar esse valor. Consulte o atendimento técnico para validar os números em campo e montar o plano.</p></div>
  </div>;
  const alertList=opportunities.length
    ?<div className="v2-dx-opportunities">{opportunities.map(item=><OpportunityAlert key={item.id} item={item}/>)}</div>
    :<div className="v2-dx-finding ok"><ClipboardCheck size={20}/><p><b>Nenhuma oportunidade identificada com os dados informados.</b>A avaliação técnica pode encontrar perdas que os números estimados não mostram.</p></div>;
  const cta=<div className="v2-dx-cta"><p>Render mais e gastar menos com o seu ar comprimido. O atendimento técnico da TecAr valida esses números em campo e monta o plano.</p><WhatsAppLink href={whatsapp}><FileText size={17}/>Falar com o atendimento técnico</WhatsAppLink></div>;

  return <div className="v2-dx-studio">
    <div className={"v2-dx-studio-head"+(aside?" has-aside":"")}><div><span className="v2-kicker">PAINEL INTERATIVO</span><h2>Pré-laudo técnico em poucos minutos.</h2><p>Descreva o compressor e a operação. Os gráficos mudam em tempo real.</p></div>{aside}</div>
    <div className="v2-dx-context">
      <label><span>Tipo de indústria</span><select value={industryId} onChange={e=>setIndustryId(e.target.value)}>{Object.entries(INDUSTRIES).map(([id,item])=><option key={id} value={id}>{item.label}</option>)}</select></label>
      <label><span>Potência do compressor</span><select value={powerKw} disabled={useNameplate} onChange={e=>setPowerKw(Number(e.target.value))}>{POWER_CLASSES.map(item=><option key={item.kw} value={item.kw}>{number(item.kw,item.kw%1?1:0)} kW · {item.hp} hp</option>)}</select></label>
      <label><span>Tarifa de referência</span><select value={tariffId} onChange={e=>setTariffId(e.target.value)}>{COPEL_A4_TARIFFS.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
    </div>
    <div className="v2-dx-compressor">
      <div className="v2-dx-compressor-fields">
        <label><span>Pressão máxima</span><select value={pressureClass} disabled={useNameplate} onChange={e=>setPressureClass(e.target.value as PressureClass)}>{(Object.keys(PRESSURE_CLASSES) as PressureClass[]).map(id=><option key={id} value={id}>{PRESSURE_CLASSES[id].label}</option>)}</select></label>
        <label><span>Controle</span><select value={control} onChange={e=>setControl(e.target.value as Control)}>{(Object.keys(CONTROLS) as Control[]).map(id=><option key={id} value={id}>{CONTROLS[id].label}</option>)}</select></label>
        <label className="v2-dx-check"><input type="checkbox" checked={useNameplate} onChange={e=>setUseNameplate(e.target.checked)}/><span>Tenho a vazão e a potência da placa ou ficha técnica</span></label>
      </div>
      {useNameplate&&<div className="v2-dx-inputs v2-dx-inputs-three">
        <Input label="Vazão (FAD) do compressor" suffix={flowUnit==="cfm"?"cfm":"m³/min"} value={nameplateFlow} min={0} step={flowUnit==="cfm"?1:.1} onChange={setNameplateFlow}/>
        <label className="v2-dx-field"><span>Unidade da vazão</span><div><select value={flowUnit} onChange={e=>setFlowUnit(e.target.value as FlowUnit)}><option value="cfm">cfm</option><option value="m3min">m³/min</option></select></div></label>
        <Input label="Potência total em carga" suffix="kW" value={nameplateKw} min={0} step={.1} onChange={setNameplateKw}/>
      </div>}
      <div className="v2-dx-compressor-summary"><span>{model.basis}</span><b>{number(model.flowCfm,0)} cfm</b><b>{number(model.packageKw,1)} kW em carga</b><b>{number(model.noLoadKw,1)} kW em alívio</b><b>{number(model.specificKw100Cfm,1)} kW/100 cfm</b></div>
    </div>
    <div className="v2-dx-industry"><Factory size={24}/><div><b>{industry.label}</b><span>{industry.focus}</span></div><div className="v2-dx-industry-tags">{industry.risks.map(risk=><span key={risk}>{risk}</span>)}</div></div>

    <div className="v2-dx-layout">
      <nav className="v2-dx-tabs" aria-label="Relatórios do diagnóstico">{REPORTS.map(report=>{const Icon=report.icon;const count=report.id==="savings"?opportunities.length:report.id==="overview"||report.id==="calc"?0:countFor(report.id);return <button key={report.id} type="button" className={(active===report.id?"is-active":"")+(report.id==="savings"||report.id==="calc"?" is-savings":"")} onClick={()=>setActive(report.id)}><Icon size={20} strokeWidth={1.8}/><span><b>{report.label}</b><small>{report.id==="savings"&&result.totalSaving>0?money(result.totalSaving)+"/ano identificados":report.short}</small></span>{count>0?<span className="v2-dx-tab-alert" aria-label={count+" alerta(s)"}><WarningTriangle/>{count}</span>:<ArrowDownRight size={16}/>}</button>})}</nav>
      <div className="v2-dx-report" aria-live="polite">
        {active==="overview"&&<div className="v2-dx-report-panel">
          <div className="v2-dx-report-title"><LayoutDashboard/><div><span>VISÃO GERAL</span><h3>Quanto o seu ar comprimido custa e quanto pode render</h3></div></div>
          {overviewCharts}
          {cta}
        </div>}
        {active==="flow"&&<div className="v2-dx-report-panel">
          <div className="v2-dx-report-title"><Wind/><div><span>RELATÓRIO 01</span><h3>Vazão, demanda e vazamentos</h3></div></div>
          <div className="v2-dx-inputs v2-dx-inputs-three"><Input label="Demanda total da planta" suffix="cfm" value={demandCfm} min={0} onChange={setDemandCfm}/><Input label="Vazamento estimado" suffix="%" value={leakInputPercent} min={0} max={100} onChange={setLeakInputPercent}/><Input label="Horas pressurizadas no ano" suffix="h" value={hours} min={0} max={8760} onChange={v=>setHours(clamp(v,0,8760))}/></div>
          <StatTiles tiles={[{label:"Capacidade de referência",value:number(model.flowCfm,0)+" cfm"},{label:"Reserva nominal",value:number(result.reserveCfm,0)+" cfm",note:number(result.reservePercent,0)+"% da capacidade",tone:result.reserveCfm<0?"risk":undefined},{label:"Ar perdido em vazamentos",value:number(result.leakCfm,1)+" cfm",note:number(result.leakPercent,0)+"% da demanda",tone:result.leakPercent>=10?"risk":undefined},{label:"Custo dos vazamentos",value:money(result.leakCost),note:"por ano"}]}/>
          <div className="v2-dx-chart"><Meter label="Capacidade de referência" value={model.flowCfm} max={Math.max(model.flowCfm,demandCfm)} display={number(model.flowCfm,0)+" cfm"} tone="good"/><Meter label="Demanda total informada" value={demandCfm} max={Math.max(model.flowCfm,demandCfm)} display={number(demandCfm,0)+" cfm"} tone={demandCfm>model.flowCfm?"risk":"default"}/><Meter label="Parte perdida em vazamentos" value={result.leakCfm} max={Math.max(model.flowCfm,demandCfm)} display={number(result.leakCfm,1)+" cfm"} tone="risk"/></div>
          <Opportunities items={opportunities} report="flow"/>
        </div>}
        {active==="energy"&&<div className="v2-dx-report-panel">
          <div className="v2-dx-report-title"><Bolt/><div><span>RELATÓRIO 02</span><h3>Uso e custo de energia</h3></div></div>
          <div className="v2-dx-inputs v2-dx-inputs-three"><Input label="Horas de operação no ano" suffix="h" value={hours} min={0} max={8760} onChange={v=>setHours(clamp(v,0,8760))}/><Input label="Tempo estimado em carga" suffix="%" value={loadPercent} min={0} max={100} onChange={v=>setLoadPercent(clamp(v,0,100))}/><div className="v2-dx-readonly"><span>Tarifa aplicada</span><b>R$ {number(tariff.value,5)}/kWh</b></div></div>
          <StatTiles tiles={[{label:"Potência média",value:number(result.averageKw,1)+" kW"},{label:"Energia anual",value:number(result.annualKwh/1000,1)+" MWh"},{label:"Custo anual",value:money(result.annualCost)},{label:"Gasto em alívio",value:money(result.unloadCost),note:number(100-loadPercent,0)+"% do tempo sem produzir ar",tone:result.unloadCost>0&&control==="loadUnload"?"risk":undefined}]}/>
          <div className="v2-dx-visual-block"><b>Tempo do compressor</b><div className="v2-dx-load-track" role="img" aria-label={"Em carga "+number(loadPercent,0)+"%, em alívio "+number(100-loadPercent,0)+"%"}><i style={{width:loadPercent+"%"}}/><em style={{width:(100-loadPercent)+"%"}}/></div><div className="v2-dx-legend"><span><i/> Em carga {number(loadPercent,0)}%</span><span><i/> Em alívio {number(100-loadPercent,0)}%</span></div></div>
          {energyBars}
          <SpecificPowerMeter value={model.specificKw100Cfm} band={result.specificBand}/>
          <Opportunities items={opportunities} report="energy"/>
        </div>}
        {active==="pressure"&&<div className="v2-dx-report-panel">
          <div className="v2-dx-report-title"><Gauge/><div><span>RELATÓRIO 03</span><h3>Pressão, queda e oportunidade</h3></div></div>
          <div className="v2-dx-inputs v2-dx-inputs-three"><Input label="Saída do reservatório" suffix="bar" value={supplyBar} min={0} max={1000} step={.1} onChange={setSupplyBar}/><Input label="Ponto crítico de uso" suffix="bar" value={pointBar} min={0} max={1000} step={.1} onChange={setPointBar}/><Input label="Setpoint alvo" suffix="bar" value={targetBar} min={0} max={1000} step={.1} onChange={setTargetBar}/></div>
          <div className="v2-dx-pressure-line"><div><Gauge/><span>Origem</span><b>{number(supplyBar,1)} bar</b></div><i><em style={{width:clamp(100-result.pressureDropPercent,5,100)+"%"}}/></i><div><ArrowDownRight/><span>Ponto de uso</span><b>{number(pointBar,1)} bar</b></div></div>
          <StatTiles tiles={[{label:"Queda na rede",value:number(result.pressureDropPercent,1)+"%",note:number(result.pressureDrop,2)+" bar · referência até 10%",tone:result.pressureDropPercent>=NETWORK_DROP_LIMIT_PERCENT?"risk":undefined},{label:"Redução de setpoint",value:number(result.setpointReduction,2)+" bar",note:number(result.pressureSavingPercent,1)+"% de energia"},{label:"Economia possível",value:money(result.pressureSaving),note:"por ano"}]}/>
          <Opportunities items={opportunities} report="pressure"/>
        </div>}
        {active==="quality"&&<div className="v2-dx-report-panel">
          <div className="v2-dx-report-title"><Droplets/><div><span>RELATÓRIO 04</span><h3>Qualidade do ar e ponto de orvalho</h3></div></div>
          <div className="v2-dx-inputs"><Input label="PDP medido" suffix="°C" value={pdpMeasured} min={-200} max={200} onChange={setPdpMeasured}/><Input label="PDP requerido pelo processo" suffix="°C" value={pdpRequired} min={-200} max={200} onChange={setPdpRequired}/></div>
          <div className="v2-dx-visual-block"><b>Ponto de orvalho sob pressão (PDP)</b><div className="v2-dx-pdp-track"><span>−40 °C</span><div className="v2-dx-pdp-axis"><i style={{left:clamp((pdpMeasured+40)/80*100,0,100)+"%"}} title={"Medido: "+number(pdpMeasured,0)+" °C"}/><em style={{left:clamp((pdpRequired+40)/80*100,0,100)+"%"}} title={"Requerido: "+number(pdpRequired,0)+" °C"}/></div><span>+40 °C</span></div><div className="v2-dx-legend"><span><i/> Medido {number(pdpMeasured,0)} °C</span><span><i/> Requerido {number(pdpRequired,0)} °C</span></div></div>
          <div className="v2-dx-quality-grid"><article><Droplets/><span>Água</span><b>{result.pdpGap>0?"Investigar":"Dentro do informado"}</b><p>PDP, drenagem e secador.</p></article><article><ShieldCheck/><span>Óleo</span><b>Exige medição</b><p>Não se presume pelo tipo de compressor.</p></article><article><Activity/><span>Partículas</span><b>Exige medição</b><p>Filtros, rede e ponto de coleta.</p></article></div>
          <Opportunities items={opportunities} report="quality"/>
          <div className="v2-dx-measure-list"><span>Medições recomendadas para este setor</span>{industry.measurements.map(item=><b key={item}><ClipboardCheck size={15}/>{item}</b>)}</div>
        </div>}
        {active==="savings"&&<div className="v2-dx-report-panel">
          <div className="v2-dx-report-title"><PiggyBank/><div><span>RELATÓRIO 05</span><h3>Oportunidades de economia</h3></div></div>
          {savingsTotal}
          <OpportunityBars items={opportunities}/>
          {alertList}
          {cta}
        </div>}
        {active==="calc"&&<div className="v2-dx-report-panel">
          <div className="v2-dx-report-title"><Calculator/><div><span>MEMÓRIA DE CÁLCULO</span><h3>As contas e o porquê de cada resultado</h3></div></div>
          <ExplainedTopics topics={topics}/>
          <div className="v2-dx-report-evidence pl-limits"><b>Base e limites</b><span>Compressor: {model.basis}{model.estimated?" — valores típicos de compressores parafuso lubrificados; substitua pelos dados da placa para maior precisão":""}.</span><span>Tarifa: TE + TUSD de energia do subgrupo A4; demanda, tributos e bandeiras não incluídos. Pressão: cerca de 1% de energia a cada 0,14 bar (DOE). Meta de vazamento: {LEAK_TARGET_PERCENT}% (o DOE considera bem mantido abaixo de 10%).</span><span>As economias se sobrepõem em parte (corrigir vazamentos muda o tempo em alívio): o total é uma referência para priorizar e requer validação em campo.</span></div>
          <SourceLinks links={[TECH_SOURCES.cagiVerify,TECH_SOURCES.doe,TECH_SOURCES.copel,TECH_SOURCES.aneel,TECH_SOURCES.iso8573,TECH_SOURCES.irOptimization]}/>
        </div>}
      </div>
    </div>

    <section className="v2-dx-prelaudo">
      <div className="v2-dx-prelaudo-head"><div><span>PRÉ-LAUDO GERADO</span><h3>Resumo executivo</h3></div><div className="v2-dx-prelaudo-actions"><button type="button" onClick={copyReport}><Copy size={17}/>{copied?"Copiado":"Copiar"}</button><button type="button" onClick={()=>window.print()}><Printer size={17}/>Salvar em PDF</button><WhatsAppLink href={whatsapp}><FileText size={17}/>Enviar à TecAr</WhatsAppLink></div></div>
      <img className="v2-dx-print-watermark" src={PRINT_WATERMARK} alt="" aria-hidden="true"/>
      <div className="pl-summary">
        <div><span>Compressor</span><b>{model.label}</b></div>
        <div><span>Custo anual de energia</span><b>{money(result.annualCost)}</b></div>
        <div className={result.totalSaving>0?"is-saving":""}><span>Economia identificada</span><b>{result.totalSaving>0?money(result.totalSaving)+"/ano":"—"}</b></div>
        <div><span>Alertas</span><b>{opportunities.length}</b></div>
      </div>

      <div className="v2-dx-print-detail">
        <header className="pl-print-brand"><img src="/assets/tecar/logo-cropped.png" alt="TecAr Compressores"/><div><b>Pré-laudo TecAr 360</b><span>{industry.label} · gerado em tecarcompressores.com.br</span></div><img className="pl-print-mark" src="/assets/tecar/logo-ta-v1.svg" alt=""/></header>
        <section><h4>Visão geral</h4>{overviewCharts}</section>
        <section><h4>1 · Vazão e vazamentos</h4>
          <SimpleBars title="Ar disponível × ar usado" subtitle="cfm" rows={[{label:"Capacidade do compressor",value:model.flowCfm,display:number(model.flowCfm,0)+" cfm"},{label:"Demanda da planta",value:demandCfm,display:number(demandCfm,0)+" cfm",accent:demandCfm>model.flowCfm},{label:"Perdido em vazamentos",value:result.leakCfm,display:number(result.leakCfm,1)+" cfm",accent:true}]}/>
          <DataTable rows={[["Reserva de capacidade",number(result.reservePercent,0)+"%"],["Custo anual dos vazamentos",money(result.leakCost)]]}/>
          <Opportunities items={opportunities} report="flow"/>
        </section>
        <section><h4>2 · Energia</h4>
          {energyBars}
          <DataTable rows={[["Compressor",model.label],["Tempo em carga / em alívio",number(loadPercent,0)+"% / "+number(100-loadPercent,0)+"%"],["Energia anual",number(result.annualKwh,0)+" kWh"],["Tarifa",tariff.label]]}/>
          <Opportunities items={opportunities} report="energy"/>
        </section>
        <section><h4>3 · Pressão</h4>
          <SimpleBars title="Pressão na rede" subtitle="bar" rows={[{label:"Saída do reservatório",value:supplyBar,display:number(supplyBar,1)+" bar",accent:supplyBar>targetBar},{label:"Ponto crítico de uso",value:pointBar,display:number(pointBar,1)+" bar"},{label:"Necessário (alvo)",value:targetBar,display:number(targetBar,1)+" bar"}]}/>
          <DataTable rows={[["Queda na rede",number(result.pressureDropPercent,1)+"%"],["Economia possível no setpoint",money(result.pressureSaving)+"/ano"]]}/>
          <Opportunities items={opportunities} report="pressure"/>
        </section>
        <section><h4>4 · Qualidade do ar</h4>
          <DataTable rows={[["Ponto de orvalho medido / requerido",number(pdpMeasured,0)+" °C / "+number(pdpRequired,0)+" °C"],["Água",result.pdpGap>0?"Investigar":"Dentro do informado"],["Óleo e partículas","Exigem medição"],["Medições recomendadas",industry.measurements.join(" · ")]]}/>
          <Opportunities items={opportunities} report="quality"/>
        </section>
        <section><h4>5 · Oportunidades de economia</h4>{savingsTotal}<OpportunityBars items={opportunities}/><p className="v2-dx-print-cta">Fale com o atendimento técnico da TecAr: (41) 99644-1330 · tecarcompressores.com.br</p></section>
        <section className="pl-print-calc"><h4>6 · Entenda os resultados</h4><ExplainedTopics topics={topics} compact/></section>
        <p className="pl-print-foot">Pré-laudo preliminar, sem valor de certificação. Valores informados pelo usuário e referências públicas (CAGI, DOE, Copel/ANEEL, ISO 8573-1, BEN 2026); as economias se sobrepõem em parte e precisam de validação em campo pela TecAr.</p>
      </div>
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
