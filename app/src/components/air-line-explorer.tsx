import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { MARK_PATHS, MARK_VIEWBOX } from "@/lib/tecar-mark";

/*
 * "Explore sua rede": the photo has four hotspots. Choosing one zooms into the
 * photo and opens a TecAr technical manual over it: an open booklet in real CSS
 * 3D with the part of the network rising from the pages like a pop-up, drawn
 * in technical line art with numbered callouts. The visitor turns it with the
 * mouse (hover tilts, drag rotates further), with touch drag or with the arrow
 * keys. Clicking a number, or a part in the side panel, highlights that part
 * and the side panel explains what it is for.
 *
 * No 3D library: transforms only, so it stays light and renders on the server.
 * Reduced motion: no opening animation and no hover tilt.
 */

type Part = { name: string; role: string };
type Step = {
  id: string; label: string; title: string; purpose: string; text: string;
  parts: [Part, Part, Part, Part];
  /** callout positions on the drawing, in % of the figure */
  callouts: [number, number][];
  checks: string[]; x: number; y: number;
};

const steps: Step[] = [
 {id:"principal",label:"Rede principal",title:"O caminho da geração à fábrica",purpose:"Transportar o ar da central até os setores.",
  text:"A rede principal leva o ar da casa de compressores até as áreas produtivas. Um diâmetro adequado evita que a tubulação limite a capacidade dos equipamentos.",
  parts:[
   {name:"Tubo de alumínio",role:"Conduz o ar com parede interna lisa, sem corrosão e com baixa perda de pressão."},
   {name:"Suporte de fixação",role:"Sustenta a rede no alinhamento certo e absorve vibração e dilatação."},
   {name:"União de conexão",role:"Junta os trechos sem solda e permite alterar o layout depois."},
   {name:"Caimento no sentido do fluxo",role:"Uma leve inclinação leva o condensado até os pontos de dreno."},
  ],
  callouts:[[86,19],[42,6],[56,37],[74,42]],
  checks:["Dimensionar diâmetro pela vazão e distância.","Prever expansão e acesso para manutenção.","Avaliar pressão e vazão nos horários de pico."],x:16,y:28},
 {id:"anel",label:"Anel",title:"Distribuição por mais de um caminho",purpose:"Distribuir o ar por dois caminhos.",
  text:"O circuito em anel alimenta cada setor por dois lados. Quando um setor consome muito, o ar chega pelos dois caminhos e a pressão oscila menos.",
  parts:[
   {name:"Anel fechado",role:"Fecha a rede em circuito para que o ar chegue a cada ponto por dois lados."},
   {name:"Válvula de isolamento",role:"Isola um trecho para manutenção sem parar a fábrica inteira."},
   {name:"Alimentação da central",role:"Entrada do ar que vem dos compressores, secadores e filtros."},
   {name:"Fluxo nos dois sentidos",role:"O ar percorre o menor caminho até o consumo, reduzindo a queda de pressão."},
  ],
  callouts:[[30,9],[60,8],[17,40],[28,92]],
  checks:["Distribuir os pontos de consumo ao longo do anel.","Prever válvulas de isolamento por trecho.","Verificar gargalos antes de ampliar a produção."],x:37,y:56},
 {id:"descidas",label:"Descidas",title:"Ar disponível em cada setor",purpose:"Levar o ar da rede até cada setor.",
  text:"As descidas conectam a rede às áreas produtivas. A saída por cima da tubulação impede que o condensado escorra para as máquinas.",
  parts:[
   {name:"Saída por cima",role:"O ramal sai pelo topo da rede (pescoço de ganso), longe da água que corre no fundo do tubo."},
   {name:"Válvula de isolamento",role:"Permite manutenção em um setor sem despressurizar a rede."},
   {name:"Tomada lateral",role:"Leva o ar até a máquina acima do ponto baixo da descida."},
   {name:"Dreno no ponto baixo",role:"Recolhe e elimina o condensado que desce pela tubulação."},
  ],
  callouts:[[61,4],[67,40],[84,69],[69,92]],
  checks:["Dimensionar ramais pelo consumo local.","Planejar drenagem e pontos de isolamento.","Manter conexões acessíveis para inspeção."],x:58,y:28},
 {id:"pontos",label:"Pontos de uso",title:"Qualidade onde o ar é utilizado",purpose:"Entregar o ar limpo e na pressão certa.",
  text:"O conjunto do ponto de uso entrega o ar nas condições que a ferramenta, a máquina ou o processo pedem.",
  parts:[
   {name:"Filtro",role:"Retém partículas e água antes do equipamento."},
   {name:"Regulador com manômetro",role:"Ajusta a pressão de trabalho: nem mais, nem menos que o necessário."},
   {name:"Lubrificador",role:"Adiciona óleo na medida certa, só quando a ferramenta exige."},
   {name:"Engate rápido",role:"Conecta e desconecta mangueiras com segurança e sem vazamento."},
  ],
  callouts:[[24,12],[53,6],[71,12],[95,77]],
  checks:["Definir filtragem conforme a aplicação.","Ajustar pressão de trabalho no ponto de uso.","Inspecionar mangueiras, conexões e vazamentos."],x:79,y:56},
];

