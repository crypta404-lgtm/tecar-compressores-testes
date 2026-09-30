import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";

const productLinks = [
  ["/produtos","Visão geral"],
  ["/compressores","Compressores"],
  ["/secadores","Secadores"],
  ["/linhas-de-ar","Linhas de ar"],
  ["/acessorios","Acessórios"],
  ["/safety-air","Safety Air"],
] as const;

const serviceLinks = [
  ["/manutencao","Manutenção"],
  ["/engenharia","Engenharia"],
  ["/locacao","Locação"],
  ["/tecar-connect","TecAr Connect"],
] as const;

export function WhatsAppLink({href,children,className}:{href:string;children:ReactNode;className?:string}){
  const [locked,setLocked]=useState(false);
  const handleClick=(event:MouseEvent<HTMLAnchorElement>)=>{
    if(locked){ event.preventDefault(); return; }
    setLocked(true);
    window.setTimeout(()=>setLocked(false),3000);
  };
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-disabled={locked} data-locked={locked?"true":"false"} onClick={handleClick}>{children}</a>
}

export function SiteHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [openMenu, setOpenMenu] = useState<"products" | "services" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const productsActive = productLinks.some(([to]) => to === pathname);
  const servicesActive = pathname === "/servicos" || serviceLinks.some(([to]) => to === pathname);

  useEffect(() => { setOpenMenu(null); setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) { setOpenMenu(null); setMobileOpen(false); }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (mobileOpen) mobileToggleRef.current?.focus();
      if (openMenu) headerRef.current?.querySelector<HTMLButtonElement>('[aria-controls="tc-' + openMenu + '"]')?.focus();
      setOpenMenu(null);
      setMobileOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", dismiss); document.removeEventListener("keydown", escape); };
  }, [mobileOpen, openMenu]);

  return <header className="tc-header" ref={headerRef}>
    <a href="#main-content" className="tc-skip-link">Ir para o conteúdo</a>
    <div className="tc-utility"><div className="v2-container"><span>Engenharia em ar comprimido. Desde 1999.</span><div><a href="tel:+554133769966">Curitiba <span>(41) 3376-9966</span></a><a href="tel:+554134227855">Paranaguá <span>(41) 3422-7855</span></a></div></div></div>
    <div className="v2-container tc-navrow">
      <Link to="/" className="tc-logo" aria-label="TecAr Compressores, início"><img src="/assets/tecar/logo-cropped.png" alt="TecAr Compressores" width="160" height="68" /></Link>
      <nav className="tc-nav" aria-label="Navegação principal"><Link to="/diagnostico" activeProps={{ "data-active": "true" }}>Diagnósticos</Link>
        <Link to="/empresa" activeProps={{ "data-active": "true" }}>A TecAr</Link>
        <div className="tc-navgroup">
          <button type="button" data-active={productsActive || undefined} aria-expanded={openMenu === "products"} aria-controls="tc-products" onClick={() => setOpenMenu(openMenu === "products" ? null : "products")}>Produtos <ChevronDown size={14} aria-hidden="true" /></button>
          {openMenu === "products" && <div className="tc-dropdown" id="tc-products">{productLinks.map(([to, label]) => <Link key={to} to={to} onClick={() => setOpenMenu(null)}>{label}<ArrowUpRight size={15} aria-hidden="true" /></Link>)}</div>}
        </div>
        <div className="tc-navgroup">
          <button type="button" data-active={servicesActive || undefined} aria-expanded={openMenu === "services"} aria-controls="tc-services" onClick={() => setOpenMenu(openMenu === "services" ? null : "services")}>Serviços <ChevronDown size={14} aria-hidden="true" /></button>
          {openMenu === "services" && <div className="tc-dropdown" id="tc-services"><Link to="/servicos" onClick={() => setOpenMenu(null)}>Todos os serviços<ArrowUpRight size={15} aria-hidden="true" /></Link>{serviceLinks.map(([to, label]) => <Link key={to} to={to} onClick={() => setOpenMenu(null)}>{label}<ArrowUpRight size={15} aria-hidden="true" /></Link>)}</div>}
        </div>

      </nav>
      <WhatsAppLink href="https://wa.me/5541996441330?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20TecAr." className="tc-header-contact">Fale com a TecAr <span><ArrowUpRight size={20} aria-hidden="true" /></span></WhatsAppLink>
      <button ref={mobileToggleRef} className="tc-menu-toggle" type="button" aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={mobileOpen} aria-controls="tc-mobile-nav" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
    </div>
    {mobileOpen && <nav className="tc-mobile-nav" id="tc-mobile-nav" aria-label="Navegação móvel" onClick={(event) => { if ((event.target as HTMLElement).closest("a")) setMobileOpen(false); }}>
      <div className="tc-mobile-top"><Link to="/diagnostico">Diagnósticos</Link><Link to="/">Início</Link><Link to="/empresa">A TecAr</Link></div>
      <div className="tc-mobile-columns"><div><strong>Produtos</strong>{productLinks.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}</div><div><strong>Serviços</strong><Link to="/servicos">Visão geral</Link>{serviceLinks.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}</div></div>
      <div className="tc-mobile-bottom"><WhatsAppLink href="https://wa.me/5541996441330">Falar pelo WhatsApp <ArrowUpRight size={18} aria-hidden="true" /></WhatsAppLink><Link to="/trabalhe-conosco">Trabalhe conosco</Link></div>
    </nav>}
  </header>;
}

