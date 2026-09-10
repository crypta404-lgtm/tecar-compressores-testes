import { useMemo, useState } from "react";

export function EnergyLossTool(){
  const [power,setPower]=useState(100);
  const [hours,setHours]=useState(16);
  const [days,setDays]=useState(250);
  const [tariff,setTariff]=useState(0.7);
  const [loss,setLoss]=useState(20);
  const annual=power*hours*days*tariff*(loss/100);
  return <div className="v2-tool">
    <div className="v2-tool-head"><span>Simulador de desperdício</span><strong>{annual.toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0})}<small>/ano</small></strong></div>
    <div className="v2-rangegrid">
      <label>Potência <b>{power} kW</b><input type="range" min="10" max="300" value={power} onChange={e=>setPower(Number(e.target.value))}/></label>
      <label>Horas/dia <b>{hours} h</b><input type="range" min="1" max="24" value={hours} onChange={e=>setHours(Number(e.target.value))}/></label>
      <label>Dias/ano <b>{days}</b><input type="range" min="50" max="365" value={days} onChange={e=>setDays(Number(e.target.value))}/></label>
      <label>Tarifa <b>R$ {tariff.toFixed(2)}</b><input type="range" min="0.3" max="2" step="0.05" value={tariff} onChange={e=>setTariff(Number(e.target.value))}/></label>
      <label>Perda estimada <b>{loss}%</b><input type="range" min="1" max="40" value={loss} onChange={e=>setLoss(Number(e.target.value))}/></label>
    </div>
    <p className="v2-tool-note">Estimativa simplificada de custo energético. O diagnóstico real depende de medições em campo.</p>
  </div>
}

export function DowntimeTool(){
  const [value,setValue]=useState(15000);
  const [hours,setHours]=useState(4);
  const loss=value*hours;
  return <div className="v2-tool v2-tool-compact">
    <div className="v2-tool-head"><span>Impacto de uma parada</span><strong>{loss.toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0})}</strong></div>
    <div className="v2-inputgrid"><label>Valor estimado de produção por hora<input type="number" min="0" value={value} onChange={e=>setValue(Number(e.target.value)||0)}/></label><label>Horas paradas<input type="number" min="0" value={hours} onChange={e=>setHours(Number(e.target.value)||0)}/></label></div>
    <p className="v2-tool-note">Ferramenta ilustrativa para visualizar risco operacional. Não representa cálculo contábil de lucro cessante.</p>
  </div>
}

export function MonitoringDemo(){
  const [mode,setMode]=useState<"normal"|"alerta">("normal");
  const data=useMemo(()=>mode==="normal"?[
    ["Pressão","7,4 bar",74],["Temperatura","71 °C",59],["Ponto de orvalho","+2 °C",36],["Energia","43,8 kW",55]
  ]:[
    ["Pressão","6,2 bar",62],["Temperatura","94 °C",90],["Ponto de orvalho","+9 °C",68],["Energia","58,1 kW",78]
  ],[mode]);
  return <div className={"v2-monitor-demo "+(mode==="alerta"?"is-alert":"")}>
    <div className="v2-monitor-top"><div><span>Exemplo visual</span><strong>COMPRESSOR 03</strong></div><div className="v2-segmented"><button className={mode==="normal"?"active":""} onClick={()=>setMode("normal")}>Normal</button><button className={mode==="alerta"?"active":""} onClick={()=>setMode("alerta")}>Simular alerta</button></div></div>
    <div className="v2-monitor-status"><i/><span>{mode==="normal"?"Operação dentro da faixa simulada":"Atenção: parâmetro fora da faixa simulada"}</span></div>
    <div className="v2-monitor-rows">{data.map(([label,value,pct])=><div className="v2-monitor-row" key={label}><div><span>{label}</span><b>{value}</b></div><div className="v2-bar"><i style={{width:pct+"%"}}/></div></div>)}</div>
    <p>Interface demonstrativa para explicar o conceito ao cliente. Não exibe dados reais de equipamentos.</p>
  </div>
}