/* ---- technical drawings (line art). data-part ties each element to a callout. ---- */
const Arrow = ({ x, y, r = 0 }: { x: number; y: number; r?: number }) => <path className="alm-flow" d="M-5 -4 L1 0 L-5 4" transform={`translate(${x} ${y}) rotate(${r})`} />;
const Valve = ({ x, y, r = 0 }: { x: number; y: number; r?: number }) => <g transform={`translate(${x} ${y}) rotate(${r})`}><path className="alm-solid" d="M-9 -7 L9 7 L9 -7 L-9 7 Z" /><path className="alm-line" d="M0 0 V-13 M-6 -13 H6" /></g>;

const drawings: Record<string, ReactNode> = {
  principal: <>
    <path className="alm-hatch" d="M96 18 H352" /><path className="alm-hatch-ticks" d="M100 18 l-6 -8 M120 18 l-6 -8 M140 18 l-6 -8 M160 18 l-6 -8 M180 18 l-6 -8 M200 18 l-6 -8 M220 18 l-6 -8 M240 18 l-6 -8 M260 18 l-6 -8 M280 18 l-6 -8 M300 18 l-6 -8 M320 18 l-6 -8 M340 18 l-6 -8" />
    <g className="alm-box"><rect x="14" y="98" width="66" height="96" rx="5" /><rect x="24" y="110" width="20" height="14" rx="2" /><path d="M24 140 H70 M24 150 H70 M24 160 H70 M24 170 H70" /></g>
    <g data-part="1"><path className="alm-pipe" d="M60 98 V62 L344 72" /><path className="alm-pipe-hl" d="M57 96 V60 L344 69.5" /></g>
    <g data-part="2"><path className="alm-line" d="M150 18 V61 M250 18 V65" /><circle className="alm-line" cx="150" cy="65.5" r="7.5" /><circle className="alm-line" cx="250" cy="69" r="7.5" /></g>
    <g data-part="3"><rect className="alm-solid" x="194" y="58" width="12" height="18" rx="2" transform="rotate(2 200 67)" /></g>
    <g data-part="4"><path className="alm-dim" d="M280 92 L344 98 M280 92 H344" /><text className="alm-dim-text" x="300" y="112">≈ 1%</text></g>
    <Arrow x={110} y={50} r={2} /><Arrow x={300} y={57} r={2} />
  </>,
  anel: <>
    <g className="alm-box"><rect x="10" y="98" width="40" height="50" rx="4" /><path d="M18 112 H42 M18 122 H42 M18 132 H42" /></g>
    <g data-part="1"><path className="alm-pipe" d="M72 42 H310 V196 H72 Z" /><path className="alm-pipe-hl" d="M72 39.5 H307.5" /></g>
    <g data-part="3"><path className="alm-pipe" d="M50 122 H72" /></g>
    <g data-part="2"><Valve x={191} y={42} /><Valve x={310} y={122} r={90} /><Valve x={191} y={196} /></g>
    <path className="alm-line" d="M120 42 V24 M250 42 V24 M120 196 V214 M250 196 V214" /><circle className="alm-solid" cx="120" cy="20" r="4" /><circle className="alm-solid" cx="250" cy="20" r="4" /><circle className="alm-solid" cx="120" cy="218" r="4" /><circle className="alm-solid" cx="250" cy="218" r="4" />
    <g data-part="4"><Arrow x={100} y={34} /><Arrow x={290} y={34} /><Arrow x={100} y={204} /><Arrow x={290} y={204} /><Arrow x={64} y={76} r={-90} /><Arrow x={64} y={168} r={90} /></g>
  </>,
  descidas: <>
    <g data-part="1"><path className="alm-pipe" d="M20 66 H340" /><path className="alm-pipe-hl" d="M20 63.5 H340" /><path className="alm-pipe" d="M150 60 V30 Q150 18 162 18 H200 Q212 18 212 30 V214" /></g>
    <path className="alm-water" d="M30 71 H330" />
    <g data-part="2"><Valve x={212} y={100} r={90} /></g>
    <g data-part="3"><path className="alm-pipe" d="M212 150 H290" /><rect className="alm-solid" x="290" y="142" width="18" height="16" rx="3" /><path className="alm-line" d="M308 150 H330" /></g>
    <g data-part="4"><path className="alm-solid" d="M202 214 H222 L216 226 H208 Z" /><path className="alm-water-drop" d="M212 232 q-4 6 0 9 q4 -3 0 -9" /></g>
    <Arrow x={60} y={56} /><Arrow x={290} y={56} /><Arrow x={212} y={130} r={90} />
  </>,
  pontos: <>
    <path className="alm-pipe" d="M14 58 H296" /><path className="alm-pipe-hl" d="M14 55.5 H296" />
    <g data-part="1"><rect className="alm-solid" x="66" y="44" width="40" height="28" rx="4" /><path className="alm-glass" d="M72 72 H100 V128 Q100 142 86 142 Q72 142 72 128 Z" /><path className="alm-line" d="M74 118 H98" /><path className="alm-solid" d="M82 142 H90 V152 H82 Z" /></g>
    <g data-part="2"><rect className="alm-solid" x="140" y="44" width="40" height="28" rx="4" /><circle className="alm-glass" cx="160" cy="24" r="14" /><path className="alm-line" d="M160 24 L168 16 M160 38 V44" /><path className="alm-solid" d="M152 72 H168 V96 H152 Z" /></g>
    <g data-part="3"><rect className="alm-solid" x="214" y="44" width="40" height="28" rx="4" /><path className="alm-glass" d="M220 72 H248 V124 Q248 138 234 138 Q220 138 220 124 Z" /><path className="alm-oil" d="M222 108 H246 V124 Q246 136 234 136 Q222 136 222 124 Z" /></g>
    <g data-part="4"><path className="alm-hose" d="M296 58 Q336 58 330 110 Q326 150 312 176" /><rect className="alm-solid" x="300" y="176" width="22" height="16" rx="3" transform="rotate(20 311 184)" /></g>
    <Arrow x={40} y={50} /><Arrow x={124} y={50} /><Arrow x={198} y={50} />
  </>,
};

