import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, PageHero, SectionHead, ContactBand } from "@/components/site-v2";
import { pageMeta } from "@/lib/page-meta";
export const Route=createFileRoute("/servicos")({head:()=>pageMeta("/servicos","Serviços | TecAr Compressores","Manutenção, engenharia, locação e monitoramento remoto para sistemas industriais de ar comprimido."),component:Page});
const items=[
 ["/manutencao","Manutenção","Assistência multimarcas, preventivas, corretivas, diagnóstico, planejamento e NR13."],
 ["/engenharia","Engenharia","Eficiência energética, auditorias, redes, dimensionamento e projetos de casa de máquinas."],
 ["/locacao","Locação","Soluções emergenciais e contratos de longo prazo com geração de ar sob demanda."],
 ["/tecar-connect","TecAr Connect","Monitoramento remoto para ampliar visibilidade sobre a condição e operação do equipamento."]
] as const;
function Page(){return <PageFrame><PageHero kicker="SERVIÇOS" title="Engenharia e assistência para o ciclo completo." text="Escolha a frente que melhor corresponde à sua necessidade e veja detalhes técnicos, benefícios e critérios de aplicação." image="/assets/v2/tecar-service.png"/><section className="v2-section"><div className="v2-container"><SectionHead title="Nossas frentes de serviço"/><div className="v2-link-list">{items.map(([to,t,d])=><Link to={to} key={to}><div><h3>{t}</h3><p>{d}</p></div><span>→</span></Link>)}</div></div></section><ContactBand/></PageFrame>}
