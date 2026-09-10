import { createFileRoute } from "@tanstack/react-router";
import { PageFrame, PageHero, SectionHead } from "@/components/site-v2";
import { pageMeta } from "@/lib/page-meta";
export const Route=createFileRoute("/contato")({head:()=>pageMeta("/contato","Contato | TecAr Compressores","Fale com a TecAr Compressores em Curitiba ou Paranaguá para orçamento, assistência, locação, engenharia e monitoramento.","/assets/v2/tecar-service.png"),component:Page});
const subjects=[
 ["Assistência técnica","Meu compressor precisa de manutenção ou diagnóstico."],
 ["Comprar equipamento","Quero dimensionar compressor, secador ou acessórios."],
 ["Locação","Preciso de geração de ar temporária ou por contrato."],
 ["Engenharia","Quero avaliar perdas, rede, consumo ou projeto."],
 ["Monitoramento","Quero entender TecAr Connect e TUDO REMOTO."],
 ["Safety Air","Quero estudar uma instalação modular."]
];
function Page(){return <PageFrame><PageHero kicker="CONTATO" title="Comece pela necessidade da sua operação." text="Escolha o assunto, reúna as informações básicas e fale diretamente com a unidade TecAr mais adequada." image="/assets/v2/tecar-service.png"/>
<section className="v2-section"><div className="v2-container"><SectionHead title="Como podemos ajudar?"/><div className="v2-contact-subjects">{subjects.map(([t,d])=><article key={t}><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>
<section className="v2-section v2-soft"><div className="v2-container v2-contact-page-grid"><div><SectionHead title="Curitiba"/><p>R. das Carmelitas, 1935, Boqueirão, Curitiba PR</p><a href="tel:+554133769966">(41) 3376-9966</a><a href="mailto:tecarindustrial@tecarcompressores.com.br">tecarindustrial@tecarcompressores.com.br</a></div><div><SectionHead title="Paranaguá"/><p>R. Prof. Décio, 197, Rocio, Paranaguá PR</p><a href="tel:+554134227855">(41) 3422-7855</a><a href="mailto:tecarportuaria@tecarcompressores.com.br">tecarportuaria@tecarcompressores.com.br</a></div><div className="v2-whatsapp-box"><span>ATENDIMENTO RÁPIDO</span><h3>Prefere WhatsApp?</h3><p>Envie empresa, cidade, equipamento e uma descrição objetiva da necessidade.</p><a href="https://wa.me/5541996441330?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20TecAr." target="_blank" rel="noreferrer" className="v2-primary">Abrir WhatsApp</a></div></div></section></PageFrame>}
