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
  const group=useMemo(()=>groups.find(g=>g.id===groupId)??groups[0],[groups,groupId]);
  const [selectedName,setSelectedName]=useState(group?.items[0]?.name??"");
  const selected=(group?.items.find(i=>i.name===selectedName)??group?.items[0]) as ProductItem|undefined;

  const changeGroup=(id:string)=>{
    const next=groups.find(g=>g.id===id);
    setGroupId(id);
    setSelectedName(next?.items[0]?.name??"");
  };

  if(!group||!selected) return null;

  return <div className="v2-product-explorer">
    <div className="v2-product-tabs" role="tablist" aria-label="Famílias de produtos">
      {groups.map(g=><button key={g.id} type="button" role="tab" aria-selected={g.id===group.id} className={g.id===group.id?"is-active":""} onClick={()=>changeGroup(g.id)}>{g.label}</button>)}
    </div>

    <div className="v2-product-explorer-head">
      <div><span>FAMÍLIA</span><h2>{group.label}</h2></div>
      {group.intro&&<p>{group.intro}</p>}
    </div>

    <div className="v2-product-cards" role="list">
      {group.items.map(item=><button key={item.name} type="button" role="listitem" className={item.name===selected.name?"is-selected":""} onClick={()=>setSelectedName(item.name)}>
        <div className="v2-product-card-photo"><img src={item.image} alt={item.name} loading="lazy"/></div>
        <div className="v2-product-card-copy">{item.tag&&<span>{item.tag}</span>}<h3>{item.name}</h3><p>{item.summary}</p><b>Ver resumo +</b></div>
      </button>)}
    </div>

    <section className="v2-product-detail" aria-live="polite">
      <div className="v2-product-detail-photo"><img src={selected.image} alt={selected.name}/></div>
      <div className="v2-product-detail-copy">
        {selected.tag&&<span>{selected.tag}</span>}
        <h2>{selected.name}</h2>
        <p>{selected.summary}</p>
        {!!selected.facts?.length&&<div className="v2-product-facts">{selected.facts.map(f=><b key={f}>{f}</b>)}</div>}
        <div className="v2-product-detail-actions"><Link to="/contato" className="v2-primary">{ctaLabel}</Link>{selected.source&&<a href={selected.source} target="_blank" rel="noopener noreferrer" className="v2-secondary">Fonte oficial</a>}</div>
      </div>
    </section>
  </div>;
}
