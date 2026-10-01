import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
export function EquipmentHero(){
 return <section className="lux-hero" aria-labelledby="home-title">
  <div className="lux-hero-top"><span>TECAR / ENGENHARIA EM AR</span><span>CURITIBA — PARANAGUÁ</span></div>
  <h1 id="home-title">PRECISÃO<span className="tc-sr-only"> em ar comprimido para a sua indústria.</span></h1>
  <div className="lux-hero-object"><img src="/assets/unique/official/rental-rseries.webp" alt="Compressor de parafuso Ingersoll Rand série R" width="578" height="578" fetchPriority="high" /></div>
  <div className="lux-hero-side"><span className="lux-cross">+</span><p>Potência invisível.<br/>Impacto real.</p><span>Equipamentos. Engenharia.<br/>Continuidade operacional.</span></div>
  <div className="lux-hero-bottom"><div className="lux-hero-actions"><Link to="/produtos" className="lux-button">Explorar equipamentos <ArrowUpRight size={18}/></Link><a href="#atendimento" className="lux-link">Atendimento técnico <ArrowDown size={17}/></a></div><div className="lux-hero-index"><span>INGERSOLL RAND</span><p>Assistência e revenda autorizada<br/>Desde 1999.</p></div></div>
  <div className="lux-hero-foot"><span>TECNOLOGIA QUE SUSTENTA A SUA OPERAÇÃO.</span><span>01 — EQUIPAMENTOS & SOLUÇÕES</span></div>
 </section>
}
