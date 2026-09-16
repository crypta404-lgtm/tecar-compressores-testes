import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, PageHero, ContactBand } from "@/components/site-v2";
import { AirLineExplorer } from "@/components/air-line-explorer";
import { pageMeta } from "@/lib/page-meta";

export const Route=createFileRoute("/linhas-de-ar")({head:()=>pageMeta("/linhas-de-ar","Linhas de Ar Comprimido | TecAr","Rede em alumínio organizada por etapas de projeto e distribuição.","/assets/products/line-aluminum.jpg"),component:Page});

function Page(){return <PageFrame>
 <PageHero kicker="LINHAS DE AR" title="Veja como a rede é organizada." text="Clique em cada etapa da distribuição e entenda o papel dela no sistema." image="/assets/products/line-aluminum.jpg"><Link to="/contato" className="v2-primary">Projetar rede</Link></PageHero>
 <section className="v2-section"><div className="v2-container"><AirLineExplorer/></div></section>
 <ContactBand/>
</PageFrame>}
