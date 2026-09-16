import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, PageHero, ContactBand } from "@/components/site-v2";
import { AirLineExplorer } from "@/components/air-line-explorer";
import { pageMeta } from "@/lib/page-meta";

export const Route=createFileRoute("/linhas-de-ar")({head:()=>pageMeta("/linhas-de-ar","Linhas de Ar Comprimido | TecAr","Rede em alumínio organizada por etapas de projeto e distribuição.","https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,fit=crop/YZ9EgGEK8zh4Pjl4/piping-application-6-1200x800-1-mePg6NWzlRFonDzk.jpg"),component:Page});

function Page(){return <PageFrame>
 <PageHero kicker="LINHAS DE AR" title="Veja como a rede é organizada." text="Clique em cada etapa da distribuição e entenda o papel dela no sistema." image="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,fit=crop/YZ9EgGEK8zh4Pjl4/piping-application-6-1200x800-1-mePg6NWzlRFonDzk.jpg"><Link to="/contato" className="v2-primary">Projetar rede</Link></PageHero>
 <section className="v2-section"><div className="v2-container"><AirLineExplorer/></div></section>
 <ContactBand/>
</PageFrame>}