const DEFAULT = { rx: 54, ry: -16 };

export function AirLineExplorer(){
 const [selected,setSelected]=useState<number|null>(null);
 const [part,setPart]=useState(0);
 const current=selected===null?null:steps[selected];
 const rig=useRef<HTMLDivElement>(null);
 const drag=useRef<{x:number;y:number;rx:number;ry:number}|null>(null);
 const pose=useRef({...DEFAULT});

 const apply=(rx:number,ry:number,fast=false)=>{
  pose.current={rx:Math.max(20,Math.min(72,rx)),ry:Math.max(-75,Math.min(75,ry))};
  const el=rig.current; if(!el) return;
  el.style.setProperty("--alm-rx",`${pose.current.rx}deg`); el.style.setProperty("--alm-ry",`${pose.current.ry}deg`);
  el.dataset.fast=fast?"true":"false";
 };
 useEffect(()=>{ setPart(0); apply(DEFAULT.rx,DEFAULT.ry); },[selected]);

 const reduced=()=>typeof window!=="undefined"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const onMove=(e:PointerEvent<HTMLDivElement>)=>{
  const box=e.currentTarget.getBoundingClientRect();
  if(drag.current){ apply(drag.current.rx-(e.clientY-drag.current.y)*0.25, drag.current.ry+(e.clientX-drag.current.x)*0.35, true); return; }
  if(e.pointerType!=="mouse"||reduced()) return;
  const nx=(e.clientX-box.left)/box.width-.5, ny=(e.clientY-box.top)/box.height-.5;
  apply(DEFAULT.rx-ny*18, DEFAULT.ry+nx*44);
 };
 const onDown=(e:PointerEvent<HTMLDivElement>)=>{ if((e.target as HTMLElement).closest("button")) return; drag.current={x:e.clientX,y:e.clientY,...pose.current}; e.currentTarget.setPointerCapture(e.pointerId); };
 const onUp=()=>{ drag.current=null; };
 const onLeave=()=>{ if(!drag.current) apply(DEFAULT.rx,DEFAULT.ry); };
 const onKey=(e:KeyboardEvent<HTMLDivElement>)=>{
  const k={ArrowLeft:[0,-8],ArrowRight:[0,8],ArrowUp:[-5,0],ArrowDown:[5,0]}[e.key];
  if(k){ e.preventDefault(); apply(pose.current.rx+k[0],pose.current.ry+k[1]); }
  if(e.key==="Escape") setSelected(null);
 };

 return <div className="v2-line-explorer"><div className="v2-line-stage" data-open={current?"true":"false"}>
 <div className="v2-line-photo"><div className="v2-line-zoom" style={{transform:current?"scale(1.9)":"scale(1)",transformOrigin:current?`${current.x}% ${current.y}%`:"50% 50%"}}>
 <img src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,fit=crop/YZ9EgGEK8zh4Pjl4/piping-application-6-1200x800-1-mePg6NWzlRFonDzk.jpg" alt="Rede industrial em alumínio com quatro pontos de exploração" loading="lazy"/>
 <div className="v2-line-hotspots" aria-label="Etapas da distribuição">{steps.map((s,i)=><button key={s.id} type="button" aria-label={`${i+1}. ${s.label}`} aria-pressed={selected===i} aria-controls="air-line-manual" className={selected===i?"is-active":""} style={{left:`${s.x}%`,top:`${s.y}%`}} onClick={()=>setSelected(i)}><i>{i+1}</i><span>{s.label}</span></button>)}</div></div>

 {current&&<div key={current.id} className="alm-scene" style={{["--alm-ox" as string]:`${current.x}%`,["--alm-oy" as string]:`${current.y}%`}}
   tabIndex={0} role="group" aria-label={`Manual 3D: ${current.label}. Arraste ou use as setas para girar.`}
   onPointerMove={onMove} onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={onUp} onPointerLeave={onLeave} onKeyDown={onKey}>
   <div className="alm-rig" ref={rig}>
    <div className="alm-book">
     <div className="alm-page alm-page-left">
      <header><span>TecAr · Guia da rede de ar</span><b>{String(selected!+1).padStart(2,"0")}/04</b></header>
      <ol>{current.parts.map((p,i)=><li key={p.name} data-active={part===i+1?"true":undefined}><i>{i+1}</i>{p.name}</li>)}</ol>
     </div>
     <div className="alm-page alm-page-right">
      <header><span>Fig. {String(selected!+1).padStart(2,"0")}</span><b>{current.label}</b></header>
      <p>{current.purpose}</p>
      <svg className="alm-mark" viewBox={MARK_VIEWBOX} aria-hidden="true">{MARK_PATHS.map((m)=><path key={m.d.slice(0,24)} data-tone={m.tone} d={m.d}/>)}</svg>
     </div>
     <div className="alm-popup" data-active={part||undefined}>
      <div className="alm-card"><div className="alm-fig"><svg viewBox="0 0 360 250" role="img" aria-label={`Desenho técnico: ${current.label}`}>{drawings[current.id]}</svg>
      <div className="alm-callouts">{current.callouts.map(([x,y],i)=><button key={i} type="button" style={{left:`${x}%`,top:`${y}%`}} aria-pressed={part===i+1} aria-label={`${i+1}. ${current.parts[i].name}`} onClick={()=>setPart(part===i+1?0:i+1)}>{i+1}</button>)}</div>
      </div></div>
     </div>
    </div>
   </div>
   <p className="alm-hint" aria-hidden="true">Arraste para girar · clique nos números</p>
 </div>}
 {current&&<button type="button" className="v2-line-reset" onClick={()=>setSelected(null)}>− Visão completa</button>}</div>

 <div className="v2-line-copy" id="air-line-manual" aria-live="polite"><small>GUIA DA REDE DE AR</small><h2>{current?.title??"Explore sua rede."}</h2>
 {current?<>
  <strong>{current.purpose}</strong>
  <p>{current.text}</p>
  <ol className="alm-parts">{current.parts.map((p,i)=><li key={p.name}><button type="button" aria-pressed={part===i+1} onClick={()=>setPart(part===i+1?0:i+1)}><i>{i+1}</i><span><b>{p.name}</b>{part===i+1&&<em>{p.role}</em>}</span></button></li>)}</ol>
  <details className="alm-checks"><summary>O que avaliar no projeto</summary><ul>{current.checks.map(check=><li key={check}>{check}</li>)}</ul></details>
  <a className="tc-text-link" href={`https://wa.me/5541996441330?text=${encodeURIComponent('Olá, gostaria de avaliar '+current.label.toLowerCase()+' da minha rede de ar.')}`} target="_blank" rel="noopener noreferrer">Avaliar esta etapa com a TecAr ↗</a>
 </>:<p>Selecione um dos quatro pontos. A imagem se aproxima e abre o manual daquela etapa, com cada peça e para que ela serve.</p>}
 <div className="v2-line-tabs">{steps.map((s,i)=><button key={s.id} type="button" aria-pressed={selected===i} aria-controls="air-line-manual" className={selected===i?"is-active":""} onClick={()=>setSelected(i)}>{i+1}. {s.label}</button>)}</div></div></div></div>
}
