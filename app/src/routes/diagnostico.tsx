import { createFileRoute } from "@tanstack/react-router";
import { PageFrame, SectionHead, ContactBand } from "@/components/site-v2";
import { DiagnosticToolsGrid } from "@/components/engineering-diagnostics";
import { DiagnosticHero, DiagnosticReportStudio, DiagnosticSourceLibrary } from "@/components/diagnostic-report-studio";
import { pageMeta } from "@/lib/page-meta";

export const Route=createFileRoute("/diagnostico")({
  head:()=>pageMeta(
    "/diagnostico",
    "Diagnóstico de Ar Comprimido | TecAr",
    "Diagnósticos de ar comprimido com dados publicados por Ingersoll Rand, CAGI, ANEEL, Copel, DOE e NIST, além de triagem técnica guiada.",
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
    <DiagnosticHero/>

    <nav className="v2-dx-anchorbar" aria-label="Atalhos dos diagnósticos">
      <div className="v2-container">
        <a href="#estudio-diagnostico">Pré-laudo 360</a>
        <a href="#ensaios-tecnicos">Calculadoras técnicas</a>
        <a href="#observamos">O que observamos</a>
        <a href="#fontes-tecnicas">Fontes</a>
      </div>
    </nav>

    <section id="estudio-diagnostico" className="v2-section v2-soft">
      <div className="v2-container">
        <DiagnosticReportStudio/>
      </div>
    </section>

    <section id="observamos" className="v2-section">
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

    <section id="ensaios-tecnicos" className="v2-section">
      <div className="v2-container">
        <SectionHead
          kicker="MEMÓRIA DE CÁLCULO"
          title="Ensaios rápidos para aprofundar cada hipótese."
          text="Compare modelos verificados e entenda a conversão de HP para kW sem confundir potência nominal com consumo medido."
        />
        <DiagnosticToolsGrid/>
      </div>
    </section>

    <section id="fontes-tecnicas" className="v2-section">
      <div className="v2-container">
        <SectionHead
          kicker="RASTREABILIDADE"
          title="A resposta indica a rota. A avaliação técnica confirma a causa."
          text="O pré-laudo diferencia dado publicado, entrada do usuário, regra de triagem e medição que ainda precisa ser feita em campo."
        />
        <DiagnosticSourceLibrary/>
      </div>
    </section>

    <ContactBand
      title="Prefere falar direto com a equipe?"
      text="O questionário é opcional. Se a operação estiver crítica, entre em contato pelo WhatsApp e informe que o equipamento está parado."
    />
  </PageFrame>
}
