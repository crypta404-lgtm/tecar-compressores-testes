import { useMemo, useState } from "react";
import { CAGI_UP6S, COPEL_A4_TARIFFS, TECH_SOURCES } from "@/lib/diagnostic-data";

const money=(value:number)=>value.toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0});
const number=(value:number,digits=0)=>value.toLocaleString("pt-BR",{maximumFractionDigits:digits,minimumFractionDigits:digits});
const limitedNumber=(raw:string)=>{
  if(raw.length>6 || /[eE+]/.test(raw)) return null;
  if(raw==="") return 0;
  const next=Number(raw);
  return Number.isFinite(next)?next:null;
};

export function EnergyLossTool(){
  const [modelId,setModelId]=useState("up6s-30-125");
  const [hours,setHours]=useState(4000);
  const [tariffId,setTariffId]=useState("a4-offpeak");
  const model=CAGI_UP6S.find(x=>x.id===modelId) ?? CAGI_UP6S[4];
  const tariff=COPEL_A4_TARIFFS.find(x=>x.id===tariffId) ?? COPEL_A4_TARIFFS[0];
  const annualKwh=(model.packageKw ?? 0)*hours;
  const annual=annualKwh*tariff.value;
  return <div className="v2-tool v2-tool-evidence">
    <div className="v2-tool-head"><span>Referência anual de energia</span><strong>{money(annual)}<small>/ano</small></strong></div>
    <div className="v2-evidence-badge">Cálculo reproduzível: potência total do pacote CAGI × horas informadas × tarifa regulatória</div>
    <div className="v2-inputgrid v2-inputgrid-stack">
      <label>Compressor verificado<select value={modelId} onChange={e=>setModelId(e.target.value)}>{CAGI_UP6S.map(x=><option key={x.id} value={x.id}>{x.model} · {x.hp} hp · {x.flowCfm} cfm</option>)}</select></label>
      <label>Horas reais de operação no ano<input type="number" min="1" max="8760" maxLength={6} value={hours} onChange={e=>{const next=limitedNumber(e.target.value);if(next!==null)setHours(Math.min(8760,Math.max(0,next)))}}/></label>
      <label>Referência tarifária<select value={tariffId} onChange={e=>setTariffId(e.target.value)}>{COPEL_A4_TARIFFS.map(x=><option key={x.id} value={x.id}>{x.label} · R$ {x.value.toFixed(5)}/kWh</option>)}</select></label>
    </div>
    <div className="v2-tool-facts"><span><b>{number(model.packageKw ?? 0,2)} kW</b>entrada total em plena carga</span><span><b>{number(annualKwh)} kWh</b>energia anual calculada</span><span><b>{number(model.specificKw100Cfm ?? 0,2)}</b>kW/100 cfm CAGI</span></div>
    <p className="v2-tool-note">Não é uma simulação da fatura. A referência ANEEL usada aqui considera apenas TE + TUSD de energia do subgrupo A4; demanda, tributos, bandeiras e demais itens não entram no resultado.</p>
    <details className="v2-source"><summary>Base técnica e fontes</summary><p>{model.sourceLabel}. A potência usada é a entrada total do pacote no ponto de ensaio informado na ficha, não uma conversão de HP.</p><a href={model.sourceUrl} target="_blank" rel="noreferrer">Ficha CAGI do modelo</a><a href={TECH_SOURCES.copel.url} target="_blank" rel="noreferrer">Copel: tarifas vigentes</a><a href={TECH_SOURCES.aneel.url} target="_blank" rel="noreferrer">ANEEL: base tarifária oficial</a></details>
  </div>
}

export function DowntimeTool(){
  const [value,setValue]=useState(15000);
  const [hours,setHours]=useState(4);
  const total=value*hours;
  return <div className="v2-tool v2-tool-compact">
    <div className="v2-tool-head"><span>Impacto informado pela própria operação</span><strong>{money(total)}</strong></div>
    <div className="v2-inputgrid"><label>Valor atribuído pela sua empresa a 1 h parada<input type="number" min="0" max="999999" maxLength={6} value={value} onChange={e=>{const next=limitedNumber(e.target.value);if(next!==null)setValue(Math.max(0,next))}}/></label><label>Horas paradas<input type="number" min="0" max="999999" maxLength={6} value={hours} onChange={e=>{const next=limitedNumber(e.target.value);if(next!==null)setHours(Math.max(0,next))}}/></label></div>
    <p className="v2-tool-note">Aqui não existe taxa de mercado: o valor por hora é fornecido pelo cliente. A ferramenta apenas multiplica os dois dados e não representa cálculo contábil de lucro cessante.</p>
  </div>
}

export function MonitoringDemo(){
  const [mode,setMode]=useState<"normal"|"alerta">("normal");
  const data=useMemo(()=>mode==="normal"?[["Pressão","7,4 bar",74],["Temperatura","71 °C",59],["Ponto de orvalho","+2 °C",36],["Energia","43,8 kW",55]]:[["Pressão","6,2 bar",62],["Temperatura","94 °C",90],["Ponto de orvalho","+9 °C",68],["Energia","58,1 kW",78]],[mode]);
  return <div className={"v2-monitor-demo "+(mode==="alerta"?"is-alert":"")}>
    <div className="v2-monitor-top"><div><span>Exemplo visual</span><strong>COMPRESSOR 03</strong></div><div className="v2-segmented"><button className={mode==="normal"?"active":""} onClick={()=>setMode("normal")}>Normal</button><button className={mode==="alerta"?"active":""} onClick={()=>setMode("alerta")}>Simular alerta</button></div></div>
    <div className="v2-monitor-status"><i/><span>{mode==="normal"?"Operação dentro da faixa simulada":"Atenção: parâmetro fora da faixa simulada"}</span></div>
    <div className="v2-monitor-rows">{data.map(([label,value,pct])=><div className="v2-monitor-row" key={String(label)}><div><span>{label}</span><b>{value}</b></div><div className="v2-bar"><i style={{width:pct+"%"}}/></div></div>)}</div>
    <p>Esta interface continua deliberadamente demonstrativa. Ela explica monitoramento remoto, mas não apresenta leituras reais de um cliente.</p>
  </div>
}
