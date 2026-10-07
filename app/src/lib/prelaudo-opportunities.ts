import { CONTROLS, type CompressorProfile, type Control } from "@/lib/compressor-profiles";

/*
 * Improvement opportunities for the pré-laudo 360.
 *
 * Every alert is derived only from what the visitor entered and from the
 * selected compressor profile. Each one carries its own "memória de cálculo"
 * so the screen, the copied text and the PDF show exactly the same numbers.
 * Savings overlap (e.g. fixing leaks also changes time in unload), so the
 * total is presented as an indicative potential, not a sum to bank on.
 */

export type ReportId = "flow" | "energy" | "pressure" | "quality";

export type Opportunity = {
  id: string;
  report: ReportId;
  title: string;
  /** what TecAr would do about it */
  solution: string;
  /** R$/year, or null when the gain is not financial (risk, quality) */
  saving: number | null;
  memory: string[];
};

export const LEAK_TARGET_PERCENT = 5;
export const NETWORK_DROP_LIMIT_PERCENT = 10;
/** DOE Sourcebook: ~1% energy per 2 psig (≈0.138 bar) of setpoint reduction */
export const BAR_PER_PERCENT = 0.1378952;
const CFM_TO_M3MIN = 0.0283168;
/** Brazilian grid, 2025: 64,8 kg CO2e per MWh (BEN 2026 / EPE) */
export const CO2_KG_PER_KWH = 0.0648;

export const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
export const number = (value: number, digits = 1) => value.toLocaleString("pt-BR", { maximumFractionDigits: digits, minimumFractionDigits: digits });

export type PrelaudoInputs = {
  model: CompressorProfile;
  control: Control;
  tariff: number;
  hours: number;
  loadPercent: number;
  demandCfm: number;
  leakPercent: number;
  supplyBar: number;
  pointBar: number;
  targetBar: number;
  pdpMeasured: number;
  pdpRequired: number;
};

