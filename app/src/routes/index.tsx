import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

export const Route = createFileRoute("/")({ component: Index });

const services = [
  ["Manutenção","Assistência técnica, contratos, preventivas, corretivas e histórico de cada ativo."],
  ["Locação","Soluções temporárias e contratos de longo prazo para preservar disponibilidade."],
  ["Engenharia","Diagnóstico, eficiência energética, redes de ar e casa de máquinas."],
  ["TecAr Connect","Monitoramento remoto contínuo de variáveis críticas, comportamento e alarmes."]
];
const process = [
  ["Monitorar","Dados do equipamento e do sistema ficam visíveis continuamente."],
  ["Identificar","Desvios e alarmes ganham contexto."],
  ["Planejar","Histórico e programação organizam a próxima ação."],
  ["Intervir","A equipe técnica executa o atendimento."],
  ["Documentar","OS e evidências ficam registradas."],
  ["Prevenir","O histórico melhora a próxima decisão."]
];
const products = ["Compressores","Linhas de ar","Secadores","Acessórios","Safety Air"];
const metrics:[string,string,number][] = [
  ["Temperatura","71 °C",71],["Ponto de orvalho","+2 °C",42],["Energia","43,8 kW",66],["Carga","76%",76]
];

function Index(){
  const [power,setPower]=useState("75"),[hours,setHours]=useState("16"),[days,setDays]=useState("300"),[tariff,setTariff]=useState("0.85"),[loss,setLoss]=useState("20");
  const annualLoss=useMemo(()=>{
    const v=[power,hours,days,tariff,loss].map(x=>Number(x.replace(",",".")));
    return v.some(x=>Number.isNaN(x)||x<0)?0:v[0]*v[1]*v[2]*v[3]*(v[4]/100);
  },[power,hours,days,tariff,loss]);

  return <main className="tecarSite">
    <header className="topNav">
      <a className="brandLockup" href="#inicio"><img src="/assets/tecar/logo.gif" alt="TecAr Compressores"/></a>
      <nav className="desktopNav"><a href="#empresa">Empresa</a><a href="#solucoes">Soluções</a><a href="#connect">Monitoramento</a><a href="#produtos">Produtos</a><a href="#conteudo">Conteúdo</a></nav>
      <a className="navContact" href="#contato">Contato</a>
    </header>

    <section id="inicio" className="heroWrap"><ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme}/></section>

    <section className="proofRail"><span>Desde 1999</span><span>Ingersoll Rand</span><span>Curitiba</span><span>Paranaguá</span><span>Assistência autorizada</span><span>Engenharia</span><span>Monitoramento remoto</span></section>

    <section id="solucoes" className="section shell servicesSection">
      <div className="sectionLead"><p className="microLabel">ECOSSISTEMA TECAR</p><h2>Do equipamento ao dado. Do dado à decisão.</h2><p>O sistema de ar comprimido não termina no compressor. A TecAr conecta fornecimento, disponibilidade, manutenção, engenharia e acompanhamento contínuo.</p></div>
      <div className="serviceMatrix">{services.map(([title,text],i)=><article className={"serviceItem serviceItem"+(i+1)} key={title}><span className="serviceIndex">0{i+1}</span><h3>{title}</h3><p>{text}</p><a href={title==="TecAr Connect"?"#connect":"#contato"}>Explorar</a></article>)}</div>
    </section>

    <section id="connect" className="connectSection">
      <div className="connectVisual"><img src="/assets/tecar/banner-03.png" alt=""/><div className="sensorSweep"/></div>
      <div className="connectPanel"><p className="microLabel">TECAR CONNECT</p><h2>Enquanto a produção funciona, os dados continuam falando.</h2><p>Monitoramento remoto contínuo para acompanhar parâmetros do sistema, comportamento do equipamento, alarmes e histórico. Uma camada adicional de visibilidade para manutenção e operação.</p>
        <div className="telemetryGrid">{metrics.map(([label,value,pct])=><div className="telemetryRow" key={label}><div><span>{label}</span><strong>{value}</strong></div><div className="meter"><i style={{width:pct+"%"}}/></div></div>)}</div>
        <p className="demoNote">Visualização demonstrativa. Os parâmetros reais dependem da instalação monitorada.</p><a className="connectCta" href="#contato">Conhecer monitoramento</a>
      </div>
    </section>

    <section className="processSection"><div className="shell"><h2>Um ciclo operacional, não uma sequência de improvisos.</h2><div className="processTrack">{process.map(([title,text],i)=><article key={title}><span>{String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section id="manutencao" className="section shell maintenanceSection">
      <div className="maintenanceImage"><img src="/assets/tecar/empresa.jpg" alt="Estrutura TecAr Compressores"/></div>
      <div className="maintenanceCopy"><h2>Assistência técnica com histórico, método e continuidade.</h2><p>Preventivas, corretivas, contratos e acompanhamento dos ativos fazem parte do mesmo processo. O objetivo é reduzir surpresa, retorno e tempo de parada.</p><ul><li>Ordens de serviço e rastreabilidade</li><li>Programação de preventivas e contratos</li><li>Histórico técnico por equipamento</li><li>Registros e evidências</li><li>Suporte a requisitos aplicáveis, incluindo NR13 quando pertinente</li></ul></div>
    </section>

    <section id="locacao" className="rentalSection"><div className="rentalImage"><img src="/assets/tecar/banner-01.png" alt=""/></div><div className="rentalCard"><h2>Disponibilidade sem transformar toda necessidade em CAPEX.</h2><p>Locação emergencial e contratos de longo prazo para situações em que continuidade, previsibilidade e flexibilidade importam mais do que possuir o equipamento.</p><div className="rentalStats"><span>Emergencial</span><span>Longo prazo</span><span>Suporte técnico</span></div></div></section>

    <section id="engenharia" className="section shell engineeringSection">
      <div className="engineeringCopy"><p className="microLabel">ENGENHARIA</p><h2>Eficiência energética começa medindo o que hoje está invisível.</h2><p>Diagnósticos, redes de ar comprimido, casa de máquinas, perdas e consumo energético podem ser tratados como engenharia, não como adivinhação.</p><div className="engineeringScope"><span>Diagnóstico</span><span>Redes de ar</span><span>Eficiência energética</span><span>Casa de máquinas</span></div></div>
      <div className="calculator"><h3>Simule o custo anual de uma perda</h3><p>Estimativa simplificada para enxergar ordem de grandeza.</p><div className="calcGrid">
        <label>Potência do compressor (kW)<input value={power} onChange={e=>setPower(e.target.value)}/></label>
        <label>Horas por dia<input value={hours} onChange={e=>setHours(e.target.value)}/></label>
        <label>Dias por ano<input value={days} onChange={e=>setDays(e.target.value)}/></label>
        <label>Tarifa (R$/kWh)<input value={tariff} onChange={e=>setTariff(e.target.value)}/></label>
        <label>Perda estimada (%)<input value={loss} onChange={e=>setLoss(e.target.value)}/></label>
      </div><div className="calcResult"><span>Custo estimado da perda</span><strong>{annualLoss.toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0})}/ano</strong></div><a className="engineeringCta" href="#contato">Solicitar diagnóstico</a></div>
    </section>

    <section id="produtos" className="productsSection"><div className="shell"><h2>Equipamentos e componentes do sistema completo.</h2><div className="productRail">{products.map((title,i)=><article key={title}><div className="productImg"><img src={"/assets/tecar/banner-0"+((i%4)+1)+".png"} alt=""/></div><h3>{title}</h3><p>Soluções integradas ao sistema de ar comprimido, com aplicação orientada à necessidade da planta.</p></article>)}</div></div></section>

    <section className="portSection"><img src="/assets/tecar/banner-04.png" alt=""/><div className="portOverlay"><p className="microLabel">TECAR PORTUÁRIA</p><h2>Suporte técnico onde a operação não pode simplesmente esperar.</h2><p>A presença em Paranaguá aproxima atendimento, engenharia e assistência de operações portuárias e industriais com alta exigência de disponibilidade.</p><a className="portCta" href="#contato">Falar com Paranaguá</a></div></section>

    <section id="empresa" className="section shell companySection"><div className="companyIntro"><h2>Experiência construída no campo desde 1999.</h2><p>A TecAr atua com compressores de ar, assistência técnica, locação, engenharia e automação, atendendo a indústria a partir de Curitiba e Paranaguá.</p></div><div className="companyGrid"><article><h3>Missão</h3><p>Soluções de ar comprimido com responsabilidade técnica, continuidade e foco na operação.</p></article><article><h3>Visão</h3><p>Evoluir como parceiro conectado à disponibilidade e eficiência industrial.</p></article><article><h3>Valores</h3><p>Segurança, ética, qualidade técnica, melhoria contínua, proximidade e compromisso.</p></article><article><h3>Compromissos</h3><p>Qualificação, ações sociais, responsabilidade e reconhecimento construído ao longo dos anos.</p></article></div></section>

    <section id="conteudo" className="contentSection"><div className="shell contentLayout"><div><h2>Conhecimento útil antes de virar emergência.</h2></div><div className="articleList"><a href="https://www.tecarcompressores.com.br/blog" target="_blank" rel="noreferrer"><span>Eficiência energética industrial</span><b>Ver artigos</b></a><a href="https://www.tecarcompressores.com.br/blog" target="_blank" rel="noreferrer"><span>Ar comprimido</span><b>Ver artigos</b></a><a href="https://www.tecarcompressores.com.br/blog" target="_blank" rel="noreferrer"><span>Tubulação de alumínio</span><b>Ver artigos</b></a></div></div></section>

    <section id="contato" className="contactSection"><div className="shell contactGrid"><div className="contactPitch"><p className="microLabel">CONTATO</p><h2>Conte o que está acontecendo na sua operação.</h2><p>Atendimento comercial e técnico para Curitiba, Paranaguá e região.</p><a className="contactCta" href="https://wa.me/5541996441330?text=Ol%C3%A1%2C%20vim%20pelo%20site!" target="_blank" rel="noreferrer">Falar com a TecAr</a></div><form className="contactForm" action="mailto:tecarindustrial@tecarcompressores.com.br" method="post"><label>Nome<input name="nome" required/></label><label>Empresa<input name="empresa"/></label><label>E-mail<input name="email" type="email" required/></label><label>Telefone<input name="telefone"/></label><label className="fullField">Como podemos ajudar?<textarea name="mensagem" rows={4} required/></label><button type="submit">Enviar contato</button></form></div></section>

    <section className="careersSection"><div className="shell careersInner"><div><span>Trabalhe Conosco</span><h2>Quer fazer parte da TecAr?</h2></div><a className="careerCta" href="https://www.tecarcompressores.com.br/trabalhe-conosco" target="_blank" rel="noreferrer">Enviar currículo</a></div></section>

    <footer className="siteFooter"><div className="shell footerTop"><img src="/assets/tecar/logo.gif" alt="TecAr Compressores"/><div><strong>Curitiba</strong><a href="mailto:tecarindustrial@tecarcompressores.com.br">tecarindustrial@tecarcompressores.com.br</a><span>(41) 3376-9966</span></div><div><strong>Paranaguá</strong><a href="mailto:tecarportuaria@tecarcompressores.com.br">tecarportuaria@tecarcompressores.com.br</a><span>(41) 3422-7855</span></div><div><strong>WhatsApp</strong><a href="https://wa.me/5541996441330" target="_blank" rel="noreferrer">(41) 99644-1330</a></div></div><div className="shell footerBottom"><span>© {new Date().getFullYear()} TecAr Compressores</span><span>Compressores, manutenção, locação, engenharia e monitoramento.</span></div></footer>
  </main>
}
