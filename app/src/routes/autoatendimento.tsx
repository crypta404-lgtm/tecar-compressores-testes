import { createFileRoute } from "@tanstack/react-router";
import { PageFrame } from "@/components/site-v2";
import { AutoatendimentoAssistant } from "@/components/autoatendimento-assistant";
import { pageMeta } from "@/lib/page-meta";

export const Route=createFileRoute("/autoatendimento")({
  head:()=>pageMeta("/autoatendimento","Autoatendimento | TecAr Compressores","Descreva o comportamento do compressor, anexe fotos e receba uma triagem técnica preliminar com apoio de IA.","/assets/v2/tecar-service.png"),
  component:Page
});

function Page(){return <PageFrame>
  <section className="v2-self-hero"><div className="v2-container"><span>AUTOATENDIMENTO TECAR</span><h1>O que está acontecendo com o seu compressor?</h1><p>Descreva o sintoma com suas palavras, informe o que souber e anexe fotos. A ferramenta interpreta o cenário, consulta documentação pública e entrega uma orientação preliminar.</p></div></section>
  <section className="v2-section v2-self-section"><div className="v2-container"><AutoatendimentoAssistant/></div></section>
</PageFrame>}
