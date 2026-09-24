import { createFileRoute } from "@tanstack/react-router";
import { PageFrame, ContactBand } from "@/components/site-v2";
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

    <section id="estudio-diagnostico" className="v2-section v2-soft v2-dx-work-section">
      <div className="v2-container">
        <DiagnosticReportStudio/>
      </div>
    </section>

    <section id="observamos" className="v2-section v2-dx-observe-section">
      <div className="v2-container">
        <div className="v2-dx-chapter"><span>01 / LEITURA DO SISTEMA</span><div><h2>O que observamos</h2><p>O pré-laudo organiza números. A avaliação técnica cruza os sinais da máquina com o que acontece na produção.</p></div></div>
        <div className="v2-diagnostic-fronts">
          {fronts.map(([title,text],index)=><article key={title}><strong>0{index+1}</strong><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </div>
    </section>

    <section id="ensaios-tecnicos" className="v2-section v2-dx-reference-section">
      <div className="v2-container">
        <div className="v2-dx-chapter"><span>02 / BASE DE COMPARAÇÃO</span><div><h2>Memória de cálculo</h2><p>Explore os modelos verificados e compare potência mecânica com dados elétricos publicados.</p></div></div>
        <DiagnosticToolsGrid/>
      </div>
    </section>

    <section id="fontes-tecnicas" className="v2-section v2-dx-sources-section">
      <div className="v2-container">
        <div className="v2-dx-chapter"><span>03 / RASTREABILIDADE</span><div><h2>A resposta indica a rota. A avaliação técnica confirma a causa.</h2><p>Dados publicados, informações do cliente e medições de campo precisam ficar separados. Consulte cada fonte do pré-laudo.</p></div></div>
        <DiagnosticSourceLibrary/>
      </div>
    </section>

    <ContactBand
      title="Prefere falar direto com a equipe?"
      text="Se a operação estiver crítica, fale pelo WhatsApp e informe que o equipamento está parado."
    />
  </PageFrame>
}
