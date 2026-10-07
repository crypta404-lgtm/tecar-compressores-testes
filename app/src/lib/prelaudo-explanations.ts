import { LEAK_TARGET_PERCENT, NETWORK_DROP_LIMIT_PERCENT, money, number, type Opportunity, type PrelaudoResult } from "@/lib/prelaudo-opportunities";
import type { CompressorProfile, Control } from "@/lib/compressor-profiles";

/*
 * "Por quê" of the pré-laudo: a short, plain-language lesson for every topic
 * and every alert, written with the visitor's own numbers. Used by the
 * "Memória de cálculo" tab and the PDF. Engineering claims follow the DOE /
 * Compressed Air Challenge Sourcebook and manufacturer guidance:
 * ~1% energy per 0.14 bar, 20–30% leaks in poorly maintained systems,
 * 25–40% of full-load power drawn while unloaded.
 */

export type ExplainedTopic = {
  id: string;
  title: string;
  /** what it is and why it matters, in short paragraphs */
  why: string[];
  memory: string[];
  alerts: Array<Opportunity & { why: string[] }>;
};

type Context = {
  model: CompressorProfile;
  control: Control;
  hours: number;
  loadPercent: number;
  demandCfm: number;
  supplyBar: number;
  pointBar: number;
  targetBar: number;
  pdpMeasured: number;
  pdpRequired: number;
};

const BAND_TEXT = {
  good: "está na faixa eficiente (abaixo de 21 kW/100 cfm)",
  watch: "está na faixa de atenção (entre 21 e 28 kW/100 cfm)",
  poor: "está na faixa crítica (acima de 28 kW/100 cfm)",
} as const;

function alertWhy(item: Opportunity, result: PrelaudoResult, ctx: Context): string[] {
  switch (item.id) {
    case "leaks":
      return [
        `Todo ar que vaza já foi comprimido e pago. Com ${number(result.leakPercent, 0)}% de vazamento, cerca de ${number(result.leakCfm, 1)} cfm saem pela rede sem fazer trabalho nenhum.`,
        "O vazamento não para: continua à noite, no almoço e no fim de semana enquanto a rede estiver pressurizada. Ele também derruba a pressão no ponto de uso, e a reação comum é subir o setpoint, o que encarece ainda mais.",
        `Sistemas mal mantidos perdem de 20% a 30% do ar. Um programa de detecção por ultrassom com correção de engates, conexões e drenos traz o sistema para perto de ${LEAK_TARGET_PERCENT}%.`,
      ];
    case "unload":
      return [
        `Em alívio, o motor continua girando, mas o compressor não entrega ar. Mesmo assim ele consome uma boa parte da potência: aqui, ${number(ctx.model.noLoadKw, 1)} kW durante ${number(100 - ctx.loadPercent, 0)}% do tempo.`,
        "Isso acontece porque um compressor de velocidade fixa só sabe trabalhar em dois estados, cheio ou vazio. Quando a demanda é menor que a capacidade, ele alterna entre os dois e paga o tempo vazio.",
        "Um compressor de velocidade variável ajusta a rotação à demanda e quase elimina esse tempo. Outra opção, quando há mais de um compressor, é um controle central que liga só o necessário.",
      ];
    case "setpoint":
      return [
        `A rede está saindo com ${number(ctx.supplyBar, 1)} bar e o processo precisa de ${number(ctx.targetBar, 1)} bar: são ${number(result.setpointReduction, 2)} bar a mais do que o necessário.`,
        "Comprimir mais alto exige mais energia: cerca de 1% a mais a cada 0,14 bar, ou perto de 7% por bar. Além disso, com pressão maior, os vazamentos e os usos sem regulador consomem mais ar (demanda artificial), e válvulas, mangueiras e vedações sofrem mais.",
        "Na prática, a pressão alta costuma ser um remédio para queda de pressão na rede ou para picos de consumo. Corrigir a causa (rede, reservatório, controle) permite baixar o setpoint sem faltar ar no ponto crítico.",
      ];
    case "network":
      return [
        `Entre a saída do reservatório (${number(ctx.supplyBar, 1)} bar) e o ponto crítico (${number(ctx.pointBar, 1)} bar) a rede perde ${number(result.pressureDropPercent, 1)}% da pressão. A referência é ficar abaixo de ${NETWORK_DROP_LIMIT_PERCENT}%.`,
        "Queda alta indica tubulação estreita para a vazão, filtros saturados, conexões restritivas ou rede sem anel. Cada bar perdido na rede precisa ser gerado a mais no compressor, e isso custa energia o ano todo.",
      ];
    case "capacity":
      return [
        `A demanda informada (${number(ctx.demandCfm, 0)} cfm) é maior que a capacidade de referência do compressor (${number(ctx.model.flowCfm, 0)} cfm).`,
        "Sem reserva, a pressão cai nos picos, ferramentas e máquinas perdem desempenho e o compressor trabalha sempre no limite, o que acelera o desgaste e aumenta o risco de parada.",
      ];
    case "dewpoint":
      return [
        `O ponto de orvalho medido (${number(ctx.pdpMeasured, 0)} °C) está acima do que o processo pede (${number(ctx.pdpRequired, 0)} °C).`,
        "O ponto de orvalho é a temperatura em que a umidade do ar comprimido vira água. Se a rede ou o equipamento esfriam abaixo dele, aparece água líquida: corrosão na tubulação, falha de válvulas e instrumentos e risco de contaminar o produto.",
        "Normalmente a causa está no secador (subdimensionado, sujo ou com dreno travado) ou na falta de filtragem adequada.",
      ];
    default:
      return [];
  }
}

