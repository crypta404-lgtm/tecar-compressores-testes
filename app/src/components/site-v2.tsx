import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const productLinks = [
  ["/produtos","Visão geral"],
  ["/compressores","Compressores"],
  ["/secadores","Secadores"],
  ["/linhas-de-ar","Linhas de ar"],
  ["/acessorios","Acessórios"],
  ["/safety-air","Safety Air"],
] as const;

const serviceLinks = [
  ["/servicos","Visão geral"],
  ["/diagnostico","Diagnóstico"],
  ["/manutencao","Manutenção"],
  ["/engenharia","Engenharia"],
  ["/locacao","Locação"],
  ["/tecar-connect","TecAr Connect"],
] as const;

export function SiteHeader(){
  return <header className="v2-header">
    <div className="v2-topline"><div className="v2-container v2-topline-inner"><span>Curitiba: (41) 3376-9966</span><span>Paranaguá: (41) 3422-7855</span><a href="https://wa.me/5541996441330" target="_blank" rel="noreferrer">WhatsApp</a></div></div>
    <div className="v2-container v2-navrow">
      <Link to="/" className="v2-logo"><img src="/assets/tecar/logo.gif" alt="TecAr Compressores"/></Link>
      <nav className="v2-mainnav" aria-label="Navegação principal">
        <Link to="/">Home</Link>
        <Link to="/empresa">Empresa</Link>
        <div className="v2-navgroup"><button type="button">Produtos <span>⌄</span></button><div className="v2-dropdown">{productLinks.map(([to,label])=><Link key={to} to={to}>{label}</Link>)}</div></div>
        <div className="v2-navgroup"><button type="button">Serviços <span>⌄</span></button><div className="v2-dropdown">{serviceLinks.map(([to,label])=><Link key={to} to={to}>{label}</Link>)}</div></div>
        <Link to="/conteudo">Conteúdo</Link>
        <Link to="/contato">Contato</Link>
      </nav>
      <Link to="/contato" className="v2-navcta">Solicitar orçamento</Link>
      <details className="v2-mobilemenu"><summary>Menu</summary><div className="v2-mobilepanel"><Link to="/">Home</Link><Link to="/empresa">Empresa</Link><strong>Produtos</strong>{productLinks.map(([to,label])=><Link key={to} to={to}>{label}</Link>)}<strong>Serviços</strong>{serviceLinks.map(([to,label])=><Link key={to} to={to}>{label}</Link>)}<Link to="/conteudo">Conteúdo</Link><Link to="/contato">Contato</Link><Link to="/trabalhe-conosco">Trabalhe Conosco</Link></div></details>
    </div>
  </header>
}

export function SiteFooter(){
  return <footer className="v2-footer">
    <div className="v2-container v2-footer-grid">
      <div className="v2-footer-brand"><img src="/assets/tecar/logo.gif" alt="TecAr Compressores"/><p>Soluções completas em ar comprimido, automação, locação, engenharia, manutenção e monitoramento.</p></div>
      <div><h4>Curitiba</h4><p>R. das Carmelitas, 1935<br/>Boqueirão, Curitiba PR</p><a href="tel:+554133769966">(41) 3376-9966</a><a href="mailto:tecarindustrial@tecarcompressores.com.br">tecarindustrial@tecarcompressores.com.br</a></div>
      <div><h4>Paranaguá</h4><p>R. Prof. Décio, 197<br/>Rocio, Paranaguá PR</p><a href="tel:+554134227855">(41) 3422-7855</a><a href="mailto:tecarportuaria@tecarcompressores.com.br">tecarportuaria@tecarcompressores.com.br</a></div>
      <div><h4>Acesso rápido</h4><Link to="/manutencao">Manutenção</Link><Link to="/locacao">Locação</Link><Link to="/engenharia">Engenharia</Link><Link to="/tecar-connect">Monitoramento</Link><Link to="/trabalhe-conosco">Trabalhe Conosco</Link></div>
    </div>
    <div className="v2-container v2-footer-bottom"><span>© {new Date().getFullYear()} TecAr Compressores</span><span>Assistência e revenda autorizada Ingersoll Rand desde 1999.</span></div>
  </footer>
}

export function PageFrame({children}:{children:ReactNode}){return <div className="tecar-site-v2"><SiteHeader/><main>{children}</main><SiteFooter/></div>}

export function PageHero({kicker,title,text,image,children}:{kicker?:string;title:string;text:string;image:string;children?:ReactNode}){
  return <section className="v2-pagehero"><div className="v2-container v2-pagehero-grid"><div className="v2-pagehero-copy">{kicker&&<span className="v2-kicker">{kicker}</span>}<h1>{title}</h1><p>{text}</p>{children}</div><div className="v2-pagehero-media"><img src={image} alt=""/></div></div></section>
}

export function SectionHead({kicker,title,text}:{kicker?:string;title:string;text?:string}){
  return <div className="v2-sectionhead">{kicker&&<span className="v2-kicker">{kicker}</span>}<h2>{title}</h2>{text&&<p>{text}</p>}</div>
}

export function ContactBand({title="Precisa de uma solução para sua operação?",text="Nossa equipe técnica pode ajudar a dimensionar a alternativa adequada para o seu sistema de ar comprimido."}:{title?:string;text?:string}){
  return <section className="v2-contactband"><div className="v2-container v2-contactband-inner"><div><h2>{title}</h2><p>{text}</p></div><Link to="/contato" className="v2-primary">Falar com especialista</Link></div></section>
}

export function VideoEmbed({id,title}:{id:string;title:string}){
  return <article className="v2-video-card"><div className="v2-video-wrap"><iframe src={"https://www.youtube-nocookie.com/embed/"+id} title={title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div><h3>{title}</h3></article>
}
