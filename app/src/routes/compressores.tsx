import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, PageHero, SectionHead, ContactBand } from "@/components/site-v2";
import { INGERSOLL_FAMILIES, VARIABLE_SPEED_MODELS } from "@/lib/diagnostic-data";
import { pageMeta } from "@/lib/page-meta";

export const Route=createFileRoute("/compressores")({
  head:()=>pageMeta("/compressores","Compressores de Ar | TecAr","Famílias de compressores, modelos de velocidade variável, aplicações e critérios de dimensionamento TecAr.","/assets/v2/compressors.jpg"),
  component:Page
});

const types=[
 ["Parafuso lubrificado","Famílias UP6, UP6S, Série R e Next Generation RS para diferentes faixas de vazão e regime de trabalho."],
 ["Velocidade variável","Modelos que ajustam a rotação à demanda da planta e devem ser selecionados pelo perfil medido de consumo."],
 ["Alta pressão","Equipamentos dedicados a processos cuja pressão de operação ultrapassa a faixa convencional da rede industrial."],
 ["Isentos de óleo","Tecnologias para processos com requisito elevado de pureza e controle de contaminação."],
 ["Alternativos","Configurações para oficinas, serviços, aplicações intermitentes e necessidades específicas de pressão."],
 ["Centrífugos","Soluções para grandes vazões contínuas e instalações industriais de maior porte."],
 ["PET e gases","Sistemas para sopro de embalagens e geração local de nitrogênio ou outros gases de processo."]
] as const;

function Page(){return <PageFrame>
  <PageHero kicker="COMPRESSORES" title="A máquina certa começa pelo dimensionamento certo." text="Pressão em bar, vazão, regime de trabalho, qualidade do ar e perfil de consumo definem qual compressor faz sentido para a sua aplicação." image="/assets/v2/compressors.jpg"><Link to="/contato" className="v2-primary">Dimensionar compressor</Link></PageHero>

  <section className="v2-section"><div className="v2-container">
    <SectionHead kicker="PORTFÓLIO" title="Famílias para cada condição de processo." text="A seleção considera o sistema completo e a disponibilidade comercial para o mercado brasileiro."/>
    <div className="v2-model-grid">{types.map(([title,text],index)=><article key={title}><div className="v2-model-photo"><img src={index===1?"/assets/v2/nirvana.jpg":"/assets/v2/compressors.jpg"} alt=""/></div><h3>{title}</h3><p>{text}</p></article>)}</div>
  </div></section>

  <section className="v2-section v2-soft"><div className="v2-container">
    <SectionHead kicker="MAPA DE LINHAS" title="Todas as faixas organizadas em uma única tabela." text="O mapa comercial abaixo reúne as famílias localizadas no catálogo oficial. Configuração, pressão, tratamento integrado e disponibilidade devem ser confirmados no dimensionamento."/>
    <div className="v2-compressor-family-matrix">{INGERSOLL_FAMILIES.map((item,index)=><div key={item.name+item.range+index}><b>{item.name}</b><span>{item.range}</span></div>)}</div>
  </div></section>

  <section className="v2-section"><div className="v2-container">
    <SectionHead kicker="VELOCIDADE VARIÁVEL" title="Modelos variáveis por família e potência." text="A nomenclatura foi organizada por faixa para facilitar a consulta comercial. A curva oficial do modelo selecionado prevalece sobre qualquer estimativa."/>
    <div className="v2-variable-catalog v2-variable-catalog-page">{VARIABLE_SPEED_MODELS.map(group=><article key={group.range}><div><strong>{group.range}</strong><small>{group.pressureRange}</small></div><p>{group.models.map(model=><b key={model}>{model}</b>)}</p><a href={group.sourceUrl} target="_blank" rel="noreferrer">abrir fonte oficial</a></article>)}</div>
  </div></section>

  <section className="v2-section v2-soft"><div className="v2-container"><SectionHead kicker="COMO ESCOLHER" title="Cinco perguntas antes de comparar modelos"/><div className="v2-question-grid"><div><strong>01</strong><span>Qual vazão real a planta consome?</span></div><div><strong>02</strong><span>Qual pressão em bar precisa chegar ao ponto de uso?</span></div><div><strong>03</strong><span>A demanda é constante ou varia ao longo do turno?</span></div><div><strong>04</strong><span>O processo exige ar isento de óleo ou tratamento específico?</span></div><div><strong>05</strong><span>Qual é a criticidade de uma eventual parada?</span></div></div></div></section>

  <section className="v2-section"><div className="v2-container v2-official-link"><div><SectionHead title="Tecnologia Ingersoll Rand"/><p>A TecAr é assistência e revenda autorizada Ingersoll Rand. Para especificações e disponibilidade das linhas atuais, consulte também a documentação oficial do fabricante.</p></div><a href="https://www.ingersollrand.com/pt-br/products/air-compressors/" target="_blank" rel="noreferrer" className="v2-secondary">Site oficial Ingersoll Rand</a></div></section>
  <ContactBand/>
</PageFrame>}
