import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, PageHero, SectionHead, ContactBand } from "@/components/site-v2";
import { DiagnosticQuestionnaire } from "@/components/diagnostic-questionnaire";
import { pageMeta } from "@/lib/page-meta";

export const Route=createFileRoute("/diagnostico")({
  head:()=>pageMeta(
    "/diagnostico",
    "Diagnóstico de Ar Comprimido | TecAr",
    "Triagem guiada para falhas, consumo, pressão, qualidade do ar, manutenção, monitoramento e dimensionamento do sistema.",
    "/assets/v2/tecar-engineering.png"
  ),
  component:Page
});

const fronts=[
  ["Condição do equipamento","Temperatura, alarmes, comportamento, falhas recorrentes, manutenção e sinais observados."],
  ["Eficiência do sistema","Consumo energético, regime de carga, vazamentos, pressão e possíveis perdas no sistema."],
  ["Qualidade do ar","Umidade, ponto de orvalho, tratamento, secagem, filtragem e condensado."],
  ["Risco operacional","Criticidade do compressor, impacto de parada, contingência, redundância e urgência do atendimento."]
];

function Page(){
  return <PageFrame>
    <PageHero
      kicker="DIAGNÓSTICO TECAR"
      title="Comece pelo problema. A TecAr ajuda a encontrar o próximo passo."
      text="Uma triagem orientada organiza as informações da sua operação antes do primeiro contato técnico. Você responde o questionário e, ao final, o resumo já segue pronto para o WhatsApp da TecAr."
      image="/assets/v2/tecar-engineering.png"
    >
      <a href="#questionario" className="v2-primary">Iniciar diagnóstico</a>
    </PageHero>

    <section className="v2-section">
      <div className="v2-container">
        <SectionHead
          kicker="O QUE OBSERVAMOS"
          title="Diagnóstico não começa trocando peça."
          text="O primeiro passo é entender o contexto: o que mudou, como a máquina está trabalhando, o impacto na produção e quais sinais já estão disponíveis."
        />
        <div className="v2-diagnostic-fronts">
          {fronts.map(([title,text],index)=><article key={title}><strong>0{index+1}</strong><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </div>
    </section>

    <section id="questionario" className="v2-section v2-soft">
      <div className="v2-container v2-diagnostic-page-grid">
        <div className="v2-diagnostic-page-copy">
          <SectionHead
            kicker="TRIAGEM GUIADA"
            title="Responda o que você já sabe."
            text="Não é necessário conhecer todos os dados técnicos. Se alguma leitura não estiver disponível, avance normalmente. O objetivo é entregar à equipe TecAr um primeiro retrato organizado da situação."
          />
          <div className="v2-diagnostic-help">
            <div><b>Leva poucos minutos</b><span>Perguntas objetivas, uma etapa por vez.</span></div>
            <div><b>Sem obrigação técnica</b><span>Você pode deixar medições e histórico em branco quando não souber.</span></div>
            <div><b>Vai direto ao WhatsApp</b><span>No fim, o site monta a mensagem com todas as respostas.</span></div>
          </div>
        </div>
        <DiagnosticQuestionnaire variant="full"/>
      </div>
    </section>

    <section className="v2-section">
      <div className="v2-container">
        <SectionHead
          kicker="ANTES DO ATENDIMENTO"
          title="Se tiver estas informações, melhor ainda."
          text="Quanto mais contexto houver, mais objetiva tende a ser a primeira conversa com a equipe."
        />
        <div className="v2-diagnostic-checklist">
          <div><span>01</span><b>Marca e modelo</b><p>Identificação do compressor, secador ou componente envolvido.</p></div>
          <div><span>02</span><b>Foto do painel</b><p>Alarmes, códigos, temperatura ou mensagens exibidas no controlador.</p></div>
          <div><span>03</span><b>Pressão e horário</b><p>Quando a falha ocorre e qual pressão a operação precisa manter.</p></div>
          <div><span>04</span><b>Última manutenção</b><p>Data aproximada, peças trocadas e se o sintoma já ocorreu antes.</p></div>
          <div><span>05</span><b>Impacto na produção</b><p>Se a planta está parada, limitada ou operando normalmente.</p></div>
          <div><span>06</span><b>Local da instalação</b><p>Cidade e condições relevantes do ambiente industrial.</p></div>
        </div>
      </div>
    </section>

    <section className="v2-diagnostic-path">
      <div className="v2-container v2-diagnostic-path-inner">
        <div>
          <span className="v2-kicker">DEPOIS DA TRIAGEM</span>
          <h2>A resposta indica a rota. A avaliação técnica confirma a causa.</h2>
          <p>Dependendo das respostas, o atendimento pode seguir para assistência, engenharia, qualidade do ar, monitoramento ou locação. O questionário organiza o começo, mas não substitui diagnóstico técnico presencial quando ele for necessário.</p>
        </div>
        <div className="v2-diagnostic-path-flow">
          <span>Questionário</span><i>→</i><span>WhatsApp TecAr</span><i>→</i><span>Triagem técnica</span><i>→</i><span>Próximo passo</span>
        </div>
      </div>
    </section>

    <ContactBand
      title="Prefere falar direto com a equipe?"
      text="O questionário é opcional. Se a operação estiver crítica, entre em contato pelo WhatsApp e informe que o equipamento está parado."
    />
  </PageFrame>
}
