import { createFileRoute } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { Award, BadgeCheck, Gift, GraduationCap, HandHeart, History, Mail, MapPin, Phone, Users } from "lucide-react";
import { PageFrame, PageHero, ContactBand, VideoEmbed } from "@/components/site-v2";
import { CountUp } from "@/components/motion";
import { CommunityGallery } from "@/components/community-gallery";
import { pageMeta } from "@/lib/page-meta";
export const Route=createFileRoute("/empresa")({head:()=>pageMeta("/empresa","Empresa | TecAr Compressores","Conheça a TecAr Compressores, sua trajetória desde 1999, o Instituto Luiz Gonzaga e as ações sociais realizadas pela empresa.","/assets/v2/tecar-service.png"),component:Page});

const VALUES=["Ética","Segurança","Qualidade técnica","Responsabilidade","Melhoria contínua","Compromisso com o cliente"];

const STORIES=[
 {icon:Gift,title:"Um Natal mais próximo",text:"Entregamos presentes de Natal para crianças de comunidades ribeirinhas do Paraná. É uma oportunidade de compartilhar alegria e fortalecer os vínculos com as famílias da região."},
 {icon:HandHeart,title:"Cuidado em todas as idades",text:"Apoiamos lares de idosos e participamos de iniciativas de acolhimento e convivência. Doações, visitas e atenção fazem parte desse compromisso com as pessoas."},
 {icon:Users,title:"Uma equipe que participa",text:"Ações de Páscoa, campanhas como o Agosto Lilás e outras iniciativas mobilizam nossa equipe em torno da solidariedade e do cuidado com a comunidade."},
];

const AWARDS:Array<{year:string;items:Array<{title:string;note?:string}>}>=[
 {year:"2023",items:[{title:"Melhor performance geral"},{title:"Melhor venda de valor"},{title:"Destaque no treinamento de vendas"}]},
 {year:"2022",items:[{title:"Melhor performance pós-venda"}]},
 {year:"2017",items:[{title:"Destaque de vendas",note:"Segmento comercial e premium"},{title:"Destaque de vendas",note:"Contact Cooled"}]},
 {year:"Processos comerciais",items:[{title:"Melhores práticas do Salesforce"}]},
];

// Add new awards to AWARDS; the counters and the timeline follow automatically.
const AWARD_ITEMS=AWARDS.flatMap((group)=>group.items);
const AWARD_INDEX=new Map(AWARD_ITEMS.map((item,index)=>[item,index]));
const AWARD_COUNT=AWARD_ITEMS.length;
const AWARD_YEARS=AWARDS.filter((group)=>/^\d{4}$/.test(group.year)).length;

const PILLARS=[
 {icon:History,title:"Experiência",text:"Atuação contínua no mercado industrial desde 1999."},
 {icon:BadgeCheck,title:"Autorização",text:"Assistência técnica e revenda autorizada Ingersoll Rand."},
 {icon:GraduationCap,title:"Capacitação",text:"Técnicos certificados e atualizações recorrentes de diagnóstico e tecnologia."},
 {icon:MapPin,title:"Presença",text:"Sede em Curitiba e atendimento em todo o Paraná, perto de quem está na operação."},
 {icon:Award,title:"Pós-vendas",text:"Histórico de reconhecimento da operação de pós-vendas da TecAr."},
];

const UNITS=[
 {city:"Curitiba",address:"R. das Carmelitas, 1935, Boqueirão, Curitiba PR",phone:"(41) 3376-9966",tel:"+554133769966",mail:"tecarindustrial@tecarcompressores.com.br"},
];

