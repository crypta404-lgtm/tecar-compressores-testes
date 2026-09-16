import { useState } from "react";

const steps=[
  {id:"principal",label:"Rede principal",title:"Linha principal",text:"Leva a maior vazão da planta. O diâmetro correto reduz velocidade e perda de carga.",fact:"Base da distribuição"},
  {id:"anel",label:"Anel",title:"Rede em anel",text:"Alimenta setores por mais de um caminho e ajuda a estabilizar a pressão em plantas extensas.",fact:"Mais estabilidade"},
  {id:"descidas",label:"Descidas",title:"Descidas e ramais",text:"Distribuem o ar por área sem transformar a linha principal em gargalo.",fact:"Distribuição por setor"},
  {id:"pontos",label:"Pontos de uso",title:"Pontos de uso",text:"Válvulas, conexões e tratamento final entregam o ar onde o processo realmente precisa.",fact:"Pressão no processo"},
] as const;

export function AirLineExplorer(){
 const [id,setId]=useState<(typeof steps)[number]["id"]>("principal");
 const current=steps.find(s=>s.id===id)??steps[0];
 return <div className="v2-line-explorer">
   <div className="v2-line-stage">
     <div className="v2-line-photo">
       <img src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,fit=crop/YZ9EgGEK8zh4Pjl4/piping-application-6-1200x800-1-mePg6NWzlRFonDzk.jpg" alt="Rede industrial em alumínio"/>
       <div className="v2-line-hotspots" aria-label="Partes da rede">
         {steps.map((s,index)=><button key={s.id} type="button" className={s.id===id?"is-active":""} style={{left:`${16+index*21}%`,top:`${28+(index%2)*28}%`}} onClick={()=>setId(s.id)}><i>{index+1}</i><span>{s.label}</span></button>)}
       </div>
     </div>
     <div className="v2-line-copy"><small>SELECIONADO</small><h2>{current.title}</h2><p>{current.text}</p><strong>{current.fact}</strong><div className="v2-line-tabs">{steps.map(s=><button key={s.id} type="button" className={s.id===id?"is-active":""} onClick={()=>setId(s.id)}>{s.label}</button>)}</div></div>
   </div>
 </div>
}
