import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, PageHero, SectionHead, ContactBand } from "@/components/site-v2";
import { pageMeta } from "@/lib/page-meta";
export const Route=createFileRoute("/compressores")({head:()=>pageMeta("/compressores","Compressores de Ar | TecAr","Compressores HPM, alta pressão, Série R, Nirvana, isentos de óleo e soluções para geração de gases.","/assets/v2/compressors.jpg"),component:Page});
const types=[
 ["Compressor HPM","Solução voltada a aplicações que exigem geração de ar industrial com configuração adequada à demanda."],
 ["Compressor de Alta Pressão","Para processos em que a pressão necessária ultrapassa as faixas convencionais de uma rede industrial."],
 ["Série R sobre base","Configuração para integração a sistemas que já possuem tratamento, reservação e infraestrutura definida."],
 ["Série R com reservatório","Conjunto compacto que integra geração e reservação para aplicações específicas."],
 ["Nirvana","Linha com controle de velocidade para ajustar a geração de ar conforme a demanda da instalação."],
 ["Isentos de óleo","Para processos com requisitos elevados de qualidade do ar e ausência de contaminação por óleo."],
 ["Gerador de gases","Soluções para aplicações que exigem geração dedicada de gases no próprio processo."]
];
function Page(){return <PageFrame>
<PageHero kicker="COMPRESSORES" title="A máquina certa começa pelo dimensionamento certo." text="Pressão, vazão, regime de trabalho, qualidade do ar e perfil de consumo definem qual compressor faz sentido para a sua aplicação." image="/assets/v2/compressors.jpg"><Link to="/contato" className="v2-primary">Dimensionar compressor</Link></PageHero>
<section className="v2-section"><div className="v2-container"><SectionHead title="Linhas e aplicações"/><div className="v2-model-grid">{types.map(([t,d],i)=><article key={t}><div className="v2-model-photo"><img src={i===4?"/assets/v2/nirvana.jpg":"/assets/v2/compressors.jpg"} alt=""/></div><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>
<section className="v2-section v2-soft"><div className="v2-container"><SectionHead kicker="COMO ESCOLHER" title="Cinco perguntas antes de comparar modelos"/><div className="v2-question-grid"><div><strong>01</strong><span>Qual vazão real a planta consome?</span></div><div><strong>02</strong><span>Qual pressão precisa chegar ao ponto de uso?</span></div><div><strong>03</strong><span>A demanda é constante ou varia ao longo do turno?</span></div><div><strong>04</strong><span>O processo exige ar isento de óleo ou tratamento específico?</span></div><div><strong>05</strong><span>Qual é a criticidade de uma eventual parada?</span></div></div></div></section>
<section className="v2-section"><div className="v2-container v2-official-link"><div><SectionHead title="Tecnologia Ingersoll Rand"/><p>A TecAr é assistência e revenda autorizada Ingersoll Rand. Para especificações detalhadas de linhas atuais, consulte também a documentação oficial do fabricante.</p></div><a href="https://www.ingersollrand.com/pt-br/products/air-compressors/" target="_blank" rel="noreferrer" className="v2-secondary">Site oficial Ingersoll Rand</a></div></section>
<ContactBand/></PageFrame>}