function Page(){return <PageFrame>
<PageHero kicker="A TECAR" title="Experiência técnica construída desde 1999." text="A TecAr atua com soluções para ar comprimido, reunindo equipamentos, assistência, engenharia, locação e tecnologia para atender a indústria." image="/assets/unique/generated/company-hero.webp"><a href="https://wa.me/5541996441330?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20TecAr." target="_blank" rel="noopener noreferrer" className="v2-primary">Falar com a TecAr</a></PageHero>

<section className="ab-section ab-intro"><div className="v2-container">
 <div className="ab-intro-copy"><h2>Compressores e competência.</h2><p>A empresa é assistência técnica e revendedora autorizada Ingersoll Rand desde 1999. A equipe técnica recebe capacitação e atualização para acompanhar equipamentos, ferramentas de diagnóstico e novas tecnologias.</p></div>
 <dl className="ab-stats"><div><dt>início da atuação</dt><dd>1999</dd></div><div><dt>clientes atendidos</dt><dd>500<span>+</span></dd></div><div><dt>atendimento em todo o</dt><dd>PR</dd></div></dl>
</div></section>

<section className="ab-section ab-purpose"><div className="v2-container">
 <span className="v2-kicker">MISSÃO, VISÃO E VALORES</span>
 <p className="ab-mission"><b>Nossa missão é</b> oferecer soluções confiáveis em ar comprimido com orientação técnica, suporte contínuo e foco na operação do cliente.</p>
 <div className="ab-purpose-grid">
  <article><h3>Visão</h3><p>Ser reconhecida pela capacidade técnica, proximidade e evolução constante das soluções de ar comprimido.</p></article>
  <article><h3>Valores</h3><ul className="ab-chips">{VALUES.map((v)=><li key={v}>{v}</li>)}</ul></article>
  <article><h3>Responsabilidade</h3><p>O Instituto Luiz Gonzaga e as ações mensais da TecAr conectam a empresa à sociedade e ao meio ambiente.</p><a href="#instituto" className="ab-link">Conheça o instituto</a></article>
 </div>
</div></section>

<section className="ab-section ab-community" id="instituto"><div className="v2-container">
 <div className="ab-community-head ab-community-head-solo"><div><span className="v2-kicker">NOSSA PRESENÇA NA COMUNIDADE</span><h2>Instituto Luiz Gonzaga</h2></div></div>
 <CommunityGallery/>
 <div className="ab-stories">{STORIES.map(({icon:Icon,title,text})=><article key={title}><span className="ab-icon"><Icon aria-hidden="true" size={22}/></span><h3>{title}</h3><p>{text}</p></article>)}</div>
</div></section>

<section className="ab-section ab-awards ab-awards-v3" id="premios" aria-labelledby="premios-title"><div className="v2-container">
 <div className="aw-head">
  <div><span className="v2-kicker">RECONHECIMENTO</span><h2 id="premios-title">Competência reconhecida. Compromisso renovado.</h2><p>Os reconhecimentos recebidos pela TecAr refletem o trabalho da equipe em vendas, capacitação e pós-venda. Para nossos clientes, representam uma trajetória de dedicação ao atendimento e à construção de soluções de valor.</p></div>
  <dl className="aw-stats">
   <div><dd><CountUp value={AWARD_COUNT}/></dd><dt>reconhecimentos Ingersoll Rand</dt></div>
   <div><dd><CountUp value={AWARD_YEARS}/></dd><dt>anos com premiação</dt></div>
  </dl>
 </div>
 <div className="aw-body">
  <figure className="aw-photo"><div className="aw-photo-frame"><img src="/assets/community/premios-tecar-v2.webp" width="645" height="374" loading="lazy" alt="Troféus e reconhecimentos da TecAr expostos junto às marcas TecAr e Ingersoll Rand"/></div><figcaption>Reconhecimentos Ingersoll Rand que fazem parte da história da TecAr.</figcaption></figure>
  <div className="aw-timeline"><span className="aw-rail" aria-hidden="true"/>
   <ol>{AWARDS.map((group)=><li key={group.year} className="aw-year"><span className="aw-year-label">{group.year}</span><ul>{group.items.map((item)=><li key={item.title+(item.note??"")} className="aw-card" style={{"--d":AWARD_INDEX.get(item)??0} as CSSProperties}><span className="aw-card-icon" aria-hidden="true"><Award size={20}/></span><div><b>{item.title}</b>{item.note&&<small>{item.note}</small>}</div></li>)}</ul></li>)}</ol>
  </div>
 </div>
</div></section>

<section className="ab-section ab-pillars"><div className="v2-container">
 <div className="ab-pillars-head"><span className="v2-kicker">COMPETÊNCIA</span><h2>O que sustenta o atendimento</h2></div>
 <div className="ab-pillar-grid">{PILLARS.map(({icon:Icon,title,text})=><article key={title}><span className="ab-icon"><Icon aria-hidden="true" size={22}/></span><h3>{title}</h3><p>{text}</p></article>)}</div>
</div></section>

<section className="ab-section ab-videos"><div className="v2-container">
 <h2>Veja a TecAr em vídeo</h2>
 <div className="v2-video-grid"><VideoEmbed id="vSjkXQut3jQ" title="Institucional TecAr"/><VideoEmbed id="clxX-mMdwYQ" title="Motores HPM"/></div>
</div></section>

<section className="ab-section ab-units"><div className="v2-container">
 <h2>Sede em Curitiba, atendimento em todo o Paraná.</h2>
 <div className="ab-unit-grid">{UNITS.map((u)=><article key={u.city}><h3>{u.city}</h3><p><MapPin aria-hidden="true" size={18}/>{u.address}</p><a href={`tel:${u.tel}`}><Phone aria-hidden="true" size={18}/>{u.phone}</a><a href={`mailto:${u.mail}`}><Mail aria-hidden="true" size={18}/>{u.mail}</a></article>)}</div>
</div></section>
<ContactBand/></PageFrame>}