export function SiteFooter(){
  return <footer className="v2-footer">
    <div className="v2-container tc-footer-top"><span>Engenharia em ar comprimido.</span><Link to="/empresa">Desde 1999 <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    <div className="v2-container v2-footer-grid">
      <div className="v2-footer-brand"><img src="/assets/tecar/logo-cropped.png" alt="TecAr Compressores"/><p>Ar comprimido industrial: equipamentos, assistência, engenharia e locação.</p></div>
      <div><h4>Curitiba</h4><p>R. das Carmelitas, 1935<br/>Boqueirão, Curitiba PR</p><a href="tel:+554133769966">(41) 3376-9966</a><a href="mailto:tecarindustrial@tecarcompressores.com.br">tecarindustrial@tecarcompressores.com.br</a></div>
      <div><h4>Paranaguá</h4><p>R. Prof. Décio, 197<br/>Rocio, Paranaguá PR</p><a href="tel:+554134227855">(41) 3422-7855</a><a href="mailto:tecarportuaria@tecarcompressores.com.br">tecarportuaria@tecarcompressores.com.br</a></div>
      <div className="v2-footer-quick"><h4>Acesso rápido</h4><Link to="/diagnostico">Diagnóstico</Link><Link to="/manutencao">Manutenção</Link><Link to="/locacao">Locação</Link><Link to="/engenharia">Engenharia</Link><Link to="/tecar-connect">Monitoramento</Link><Link to="/trabalhe-conosco">Trabalhe conosco</Link></div>
    </div>
    <div className="v2-container tc-footer-signature" aria-hidden="true">TecAr<span>.</span></div>
    <p className="v2-container tc-photo-note">As cenas editoriais geradas por IA são ilustrativas e não representam instalações, equipes ou modelos reais da TecAr. As fichas de produtos utilizam imagens de referência dos fabricantes.</p><div className="v2-container v2-footer-bottom"><span>© {new Date().getFullYear()} TecAr Compressores</span><span>Assistência e revenda autorizada Ingersoll Rand desde 1999.</span></div>
  </footer>
}

export function PageFrame({children}:{children:ReactNode}){return <div className="tecar-site-v2 tc-editorial"><SiteHeader/><main id="main-content">{children}</main><SiteFooter/></div>}
export function PageHero({kicker,title,text,image,children}:{kicker?:string;title:string;text:string;image:string;children?:ReactNode}){return <section className="v2-pagehero"><div className="v2-container v2-pagehero-grid"><div className="v2-pagehero-copy">{kicker&&<span className="v2-kicker">{kicker}</span>}<h1>{title}</h1><p>{text}</p>{children}</div><div className="v2-pagehero-media"><img src={image} alt={image.includes("/unique/generated/")?"Imagem ilustrativa criada por IA":""}/></div></div></section>}
export function SectionHead({kicker,title,text}:{kicker?:string;title:string;text?:string}){return <div className="v2-sectionhead">{kicker&&<span className="v2-kicker">{kicker}</span>}<h2>{title}</h2>{text&&<p>{text}</p>}</div>}
export function ContactBand({title="Precisa resolver algo no sistema de ar?",text="Descreva a necessidade. A TecAr direciona o próximo passo."}:{title?:string;text?:string}){return <section className="v2-contactband"><div className="v2-container v2-contactband-inner"><div><h2>{title}</h2><p>{text}</p></div><WhatsAppLink href="https://wa.me/5541996441330?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20TecAr." className="v2-primary">Falar com especialista <ArrowUpRight size={20} aria-hidden="true" /></WhatsAppLink></div></section>}
export function VideoEmbed({id,title}:{id:string;title:string}){return <article className="v2-video-card"><div className="v2-video-wrap"><iframe src={"https://www.youtube-nocookie.com/embed/"+id} title={title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div><h3>{title}</h3></article>}
