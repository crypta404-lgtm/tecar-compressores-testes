import { createFileRoute, Link } from "@tanstack/react-router";
import { PageFrame, PageHero, ContactBand } from "@/components/site-v2";
import { Building2, ClipboardCheck, Gauge, Network, Zap } from "lucide-react";
import { EdCards, EdFact, EdHead, EdSection, EdSplit } from "@/components/editorial";
import { EnergyLossTool } from "@/components/client-tools";
import { pageMeta } from "@/lib/page-meta";
export const Route=createFileRoute("/engenharia")({head:()=>pageMeta("/engenharia","Engenharia de Ar Comprimido | TecAr","Eficiência energética, auditoria de sistemas, projeto de redes de ar e casa de máquinas para melhorar desempenho e reduzir perdas.","/assets/v2/tecar-engineering.png"),component:Page});
const areas=[[Zap,"Eficiência energética","Medições e estudos para entender como a energia elétrica está sendo convertida em energia pneumática útil."],[ClipboardCheck,"Diagnóstico e auditoria","Análise do sistema para identificar vazamentos, desperdícios, gargalos e oportunidades de melhoria."],[Gauge,"Projetos de ar comprimido","Dimensionamento do sistema de acordo com demanda, estabilidade operacional e requisitos do processo."],[Network,"Projeto de rede","Cálculo de diâmetro, velocidade e perda de carga para distribuir o ar de forma adequada."],[Building2,"Casa de máquinas","Projeto de espaço, ventilação, acesso e condições de instalação para preservar o equipamento."]] as const;
function Page(){return <PageFrame>
<PageHero kicker="ENGENHARIA" title="Ar comprimido deve ser dimensionado, medido e otimizado." text="A equipe de engenharia da TecAr trabalha com confiabilidade, eficiência e economia para melhorar a geração e a distribuição do ar comprimido." image="/assets/unique/generated/engineering-hero.webp"><a href="https://wa.me/5541996441330?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20TecAr." target="_blank" rel="noopener noreferrer" className="v2-primary">Solicitar diagnóstico</a></PageHero>
<EdSection>
 <EdHead title="Engenharia aplicada ao sistema completo"/>
 <EdCards items={areas.map(([icon,title,text])=>({icon,title,text}))}/>
</EdSection>
<EdSection tone="paper"><div className="ed-with-tool">
 <div><EdHead kicker="PERDAS" title="Transforme desperdício em número." text="Vazamento, queda de pressão e operação fora do ponto ideal podem elevar o consumo sem entregar mais produção. Use o simulador como referência inicial e confirme com medição de campo."/>
 <EdFact value="20% a 30%">é a faixa de desperdício por vazamentos citada no conteúdo técnico da própria TecAr para muitas instalações industriais.</EdFact></div>
 <EnergyLossTool/>
</div></EdSection>
<EdSection><EdSplit image="/assets/unique/generated/engineering-network.webp" alt="Imagem ilustrativa de inspeção da rede, criada por IA">
 <h2>A rede também faz parte da eficiência.</h2>
 <p>Tubulação subdimensionada, trajetos inadequados e perdas de carga podem comprometer pressão, consumo e estabilidade. O projeto precisa considerar a demanda real do processo.</p>
 <Link to="/linhas-de-ar" className="ed-link">Conhecer linhas de ar</Link>
</EdSplit></EdSection>
<ContactBand/></PageFrame>}
