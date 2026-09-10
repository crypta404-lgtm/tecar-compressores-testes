import { useMemo, useState } from "react";

type Variant = "compact" | "full";

type Answers = {
  goal: string;
  impact: string;
  system: string;
  details: string;
  readings: string;
  maintenance: string;
  urgency: string;
  city: string;
  company: string;
  name: string;
};

const EMPTY: Answers = {
  goal: "",
  impact: "",
  system: "",
  details: "",
  readings: "",
  maintenance: "",
  urgency: "",
  city: "",
  company: "",
  name: "",
};

const GOALS = [
  "Equipamento parado ou falhando",
  "Consumo de energia alto",
  "Baixa pressão ou falta de ar",
  "Umidade ou qualidade do ar",
  "Planejar manutenção preventiva",
  "Dimensionar ou ampliar o sistema",
  "Monitorar o compressor remotamente",
  "Locação ou contingência",
];

const IMPACTS = ["Produção parada", "Produção parcialmente afetada", "Operando, mas com anormalidade", "Sem falha atual, quero prevenir"];
const SYSTEMS = ["Compressor", "Secador", "Rede de ar", "Reservatório", "Sistema completo", "Não sei identificar"];
const URGENCIES = ["Agora / operação crítica", "Hoje", "Nos próximos dias", "Planejamento / estudo"];

function getRoute(a: Answers) {
  const text = (a.goal + " " + a.details).toLowerCase();
  if (text.includes("locação") || text.includes("contingência")) return "Locação e contingência";
  if (text.includes("monitor")) return "Monitoramento remoto / TecAr Connect";
  if (text.includes("energia") || text.includes("consumo") || text.includes("pressão") || text.includes("dimensionar") || text.includes("ampliar")) return "Engenharia e diagnóstico de sistema";
  if (text.includes("umidade") || text.includes("qualidade")) return "Tratamento e qualidade do ar";
  if (text.includes("preventiva")) return "Manutenção preventiva";
  return "Assistência técnica e diagnóstico";
}

function buildMessage(a: Answers, variant: Variant) {
  const route = getRoute(a);
  const rows = [
    "Olá, vim pelo Diagnóstico TecAr do site.",
    "",
    "*TRIAGEM PRELIMINAR*",
    "Área sugerida: " + route,
    "Objetivo / problema: " + (a.goal || "Não informado"),
    "Impacto na operação: " + (a.impact || "Não informado"),
    "Sistema / equipamento: " + (a.system || "Não informado"),
  ];
  if (variant === "full") {
    rows.push(
      "Equipamento, sintomas e contexto: " + (a.details || "Não informado"),
      "Leituras / dados disponíveis: " + (a.readings || "Não informado"),
      "Histórico de manutenção: " + (a.maintenance || "Não informado"),
      "Urgência: " + (a.urgency || "Não informado"),
    );
  }
  rows.push(
    "Cidade: " + (a.city || "Não informada"),
    "Empresa: " + (a.company || "Não informada"),
    "Contato: " + (a.name || "Não informado"),
    "",
    "Gostaria de orientação da equipe TecAr sobre o próximo passo."
  );
  return rows.join("\n");
}

function ChoiceGrid({options,value,onChange}:{options:string[];value:string;onChange:(value:string)=>void}) {
  return <div className="v2-diagnostic-options">
    {options.map((option)=><button key={option} type="button" className={value===option?"is-selected":""} onClick={()=>onChange(option)}>{option}</button>)}
  </div>;
}

