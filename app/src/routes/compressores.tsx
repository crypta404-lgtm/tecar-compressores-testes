import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, PageHero, SectionHead, ContactBand } from "@/components/site-v2";
import { INGERSOLL_FAMILIES, VARIABLE_SPEED_MODELS } from "@/lib/diagnostic-data";
import { pageMeta } from "@/lib/page-meta";

export const Route=createFileRoute("/compressores")({head:()=>pageMeta("/compressores","Compressores de Ar | TecAr","Compressores Ingersoll Rand para diferentes vazões, pressões e perfis de operação.","/assets/v2/compressors.jpg"),component:Page});

const products=[
  {name:"Nirvana VSD",type:"Velocidade variável",image:"/assets/products/compressor-nirvana.jpg",text:"Ajusta a rotação à demanda da planta. Indicado quando o consumo varia ao longo do turno."},
  {name:"Série R — base",type:"Parafuso lubrificado",image:"/assets/products/compressor-r-base.png",text:"Compressor industrial sobre base para operação contínua e integração à rede existente."},
  {name:"Série R — reservatório",type:"Pacote compacto",image:"/assets/products/compressor-r-tank.png",text:"Compressor montado sobre reservatório para instalações com montagem simplificada."},
  {name:"Alta pressão",type:"Aplicações especiais",image:"/assets/products/compressor-high-pressure.png",text:"Solução dedicada a processos que trabalham acima da pressão convencional de rede."},
  {name:"Série E isento de óleo",type:"Classe 0",image:"/assets/products/compressor-oil-free.jpg",text:"Ar 100% isento de óleo para processos com exigência elevada de pureza."},
  {name:"Gerador de nitrogênio",type:"Geração on-site",image:"/assets/products/nitrogen-generator.webp",text:"Produção local de nitrogênio para reduzir dependência de fornecimento externo."},
] as const;

function Page(){return <PageFrame>
  <PageHero kicker="COMPRESSORES" title="O compressor certo para a sua demanda." text="Compare famílias rapidamente. Para dimensionamento, usamos vazão, pressão e perfil real de consumo." image="/assets/v2/compressors.jpg"><Link to="/diagnostico" className="v2-primary">Ir ao diagnóstico</Link></PageHero>
  <section className="v2-section"><div className="v2-container"><SectionHead kicker="LINHAS PRINCIPAIS" title="Veja, compare e escolha por aplicação."/><div className="v2-product-family-grid">{products.map(item=><article key={item.name}><div className="v2-product-family-image"><img src={item.image} alt={item.name} loading="lazy"/></div><div className="v2-product-family-copy"><span>{item.type}</span><h3>{item.name}</h3><p>{item.text}</p></div></article>)}</div></div></section>
  <section className="v2-section v2-soft"><div className="v2-container"><details className="v2-tech-disclosure"><summary>Ver famílias, faixas e modelos variáveis <span>+</span></summary><div className="v2-tech-disclosure-body"><SectionHead title="Mapa técnico" text="Abra esta área apenas se precisar aprofundar a seleção."/><div className="v2-compressor-family-matrix">{INGERSOLL_FAMILIES.map((item,index)=><div key={item.name+item.range+index}><b>{item.name}</b><span>{item.range}</span></div>)}</div><div className="v2-variable-catalog v2-variable-catalog-page">{VARIABLE_SPEED_MODELS.map(group=><article key={group.range}><div><strong>{group.range}</strong><small>{group.pressureRange}</small></div><p>{group.models.map(model=><b key={model}>{model}</b>)}</p><a href={group.sourceUrl} target="_blank" rel="noopener noreferrer">Fonte oficial</a></article>)}</div></div></details></div></section>
  <section className="v2-section"><div className="v2-container v2-official-link"><div><SectionHead title="Precisa comparar duas linhas?"/><p>Informe aplicação, vazão e pressão. A TecAr ajuda a selecionar a configuração.</p></div><a href="https://www.ingersollrand.com/pt-br/products/air-compressors/" target="_blank" rel="noopener noreferrer" className="v2-secondary">Catálogo Ingersoll Rand</a></div></section>
  <ContactBand/>
</PageFrame>}
