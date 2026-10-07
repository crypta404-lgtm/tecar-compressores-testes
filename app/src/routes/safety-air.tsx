import { createFileRoute } from "@tanstack/react-router";
import { PageFrame, PageHero, ContactBand } from "@/components/site-v2";
import { DoorOpen, Expand, LayoutGrid, ShieldCheck, Truck, Wind, Wrench } from "lucide-react";
import { EdCards, EdHead, EdSection, EdSplit, EdStatement } from "@/components/editorial";
import { pageMeta } from "@/lib/page-meta";
import { SafetyAir3D, preloadSafetyAir3D } from "@/components/safety-air-3d/safety-air-3d";

// start downloading the 3D chunk while the page (and the opening screen) loads
preloadSafetyAir3D();
export const Route=createFileRoute("/safety-air")({head:()=>pageMeta("/safety-air","Safety Air | TecAr","Safety Air TecAr, solução modular para organização e proteção de instalações de ar comprimido em ambientes industriais críticos.","/assets/v2/safety-air.jpg"),component:Page});
function Page(){return <PageFrame><PageHero kicker="SAFETY AIR" title="Liberdade para o layout industrial." text="Uma solução modular para organizar, proteger e instalar o sistema de ar comprimido sem depender da construção civil tradicional." image="/assets/v2/safety-air.jpg"><a href="https://wa.me/5541996441330?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20TecAr." target="_blank" rel="noopener noreferrer" className="v2-primary">Solicitar estudo</a></PageHero>
<section className="v2-section sa3d-section" id="modelo-3d"><div className="v2-container"><div className="sa3d-head"><div><span className="v2-kicker">EXPLORE EM 3D</span><h2>Veja o Safety Air por dentro.</h2></div><p>Gire a cabine, tire o teto e entre para ver como o compressor, o secador e a ventilação ficam organizados.</p></div><SafetyAir3D fallback="/assets/unique/official/safety-d.webp"/></div></section>
<EdSection>
 <span className="v2-kicker">O QUE É O SAFETY AIR</span>
 <EdStatement>O Safety Air foi desenvolvido para criar uma estrutura dedicada ao sistema de ar comprimido, com foco em proteção, ventilação, organização e mobilidade da instalação.</EdStatement>
 <EdCards cols={4} items={[
  {icon:LayoutGrid,title:"Modular",text:"Permite adaptar a solução ao espaço e à configuração da planta."},
  {icon:ShieldCheck,title:"Proteção",text:"Ajuda a isolar equipamentos de particulados e condições ambientais adversas."},
  {icon:Wind,title:"Ventilação",text:"Projeto adequado de entrada e exaustão ajuda a controlar a temperatura."},
  {icon:Truck,title:"Mobilidade",text:"Alternativa à construção fixa quando flexibilidade de layout é importante."},
 ]}/>
</EdSection>
<EdSection tone="paper"><EdSplit image="/assets/unique/official/safety-d.webp" alt="Safety Air TecAr">
 <span className="v2-kicker">APLICAÇÃO</span><h2>Pensado para ambientes exigentes</h2>
 <h3>Portos, cooperativas e plantas industriais</h3><p>Ambientes com poeira, calor, partículas e necessidade de reorganização frequente da planta podem exigir uma solução dedicada para proteger a geração de ar.</p>
 <h3>Dimensões disponíveis</h3><p>As dimensões e a configuração devem ser definidas conforme equipamentos, ventilação, circulação e espaço do local.</p>
</EdSplit></EdSection>
<EdSection>
 <EdHead title="Proteja o sistema. Preserve sua operação."/>
 <EdCards items={[
  {icon:Wrench,title:"Menos intervenção civil",text:"Uma estrutura modular pode reduzir a necessidade de construir uma sala fixa, conforme as condições da instalação. O projeto nasce com espaço para equipamentos, circulação e manutenção."},
  {icon:DoorOpen,title:"Acesso que facilita o cuidado",text:"Organização, ventilação e acesso técnico favorecem a inspeção e a manutenção. O resultado esperado é uma rotina de cuidado mais simples e menos improvisos na casa de máquinas."},
  {icon:Expand,title:"Flexibilidade para crescer",text:"Mudou a produção ou o layout? Uma solução modular permite estudar a reorganização da central e aproveitar melhor o espaço industrial."},
 ]}/>
</EdSection><ContactBand title="Vamos projetar o Safety Air para sua planta?" text="Envie os equipamentos, as dimensões disponíveis e as condições do ambiente. A TecAr avalia a configuração e o escopo."/></PageFrame>}
