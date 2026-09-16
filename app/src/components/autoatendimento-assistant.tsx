import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";

type Result = {
  severity:"baixo"|"atencao"|"parar";
  headline:string;
  equipment:{brand:string;model:string;confidence:"baixa"|"media"|"alta";evidence:string};
  likely_causes:{title:string;reason:string;confidence:"baixa"|"media"|"alta"}[];
  safe_checks:{title:string;instruction:string}[];
  stop_conditions:string[];
  recommendation:string;
  service_route:"manutencao"|"engenharia"|"pecas"|"monitoramento"|"orientacao";
  follow_up_questions:string[];
  sources:{title:string;url:string;note:string}[];
  disclaimer:string;
};

type Photo = { name:string; data:string };

async function compressImage(file:File):Promise<Photo>{
  if(!/^image\/(jpeg|png|webp)$/i.test(file.type)) throw new Error("Use JPG, PNG ou WebP.");
  if(file.size>8_000_000) throw new Error("Cada foto pode ter no máximo 8 MB.");
  const src=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error("Falha ao ler a imagem."));reader.readAsDataURL(file)});
  const image=await new Promise<HTMLImageElement>((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error("Imagem inválida."));img.src=src});
  const max=1280,scale=Math.min(1,max/Math.max(image.width,image.height));
  const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));
  const ctx=canvas.getContext("2d");if(!ctx) throw new Error("Não foi possível preparar a imagem.");ctx.drawImage(image,0,0,canvas.width,canvas.height);
  return {name:file.name.slice(0,80),data:canvas.toDataURL("image/jpeg",.78)};
}

const routeHref:Record<Result["service_route"],string>={manutencao:"/manutencao",engenharia:"/engenharia",pecas:"/contato",monitoramento:"/tecar-connect",orientacao:"/contato"};
const routeLabel:Record<Result["service_route"],string>={manutencao:"Manutenção TecAr",engenharia:"Engenharia TecAr",pecas:"Consultar peças",monitoramento:"TecAr Connect",orientacao:"Falar com a TecAr"};

