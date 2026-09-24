import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export type ProductItem = {
  name:string;
  image:string;
  summary:string;
  tag?:string;
  facts?:string[];
  source?:string;
};

export type ProductGroup = {
  id:string;
  label:string;
  intro?:string;
  items:ProductItem[];
};

export function ProductExplorer({groups,ctaLabel="Falar com a TecAr"}:{groups:ProductGroup[];ctaLabel?:string}){
  const [groupId,setGroupId]=useState(groups[0]?.id??"");
  const [selectedName,setSelectedName]=useState("");
  const group=useMemo(()=>groups.find(g=>g.id===groupId)??groups[0],[groups,groupId]);
  const selected=group?.items.find(i=>i.name===selectedName);

  const changeGroup=(id:string)=>{
    setGroupId(id);
    setSelectedName("");
  };

  if(!group) return null;

  return <div className="v2-product-explorer">
    {groups.length>1&&<div className="v2-product-tabs" role="tablist" aria-label="Famílias de produtos">
      {groups.map(g=><button key={g.id} type="button" role="tab" aria-selected={g.id===group.id} className={g.id===group.id?"is-active":""} onClick={()=>changeGroup(g.id)}>{g.label}</button>)}
    </div>}

    <div className="v2-product-explorer-head">
      <div><span>{groups.length>1?"FAMÍLIA":"PRODUTOS"}</span><h2>{group.label}</h2></div>
      {group.intro&&<p>{group.intro}</p>}
    </div>

    <div className="v2-product-cards" role="list">
      {group.items.map(item=><button key={item.name} type="button" role="listitem" aria-pressed={item.name===selectedName} className={item.name===selectedName?"is-selected":""} onClick={()=>setSelectedName(item.name===selectedName?"":item.name)}>
        <div className="v2-product-card-photo"><img src={item.image} alt={item.name} loading="lazy"/></div>
        <div className="v2-product-card-copy">{item.tag&&<span>{item.tag}</span>}<h3>{item.name}</h3><b>{item.name===selectedName?"Fechar −":"Abrir +"}</b></div>
      </button>)}
    </div>

    {selected&&<section className="v2-product-detail" aria-live="polite">
      <div className="v2-product-detail-photo"><img src={selected.image} alt={selected.name}/></div>
      <div className="v2-product-detail-copy">
        <button type="button" className="v2-product-detail-close" onClick={()=>setSelectedName("")} aria-label="Fechar resumo">×</button>
        {selected.tag&&<span>{selected.tag}</span>}
        <h2>{selected.name}</h2>
        <p>{selected.summary}</p>
        {!!selected.facts?.length&&<div className="v2-product-facts">{selected.facts.map(f=><b key={f}>{f}</b>)}</div>}
        <div className="v2-product-detail-actions"><a href="https://wa.me/5541996441330?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20TecAr." target="_blank" rel="noopener noreferrer" className="v2-primary">{ctaLabel}</a>{selected.source&&<a href={selected.source} target="_blank" rel="noopener noreferrer" className="v2-secondary">Ver fabricante</a>}</div>
      </div>
    </section>}
  </div>;
}
