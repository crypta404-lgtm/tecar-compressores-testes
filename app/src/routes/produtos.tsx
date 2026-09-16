import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, PageHero, SectionHead, ContactBand } from "@/components/site-v2";
import { pageMeta } from "@/lib/page-meta";
export const Route=createFileRoute("/produtos")({head:()=>pageMeta("/produtos","Produtos | TecAr Compressores","Compressores, secadores, linhas de ar, acessórios e Safety Air.","/assets/v2/compressors.jpg"),component:Page});
const items=[
 ["/compressores","Compressores","Geração de ar para diferentes vazões, pressões e perfis de consumo.","/assets/v2/compressors.jpg"],
 ["/secadores","Secadores","Controle de umidade por refrigeração ou adsorção.","/assets/products/dryer-refrigerated.png"],
 ["/linhas-de-ar","Linhas de ar","Distribuição em alumínio e redes com menor perda de carga.","/assets/v2/lines.jpg"],
 ["/acessorios","Acessórios","Filtros, drenos e componentes do sistema.","/assets/v2/accessories.webp"],
 ["/safety-air","Safety Air","Proteção e organização de instalações críticas.","/assets/v2/safety-air.jpg"]
] as const;
function Page(){return <PageFrame><PageHero kicker="PRODUTOS" title="Encontre o equipamento pela necessidade." text="Geração, tratamento, distribuição e proteção do ar comprimido." image="/assets/v2/compressors.jpg"/><section className="v2-section"><div className="v2-container"><SectionHead title="Categorias"/><div className="v2-category-list">{items.map(([to,t,d,img])=><Link to={to} key={to}><img src={img} alt={t} loading="lazy"/><div><h3>{t}</h3><p>{d}</p><span>Ver categoria</span></div></Link>)}</div></div></section><ContactBand/></PageFrame>}