export function computePrelaudo(input: PrelaudoInputs) {
  const { model, control, tariff, hours, demandCfm, supplyBar, pointBar, targetBar, pdpMeasured, pdpRequired } = input;
  const loadRatio = Math.min(1, Math.max(0, input.loadPercent / 100));
  const leakPercent = Math.min(100, Math.max(0, input.leakPercent));
  const averageKw = model.packageKw * loadRatio + model.noLoadKw * (1 - loadRatio);
  const annualKwh = averageKw * hours;
  const annualCost = annualKwh * tariff;
  const reserveCfm = model.flowCfm - demandCfm;
  const reservePercent = model.flowCfm > 0 ? (reserveCfm / model.flowCfm) * 100 : 0;
  const leakCfm = (demandCfm * leakPercent) / 100;
  const specificPower = model.specificKw100Cfm;
  const leakPower = (leakCfm * specificPower) / 100;
  const leakCost = leakPower * hours * tariff;
  const pressureDrop = Math.max(0, supplyBar - pointBar);
  const pressureDropPercent = supplyBar > 0 ? (pressureDrop / supplyBar) * 100 : 0;
  const setpointReduction = Math.max(0, supplyBar - targetBar);
  const pressureSavingPercent = setpointReduction / BAR_PER_PERCENT;
  const pressureSaving = ((averageKw * pressureSavingPercent) / 100) * hours * tariff;
  const pdpGap = pdpMeasured - pdpRequired;
  const t = "R$ " + number(tariff, 5) + "/kWh";

  const memory = {
    flow: [
      `Vazamento = ${number(demandCfm, 0)} cfm × ${number(leakPercent, 0)}% = ${number(leakCfm, 1)} cfm`,
      `Reserva nominal = ${number(model.flowCfm, 0)} cfm (capacidade de referência) − ${number(demandCfm, 0)} cfm (demanda) = ${number(reserveCfm, 0)} cfm`,
      `Potência do vazamento = ${number(leakCfm, 1)} cfm × ${number(specificPower, 2)} kW/100 cfm ÷ 100 = ${number(leakPower, 2)} kW`,
      `Custo do vazamento = ${number(leakPower, 2)} kW × ${number(hours, 0)} h × ${t} = ${money(leakCost)}/ano`,
    ],
    energy: [
      `kW médio = ${number(model.packageKw, 1)} kW (carga) × ${number(loadRatio * 100, 0)}% + ${number(model.noLoadKw, 1)} kW (alívio) × ${number((1 - loadRatio) * 100, 0)}% = ${number(averageKw, 2)} kW`,
      `Energia anual = ${number(averageKw, 2)} kW × ${number(hours, 0)} h = ${number(annualKwh, 0)} kWh`,
      `Custo anual = ${number(annualKwh, 0)} kWh × ${t} = ${money(annualCost)}`,
    ],
    pressure: [
      `Queda na rede = ${number(supplyBar, 1)} bar − ${number(pointBar, 1)} bar = ${number(pressureDrop, 2)} bar (${number(pressureDropPercent, 1)}% da origem)`,
      `Redução de setpoint avaliada = ${number(supplyBar, 1)} bar − ${number(targetBar, 1)} bar = ${number(setpointReduction, 2)} bar`,
      `Economia de energia = ${number(setpointReduction, 2)} bar ÷ ${number(BAR_PER_PERCENT, 3)} bar por 1% = ${number(pressureSavingPercent, 1)}%`,
      `Referência anual = ${number(averageKw, 2)} kW médio × ${number(pressureSavingPercent, 1)}% × ${number(hours, 0)} h × ${t} = ${money(pressureSaving)}`,
    ],
  };

  const opportunities: Opportunity[] = [];

  if (demandCfm > model.flowCfm) {
    opportunities.push({
      id: "capacity",
      report: "flow",
      title: "Demanda acima da capacidade de referência",
      solution: "Reavaliar o dimensionamento: ampliação, compressor adicional ou locação para cobrir os picos sem perder pressão.",
      saving: null,
      memory: [`Demanda ${number(demandCfm, 0)} cfm > capacidade ${number(model.flowCfm, 0)} cfm (déficit de ${number(-reserveCfm, 0)} cfm)`],
    });
  }

  if (leakPercent > LEAK_TARGET_PERCENT && demandCfm > 0 && hours > 0) {
    const avoidCfm = (demandCfm * (leakPercent - LEAK_TARGET_PERCENT)) / 100;
    const avoidKw = (avoidCfm * specificPower) / 100;
    const saving = avoidKw * hours * tariff;
    opportunities.push({
      id: "leaks",
      report: "flow",
      title: `Vazamento de ${number(leakPercent, 0)}%: meta de ${LEAK_TARGET_PERCENT}% com programa de vazamentos`,
      solution: "Detecção por ultrassom, correção de engates, conexões e drenos, e rotina de verificação periódica.",
      saving,
      memory: [
        `Vazão recuperável = ${number(demandCfm, 0)} cfm × (${number(leakPercent, 0)}% − ${LEAK_TARGET_PERCENT}%) = ${number(avoidCfm, 1)} cfm`,
        `Potência evitada = ${number(avoidCfm, 1)} cfm × ${number(specificPower, 2)} kW/100 cfm ÷ 100 = ${number(avoidKw, 2)} kW`,
        `Economia = ${number(avoidKw, 2)} kW × ${number(hours, 0)} h × ${t} = ${money(saving)}/ano`,
      ],
    });
  }

  if (control === "loadUnload" && loadRatio < 1 && hours > 0) {
    const unloadHours = hours * (1 - loadRatio);
    const vsdIdleKw = model.packageKw * CONTROLS.vsd.noLoadRatio;
    const savedKw = Math.max(0, model.noLoadKw - vsdIdleKw);
    const saving = savedKw * unloadHours * tariff;
    if (saving > 0) {
      opportunities.push({
        id: "unload",
        report: "energy",
        title: `${number((1 - loadRatio) * 100, 0)}% do tempo em alívio: energia gasta sem produzir ar`,
        solution: "Compressor com velocidade variável (inversor) ou controle central que ajusta a produção à demanda e elimina o tempo em alívio.",
        saving,
        memory: [
          `Horas em alívio = ${number(hours, 0)} h × ${number((1 - loadRatio) * 100, 0)}% = ${number(unloadHours, 0)} h`,
          `Potência em alívio hoje = ${number(model.noLoadKw, 1)} kW; com velocidade variável ≈ ${number(vsdIdleKw, 1)} kW (8% da potência em carga)`,
          `Economia = (${number(model.noLoadKw, 1)} − ${number(vsdIdleKw, 1)}) kW × ${number(unloadHours, 0)} h × ${t} = ${money(saving)}/ano`,
        ],
      });
    }
  }

  if (setpointReduction > 0 && pressureSaving > 0) {
    opportunities.push({
      id: "setpoint",
      report: "pressure",
      title: `Setpoint ${number(setpointReduction, 2)} bar acima do alvo`,
      solution: "Reduzir o setpoint com pressão estabilizada no ponto crítico: ajuste de controle, reservatório e rede.",
      saving: pressureSaving,
      memory: memory.pressure.slice(1),
    });
  }

  if (pressureDropPercent >= NETWORK_DROP_LIMIT_PERCENT) {
    opportunities.push({
      id: "network",
      report: "pressure",
      title: `Queda de ${number(pressureDropPercent, 1)}% na rede (referência: até ${NETWORK_DROP_LIMIT_PERCENT}%)`,
      solution: "Revisão da rede de distribuição: diâmetros, anel, filtros e conexões. Uma rede melhor permite operar com setpoint menor.",
      saving: null,
      memory: [memory.pressure[0]],
    });
  }

  if (pdpGap > 0) {
    opportunities.push({
      id: "dewpoint",
      report: "quality",
      title: `Ponto de orvalho ${number(pdpGap, 1)} °C acima do requisito`,
      solution: "Adequar secador, filtros e drenos ao requisito do processo e confirmar com medição no ponto de uso.",
      saving: null,
      memory: [`PDP medido ${number(pdpMeasured, 0)} °C − requerido ${number(pdpRequired, 0)} °C = ${number(pdpGap, 1)} °C`],
    });
  }

  // Visual summary: where the annual cost goes, cost of air and benchmarks.
  const unloadCost = model.noLoadKw * (1 - loadRatio) * hours * tariff;
  const breakdown = [
    { id: "unload", label: "Alívio (sem produzir ar)", value: unloadCost },
    { id: "leaks", label: "Vazamentos", value: leakCost },
    { id: "pressure", label: "Pressão acima do alvo", value: pressureSaving },
  ];
  const wasteCost = breakdown.reduce((sum, item) => sum + item.value, 0);
  const usefulCost = Math.max(0, annualCost - wasteCost);
  const producedM3 = model.flowCfm * CFM_TO_M3MIN * 60 * hours * loadRatio;
  const costPerM3 = producedM3 > 0 ? annualCost / producedM3 : 0;
  const co2Kg = annualKwh * CO2_KG_PER_KWH;
  const specificBand: "good" | "watch" | "poor" = specificPower < 21 ? "good" : specificPower <= 28 ? "watch" : "poor";

  const withSaving = opportunities.filter((item) => item.saving !== null) as Array<Opportunity & { saving: number }>;
  const totalSaving = withSaving.reduce((sum, item) => sum + item.saving, 0);
  const totalMemory = withSaving.length
    ? [...withSaving.map((item) => `${item.title}: ${money(item.saving)}/ano`), `Potencial total = ${withSaving.map((item) => money(item.saving)).join(" + ")} = ${money(totalSaving)}/ano`]
    : [];

  return {
    loadRatio, leakPercent, averageKw, annualKwh, annualCost, reserveCfm, reservePercent, leakCfm, specificPower, leakPower, leakCost,
    pressureDrop, pressureDropPercent, setpointReduction, pressureSavingPercent, pressureSaving, pdpGap,
    memory, opportunities, totalSaving, totalMemory,
    unloadCost, breakdown, wasteCost, usefulCost, producedM3, costPerM3, co2Kg, specificBand,
    costAfter: Math.max(0, annualCost - totalSaving),
  };
}

export type PrelaudoResult = ReturnType<typeof computePrelaudo>;