export function explainPrelaudo(result: PrelaudoResult, ctx: Context): ExplainedTopic[] {
  const withWhy = (report: string) => result.opportunities.filter((item) => item.report === report).map((item) => ({ ...item, why: alertWhy(item, result, ctx) }));
  const savings = result.opportunities.filter((item) => item.saving !== null);

  return [
    {
      id: "efficiency",
      title: "Eficiência do compressor",
      why: [
        "A potência específica diz quantos kW o compressor consome para entregar 100 cfm de ar. É o \"consumo por litro\" do compressor: quanto menor, mais ar por real gasto.",
        `O seu valor, ${number(ctx.model.specificKw100Cfm, 1)} kW/100 cfm, ${BAND_TEXT[result.specificBand]}. Valores altos costumam vir de equipamento antigo, elemento compressor desgastado, resfriador sujo, pressão de trabalho alta ou controle inadequado.`,
      ],
      memory: [`Potência específica = ${number(ctx.model.packageKw, 1)} kW em carga ÷ ${number(ctx.model.flowCfm, 0)} cfm × 100 = ${number(ctx.model.specificKw100Cfm, 1)} kW/100 cfm`],
      alerts: [],
    },
    {
      id: "flow",
      title: "Vazão e vazamentos",
      why: [
        "A capacidade do compressor precisa cobrir a demanda da fábrica com folga. A reserva protege contra picos de consumo e contra a parada de um equipamento.",
        "Vazamento é a perda mais comum e a mais barata de corrigir: o ar já foi pago e escapa sem produzir nada.",
      ],
      memory: result.memory.flow,
      alerts: withWhy("flow"),
    },
    {
      id: "energy",
      title: "Energia",
      why: [
        "A energia é de 70% a 80% de tudo o que um compressor custa na vida útil. A compra do equipamento fica em 10% a 15%. Por isso, o compressor que consome menos quase sempre é o mais barato no fim das contas.",
        `O custo depende de quanto tempo o compressor trabalha em carga (produzindo ar) e em alívio (girando sem produzir). Aqui: ${number(ctx.loadPercent, 0)}% em carga e ${number(100 - ctx.loadPercent, 0)}% em alívio.`,
      ],
      memory: result.memory.energy,
      alerts: withWhy("energy"),
    },
    {
      id: "pressure",
      title: "Pressão",
      why: [
        "A pressão certa é a menor que ainda garante o funcionamento do ponto de uso mais exigente. Tudo acima disso é energia gasta à toa.",
        "Duas perguntas guiam a análise: quanto a rede perde no caminho (queda de pressão) e quanto o setpoint está acima do que o processo precisa.",
      ],
      memory: result.memory.pressure,
      alerts: withWhy("pressure"),
    },
    {
      id: "quality",
      title: "Qualidade do ar",
      why: [
        "A ISO 8573-1 classifica o ar comprimido por três contaminantes: partículas, água e óleo. Cada processo exige uma classe; alimentos, farmacêutica e pintura são os mais exigentes.",
        "O pré-laudo avalia a água pelo ponto de orvalho informado. Óleo e partículas só podem ser confirmados com medição no ponto de uso.",
      ],
      // same wording as the dew point alert, so the alert does not repeat it
      memory: [`PDP medido ${number(ctx.pdpMeasured, 0)} °C − requerido ${number(ctx.pdpRequired, 0)} °C = ${number(result.pdpGap, 1)} °C`],
      alerts: withWhy("quality"),
    },
    {
      id: "indicators",
      title: "Custo do ar e emissões",
      why: [
        `O custo por metro cúbico transforma a conta de luz em um número de produção: cada m³ de ar comprimido custa hoje R$ ${number(result.costPerM3, 3)} só de energia.`,
        "As emissões usam o fator médio da rede elétrica brasileira. Reduzir o consumo de ar comprimido também reduz a pegada de carbono da fábrica, o que ajuda em metas e relatórios ESG.",
      ],
      memory: [
        `Ar produzido = ${number(ctx.model.flowCfm, 0)} cfm × 0,0283 m³/ft³ × 60 min × ${number(ctx.hours, 0)} h × ${number(ctx.loadPercent, 0)}% em carga = ${number(result.producedM3, 0)} m³/ano`,
        `Custo do ar = ${money(result.annualCost)} ÷ ${number(result.producedM3, 0)} m³ = R$ ${number(result.costPerM3, 3)}/m³`,
        `Emissões = ${number(result.annualKwh, 0)} kWh × 0,0648 kg CO₂e/kWh (rede brasileira 2025, BEN 2026) = ${number(result.co2Kg / 1000, 2)} t CO₂e/ano`,
      ],
      alerts: [],
    },
    {
      id: "savings",
      title: "Oportunidades de economia",
      why: [
        "O total soma as economias de cada alerta. Na prática, elas interagem: corrigir vazamentos reduz a demanda e pode aumentar o tempo em alívio; baixar a pressão reduz o próprio vazamento.",
        "Por isso o total é uma referência para priorizar. A avaliação técnica em campo mede, combina as ações e confirma o resultado.",
      ],
      memory: savings.length ? result.totalMemory : [],
      alerts: [],
    },
  ];
}
