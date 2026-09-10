import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, PageHero, SectionHead, ContactBand } from "@/components/site-v2";
import { pageMeta } from "@/lib/page-meta";
export const Route=createFileRoute("/produtos")({head:()=>pageMeta("/produtos","Produtos | TecAr Compressores","Compressores, secadores, linhas de ar, acessórios e Safety Air para sistemas industriais de ar comprimido.","/assets/v2/compressors.jpg"),component:Page});
const items=[
 ["/compressores","Compressores","Geração do ar comprimido para diferentes pressões, vazões e requisitos de processo.","/assets/v2/compressors.jpg"],
 ["/secadores","Secadores","Tratamento da umidade do ar por refrigeração ou adsorção.","/assets/v2/dryers.jpg"],
 ["/linhas-de-ar","Linhas de ar","Distribuição em alumínio e projeto de rede com menor perda de carga.","/assets/v2/lines.jpg"],
 ["/acessorios","Acessórios","Filtros, drenos, separadores, gerenciadores e componentes de controle.","/assets/v2/accessories.webp"],
 ["/safety-air","Safety Air","Estrutura modular para proteção e organização de instalações em ambientes críticos.","/assets/v2/safety-air.jpg"]
] as const;
function Page(){return <PageFrame><PageHero kicker="PRODUTOS" title="Escolha o sistema pelo que a sua planta precisa." text="A TecAr trabalha com soluções reconhecidas para geração, tratamento, distribuição, controle e proteção do ar comprimido." image="/assets/v2/compressors.jpg"/><section className="v2-section"><div className="v2-container"><SectionHead title="Categorias"/><div className="v2-category-list">{items.map(([to,t,d,img])=><Link to={to} key={to}><img src={img} alt=""/><div><h3>{t}</h3><p>{d}</p><span>Ver categoria</span></div></Link>)}</div></div></section><ContactBand/></PageFrame>}