export function DiagnosticQuestionnaire({variant="full"}:{variant?:Variant}) {
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState<Answers>(EMPTY);
  const compact = variant === "compact";
  const steps = compact ? 5 : 8;
  const done = step >= steps;
  const route = useMemo(()=>getRoute(answers),[answers]);
  const whatsapp = useMemo(()=>"https://wa.me/5541996441330?text="+encodeURIComponent(buildMessage(answers,variant)),[answers,variant]);

  const set = (key:keyof Answers,value:string)=>setAnswers((prev)=>({...prev,[key]:value}));
  const next = ()=>setStep((s)=>Math.min(steps,s+1));
  const back = ()=>setStep((s)=>Math.max(0,s-1));

  const canContinue = (() => {
    if (step===0) return Boolean(answers.goal);
    if (step===1) return Boolean(answers.impact);
    if (step===2) return Boolean(answers.system);
    if (compact && step===3) return Boolean(answers.city.trim());
    if (compact && step===4) return Boolean(answers.name.trim());
    if (!compact && step===3) return Boolean(answers.details.trim());
    if (!compact && step===4) return true;
    if (!compact && step===5) return true;
    if (!compact && step===6) return Boolean(answers.urgency);
    if (!compact && step===7) return Boolean(answers.city.trim() && answers.name.trim());
    return true;
  })();

  return <div className={"v2-diagnostic "+(compact?"v2-diagnostic-compact":"")}>
    <div className="v2-diagnostic-top">
      <div><span>Diagnóstico TecAr</span><strong>{done ? "Triagem concluída" : "Etapa "+(step+1)+" de "+steps}</strong></div>
      <div className="v2-diagnostic-progress"><i style={{width:((Math.min(step,steps)/steps)*100)+"%"}}/></div>
    </div>

    {!done && <div className="v2-diagnostic-body">
      {step===0 && <div className="v2-diagnostic-step"><h3>Qual é a principal necessidade hoje?</h3><p>Escolha o cenário que mais se aproxima da sua situação.</p><ChoiceGrid options={GOALS} value={answers.goal} onChange={(v)=>set("goal",v)}/></div>}
      {step===1 && <div className="v2-diagnostic-step"><h3>Como isso está afetando a operação?</h3><p>A criticidade ajuda a TecAr a entender a prioridade do atendimento.</p><ChoiceGrid options={IMPACTS} value={answers.impact} onChange={(v)=>set("impact",v)}/></div>}
      {step===2 && <div className="v2-diagnostic-step"><h3>Onde está o problema ou a necessidade?</h3><ChoiceGrid options={SYSTEMS} value={answers.system} onChange={(v)=>set("system",v)}/></div>}

      {compact && step===3 && <div className="v2-diagnostic-step"><h3>Onde está a operação?</h3><label className="v2-diagnostic-field">Cidade / UF<input value={answers.city} onChange={(e)=>set("city",e.target.value)} placeholder="Ex.: Curitiba / PR"/></label></div>}
      {compact && step===4 && <div className="v2-diagnostic-step"><h3>Quem devemos atender?</h3><div className="v2-diagnostic-fields"><label className="v2-diagnostic-field">Seu nome<input value={answers.name} onChange={(e)=>set("name",e.target.value)} placeholder="Nome"/></label><label className="v2-diagnostic-field">Empresa<input value={answers.company} onChange={(e)=>set("company",e.target.value)} placeholder="Empresa"/></label></div></div>}

      {!compact && step===3 && <div className="v2-diagnostic-step"><h3>Conte o que você sabe sobre o equipamento e o sintoma.</h3><p>Marca, modelo, potência, mensagens de alarme, ruído, temperatura, comportamento ou qualquer informação observada.</p><label className="v2-diagnostic-field"><textarea rows={5} value={answers.details} onChange={(e)=>set("details",e.target.value)} placeholder="Ex.: compressor 50 hp, temperatura subindo, alarme após 20 minutos..."/></label></div>}
      {!compact && step===4 && <div className="v2-diagnostic-step"><h3>Você possui alguma leitura ou medição?</h3><p>Opcional. Informe pressão, temperatura, ponto de orvalho, consumo, horas ou outra leitura disponível.</p><label className="v2-diagnostic-field"><textarea rows={4} value={answers.readings} onChange={(e)=>set("readings",e.target.value)} placeholder="Ex.: 6,2 bar na rede, 92 °C no compressor, ponto de orvalho +8 °C..."/></label></div>}
      {!compact && step===5 && <div className="v2-diagnostic-step"><h3>Como está o histórico de manutenção?</h3><p>Opcional. Última preventiva, peças trocadas, falhas repetidas ou intervenções recentes ajudam na triagem.</p><label className="v2-diagnostic-field"><textarea rows={4} value={answers.maintenance} onChange={(e)=>set("maintenance",e.target.value)} placeholder="Ex.: preventiva há 4 meses; falha semelhante já ocorreu duas vezes..."/></label></div>}
      {!compact && step===6 && <div className="v2-diagnostic-step"><h3>Qual é a urgência?</h3><ChoiceGrid options={URGENCIES} value={answers.urgency} onChange={(v)=>set("urgency",v)}/></div>}
      {!compact && step===7 && <div className="v2-diagnostic-step"><h3>Para onde a equipe deve direcionar a conversa?</h3><div className="v2-diagnostic-fields"><label className="v2-diagnostic-field">Cidade / UF<input value={answers.city} onChange={(e)=>set("city",e.target.value)} placeholder="Cidade / UF"/></label><label className="v2-diagnostic-field">Seu nome<input value={answers.name} onChange={(e)=>set("name",e.target.value)} placeholder="Nome"/></label><label className="v2-diagnostic-field">Empresa<input value={answers.company} onChange={(e)=>set("company",e.target.value)} placeholder="Empresa"/></label></div></div>}
    </div>}

    {done && <div className="v2-diagnostic-result">
      <span>Triagem preliminar</span>
      <h3>{route}</h3>
      <p>As respostas foram organizadas em uma mensagem técnica para reduzir ida e volta no primeiro contato. Isto não substitui avaliação técnica em campo.</p>
      <div className="v2-diagnostic-summary">
        <div><b>Necessidade</b><span>{answers.goal}</span></div>
        <div><b>Operação</b><span>{answers.impact}</span></div>
        <div><b>Sistema</b><span>{answers.system}</span></div>
        <div><b>Local</b><span>{answers.city}</span></div>
      </div>
      <a href={whatsapp} target="_blank" rel="noreferrer" className="v2-diagnostic-whatsapp">Enviar diagnóstico no WhatsApp</a>
      <button type="button" className="v2-diagnostic-restart" onClick={()=>{setAnswers(EMPTY);setStep(0)}}>Refazer questionário</button>
    </div>}

    {!done && <div className="v2-diagnostic-nav">
      {step>0 ? <button type="button" onClick={back}>Voltar</button> : <span/>}
      {step===steps-1
        ? <a
            className="v2-diagnostic-next"
            aria-disabled={!canContinue}
            href={canContinue ? whatsapp : undefined}
            target="_blank"
            rel="noreferrer"
            onClick={(event)=>{ if(!canContinue){ event.preventDefault(); return; } setStep(steps); }}
          >Concluir e abrir WhatsApp</a>
        : <button type="button" className="v2-diagnostic-next" disabled={!canContinue} onClick={next}>Continuar</button>}
    </div>}
  </div>;
}