export function AutoatendimentoAssistant(){
  const [brand,setBrand]=useState("");
  const [model,setModel]=useState("");
  const [symptom,setSymptom]=useState("");
  const [context,setContext]=useState("");
  const [readings,setReadings]=useState("");
  const [photos,setPhotos]=useState<Photo[]>([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [result,setResult]=useState<Result|null>(null);
  const [aiActive,setAiActive]=useState<boolean|null>(null);
  useEffect(()=>{let alive=true;fetch("/api/autoatendimento/status").then(r=>r.json()).then(data=>{if(alive)setAiActive(Boolean(data?.active))}).catch(()=>{if(alive)setAiActive(false)});return()=>{alive=false}},[]);
  const canAnalyze=useMemo(()=>symptom.trim().length>=10&&!loading&&aiActive===true,[symptom,loading,aiActive]);

  const addPhotos=async(files:FileList|null)=>{
    if(!files) return;
    setError("");
    const remaining=2-photos.length;
    if(remaining<=0){setError("Envie no máximo duas fotos por análise.");return}
    try{
      const next:Photo[]=[];
      for(const file of Array.from(files).slice(0,remaining)) next.push(await compressImage(file));
      setPhotos(prev=>[...prev,...next]);
    }catch(e){setError(e instanceof Error?e.message:"Não foi possível preparar a foto.")}
  };

  const analyze=async()=>{
    if(!canAnalyze) return;
    setLoading(true);setError("");setResult(null);
    try{
      const response=await fetch("/api/autoatendimento",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({brand,model,symptom,context,readings,images:photos.map(p=>p.data)})});
      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(data?.error||"Não foi possível concluir a análise.");
      setResult(data.result as Result);
    }catch(e){setError(e instanceof Error?e.message:"Não foi possível concluir a análise.")}
    finally{setLoading(false)}
  };

  return <div className="v2-self-service">
    <section className="v2-self-form" aria-label="Questionário de autoatendimento">
      <div className="v2-self-form-head"><span>TRIAGEM COM IA</span><h2>Conte o que está acontecendo.</h2><p>Escreva do seu jeito. Não precisa escolher uma frase pronta.</p></div>

      <div className="v2-self-step"><b>01</b><div><h3>Qual é o equipamento?</h3><p>Se souber, informe marca e modelo. Se não souber, uma foto da placa pode ajudar.</p><div className="v2-self-fields"><label>Marca<input value={brand} maxLength={100} onChange={e=>setBrand(e.target.value)} placeholder="Ex.: Ingersoll Rand"/></label><label>Modelo<input value={model} maxLength={150} onChange={e=>setModel(e.target.value)} placeholder="Ex.: UP6S 30"/></label></div></div></div>

      <div className="v2-self-step"><b>02</b><div><h3>O que ele está fazendo?</h3><p>Descreva ruído, alarme, temperatura, pressão, vazamento, perda de rendimento ou qualquer comportamento estranho.</p><textarea value={symptom} maxLength={2500} rows={6} onChange={e=>setSymptom(e.target.value)} placeholder="Ex.: ele liga normal, mas depois de uns 20 minutos a temperatura sobe e aparece um alarme..."/><small>{symptom.length}/2500</small></div></div>

      <div className="v2-self-step"><b>03</b><div><h3>Quando acontece?</h3><p>Contexto ajuda a diferenciar causa de sintoma.</p><textarea value={context} maxLength={1600} rows={4} onChange={e=>setContext(e.target.value)} placeholder="Ex.: só em carga, depois da manutenção, começou ontem, piora no período da tarde..."/></div></div>

      <div className="v2-self-step"><b>04</b><div><h3>Tem algum número ou código?</h3><p>Pressão em bar, temperatura, horas, código de alarme ou leitura do painel.</p><textarea value={readings} maxLength={900} rows={3} onChange={e=>setReadings(e.target.value)} placeholder="Ex.: 7,1 bar · 104 °C · alarme 10..."/></div></div>

      <div className="v2-self-step"><b>05</b><div><h3>Quer anexar fotos?</h3><p>Até duas imagens do equipamento, painel ou placa de identificação.</p><label className="v2-self-upload"><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e=>{void addPhotos(e.target.files);e.currentTarget.value=""}}/><span>+ Adicionar foto</span></label>{photos.length>0&&<div className="v2-self-photos">{photos.map((photo,index)=><figure key={photo.name+index}><img src={photo.data} alt={photo.name}/><button type="button" onClick={()=>setPhotos(prev=>prev.filter((_,i)=>i!==index))}>×</button><figcaption>{photo.name}</figcaption></figure>)}</div>}</div></div>

      {aiActive===false&&<div className="v2-self-pending">A interface está pronta. O motor de IA aguarda a ativação da chave segura no servidor.</div>}
      {error&&<div className="v2-self-error" role="alert">{error}</div>}
      <button type="button" className="v2-self-analyze" disabled={!canAnalyze} onClick={()=>void analyze()}>{loading?"Analisando relato, imagens e documentação...":aiActive===false?"IA em ativação":"Analisar meu compressor"}</button>
      <p className="v2-self-privacy">As fotos e o relato são usados somente para gerar esta triagem. Não envie senhas, documentos pessoais ou informações sigilosas.</p>
    </section>

    <aside className="v2-self-side">
      <span>COMO FUNCIONA</span>
      <h2>Interpretação, não caça-palavra.</h2>
      <div><b>01</b><p>A IA interpreta o relato em linguagem natural e as fotos anexadas.</p></div>
      <div><b>02</b><p>Quando possível, identifica família/modelo e consulta documentação pública do fabricante.</p></div>
      <div><b>03</b><p>Entrega uma triagem curta e indica quando a TecAr deve assumir o atendimento.</p></div>
      <strong>Não orientamos desmontagem ou intervenção em equipamento energizado, quente ou pressurizado.</strong>
    </aside>

    {result&&<section className={"v2-self-result severity-"+result.severity} aria-live="polite">
      <div className="v2-self-result-head"><div><span>{result.severity==="parar"?"PARAR E ISOLAR":result.severity==="atencao"?"ATENÇÃO":"TRIAGEM"}</span><h2>{result.headline}</h2></div><div className="v2-self-machine"><small>Equipamento interpretado</small><b>{[result.equipment.brand,result.equipment.model].filter(Boolean).join(" · ")||"Não identificado"}</b><em>confiança {result.equipment.confidence}</em></div></div>
      {result.equipment.evidence&&<p className="v2-self-evidence">{result.equipment.evidence}</p>}
      {!!result.likely_causes.length&&<div className="v2-self-block"><h3>O que pode estar acontecendo</h3><div className="v2-self-cause-grid">{result.likely_causes.map((cause,index)=><article key={cause.title+index}><span>{cause.confidence}</span><h4>{cause.title}</h4><p>{cause.reason}</p></article>)}</div></div>}
      {!!result.safe_checks.length&&<div className="v2-self-block"><h3>Checagens seguras e superficiais</h3><div className="v2-self-checks">{result.safe_checks.map((check,index)=><div key={check.title+index}><b>{String(index+1).padStart(2,"0")}</b><div><h4>{check.title}</h4><p>{check.instruction}</p></div></div>)}</div></div>}
      {!!result.stop_conditions.length&&<div className="v2-self-stop"><h3>Não prossiga se houver</h3><ul>{result.stop_conditions.map(item=><li key={item}>{item}</li>)}</ul></div>}
      <div className="v2-self-recommend"><span>PRÓXIMO PASSO</span><h3>{result.recommendation}</h3><Link to={routeHref[result.service_route]} className="v2-primary">{routeLabel[result.service_route]}</Link></div>
      {!!result.follow_up_questions.length&&<div className="v2-self-block"><h3>Para melhorar a precisão</h3><ul className="v2-self-questions">{result.follow_up_questions.map(q=><li key={q}>{q}</li>)}</ul></div>}
      {!!result.sources.length&&<details className="v2-self-sources"><summary>Documentação consultada</summary>{result.sources.map((source,index)=><a key={source.url+index} href={source.url} target="_blank" rel="noopener noreferrer"><b>{source.title}</b><span>{source.note}</span></a>)}</details>}
      <p className="v2-self-disclaimer">{result.disclaimer}</p>
    </section>}
  </div>;
}
