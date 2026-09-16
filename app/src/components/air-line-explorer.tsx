import { useState } from "react";

const steps=[
  {id:"principal",label:"Rede principal",title:"Linha principal",text:"Distribui a maior vazão da planta. Diâmetro e traçado precisam limitar velocidade e perda de carga.",fact:"Base do sistema"},
  {id:"anel",label:"Anel",title:"Rede em anel",text:"Alimenta os pontos por mais de um caminho e ajuda a reduzir queda de pressão em plantas extensas.",fact:"Mais estabilidade"},
  {id:"descidas",label:"Descidas",title:"Descidas e ramais",text:"Levam o ar até cada área sem transformar a rede inteira em um gargalo.",fact:"Distribuição organizada"},
  {id:"pontos",label:"Pontos de uso",title:"Pontos de uso",text:"Conexões finais, válvulas e tratamento local devem respeitar a necessidade do processo.",fact:"Pressão onde importa"},
] as const;

export function AirLineExplorer(){
 const [id,setId]=useState<(typeof steps)[number]["id"]>("principal");
 const current=steps.find(s=>s.id===id)??steps[0];
 return <div className="v2-line-explorer">
   <div className="v2-line-tabs">{steps.map(s=><button key={s.id} type="button" className={s.id===id?"is-active":""} onClick={()=>setId(s.id)}>{s.label}</button>)}</div>
   <div className="v2-line-stage">
     <div className="v2-line-photo"><img src="/assets/products/line-aluminum.jpg" alt="Rede industrial em alumínio"/><span>{current.fact}</span></div>
     <div className="v2-line-copy"><small>ETAPA SELECIONADA</small><h2>{current.title}</h2><p>{current.text}</p><div className="v2-line-schematic" aria-hidden="true"><i className={id==="principal"?"active":""}/><i className={id==="anel"?"active":""}/><i className={id==="descidas"?"active":""}/><i className={id==="pontos"?"active":""}/></div></div>
   </div>
 </div>
}
