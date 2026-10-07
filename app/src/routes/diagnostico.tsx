import { createFileRoute } from "@tanstack/react-router";
import { PageFrame, ContactBand } from "@/components/site-v2";
import { VerifiedCompressorTable } from "@/components/engineering-diagnostics";
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
  ["Condição do equipamento","Temperatura, alarmes e falhas recorrentes"],
  ["Eficiência do sistema","Energia, carga, vazamentos e pressão"],
  ["Qualidade do ar","Umidade, secagem, filtragem e condensado"],
  ["Risco operacional","Criticidade, contingência e urgência"]
];

function Page(){
  return <PageFrame>
    <DiagnosticHero/>

    <nav className="v2-dx-anchorbar" aria-label="Atalhos dos diagnósticos">
      <div className="v2-container">
        <a href="#estudio-diagnostico">Pré-laudo 360</a>
        <a href="#ensaios-tecnicos">Modelos verificados</a>
        <a href="#fontes-tecnicas">Fontes</a>
      </div>
    </nav>

    <section id="estudio-diagnostico" className="v2-section v2-soft v2-dx-work-section">
      <div className="v2-container">
        <DiagnosticReportStudio aside={<aside className="v2-dx-observe" aria-labelledby="observamos-title">
          <span id="observamos-title">O que observamos</span>
          <ol>{fronts.map(([title,text],index)=><li key={title}><b>0{index+1}</b><div><strong>{title}</strong><small>{text}</small></div></li>)}</ol>
        </aside>}/>
      </div>
    </section>

    <section id="ensaios-tecnicos" className="v2-section v2-dx-reference-section">
      <div className="v2-container">
        <VerifiedCompressorTable/>
      </div>
    </section>

    <section id="fontes-tecnicas" className="v2-section v2-dx-sources-section">
      <div className="v2-container">
        <div className="v2-dx-chapter"><span>01 / RASTREABILIDADE</span><div><h2>A resposta indica a rota. A avaliação técnica confirma a causa.</h2><p>Dados publicados, informações do cliente e medições de campo precisam ficar separados. Consulte cada fonte do pré-laudo.</p></div></div>
        <DiagnosticSourceLibrary/>
      </div>
    </section>

    <ContactBand
      title="Prefere falar direto com a equipe?"
      text="Se a operação estiver crítica, fale pelo WhatsApp e informe que o equipamento está parado."
    />
  </PageFrame>
}
